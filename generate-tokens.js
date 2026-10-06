import fs from "fs";

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const primitives = read("./src/tokens/primitives.json");
const semantics = read("./src/tokens/semantics.json");

// Segmentos de caminho cujos valores numéricos levam "px".
const PX_GROUPS = new Set([
  "spacing",
  "radius",
  "font-size",
  "line-height",
  "letter-spacing",
  "effects",
]);

// Grupos de aparência duplicados nos primitives; valem os de semantics.
const SKIP_PRIMITIVE_GROUPS = new Set(["surface", "on-surface", "container"]);

// Font weight do Figma (nome do estilo) -> valor numérico de CSS.
const FONT_WEIGHTS = { light: 300, regular: 400, bold: 700, "extra bold": 800 };

// O Figma não exporta a cor dos Effect Styles; ela é definida aqui.
// grupo de effects -> token de cor (nome da variável CSS, sem "--").
const EFFECT_COLORS = {
  shadow: "color-neutral-200",
  glow: "color-blue-400",
};

const warnings = [];
const warn = (msg) => warnings.push(msg);

const toKebab = (path) => path.join("-");

// Aceita "colors" (export antigo) e "color" como a mesma raiz: sempre "color".
const normalize = (path) => (path[0] === "colors" ? ["color", ...path.slice(1)] : path);

const hex2 = (n) =>
  Math.round(n * 255).toString(16).padStart(2, "0");

function colorToCss({ components, alpha = 1, hex }) {
  if (alpha < 1) {
    const [r, g, b] = components.map((c) => Math.round(c * 255));
    return `rgb(${r} ${g} ${b} / ${Number(alpha.toFixed(3))})`;
  }
  return (hex ?? `#${components.map(hex2).join("")}`).toLowerCase();
}

function isPlaceholder(token) {
  return token.$type === "string" && token.$value === "String value";
}

// Percorre o JSON do Figma e devolve tokens { path, token }.
function collect(obj, prefix = [], out = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$") || !value || typeof value !== "object") continue;
    if ("$value" in value) out.push({ path: [...prefix, key], token: value });
    else collect(value, [...prefix, key], out);
  }
  return out;
}

function formatValue(path, token) {
  const { $type: type, $value: value } = token;
  let css;

  if (type === "color" && typeof value === "object") {
    css = colorToCss(value);
  } else if (typeof value === "string") {
    const weight = FONT_WEIGHTS[value.toLowerCase()];
    if (path.includes("weight") && weight) css = String(weight);
    // {colors.neutral.50} -> var(--color-neutral-50)
    else css = value.replace(/{([^}]+)}/g, (_, ref) => `var(--${toKebab(normalize(ref.split(".")))})`);
  } else if (typeof value === "number") {
    const withUnit = path.some((p) => PX_GROUPS.has(p));
    css = withUnit ? `${Number(value.toFixed(3))}px` : String(value);
  } else {
    return null;
  }

  // Semantics: o Figma exporta o valor resolvido + aliasData apontando para o
  // primitivo. Usa var(...) quando o alvo existe e tem o mesmo valor.
  const alias = token.$extensions?.["com.figma.aliasData"];
  if (alias?.targetVariableSetName === "primitives") {
    const target = toKebab(normalize(alias.targetVariableName.split("/")));
    // Mesmo nome do primitivo (ex.: radius/0): alias seria auto-referência.
    if (target === toKebab(path)) return css;
    if (primitiveValues.get(target) === css) return `var(--${target})`;
    warn(`alias ${path.join("/")} -> ${alias.targetVariableName} não bate com o valor (${css}); usando valor literal`);
  }
  return css;
}

// Valores resolvidos dos primitivos, usados para validar aliases dos semantics.
const primitiveValues = new Map();

// Map garante um único nome; em duplicatas, semantics vence (vem depois).
const vars = new Map();
for (const [source, tree] of [["primitives", primitives], ["semantics", semantics]]) {
  for (const { path: rawPath, token } of collect(tree)) {
    const path = normalize(rawPath);
    const label = `${source}:${rawPath.join("/")}`;
    if (isPlaceholder(token)) {
      warn(`ignorado placeholder ${label}`);
      continue;
    }
    if (source === "primitives" && SKIP_PRIMITIVE_GROUPS.has(path[1])) continue;
    const value = formatValue(path, token);
    if (value === null) {
      warn(`ignorado ${label} (tipo não suportado)`);
      continue;
    }
    const name = `--${toKebab(path)}`;
    if (source === "primitives") primitiveValues.set(toKebab(path), value);
    if (vars.has(name) && vars.get(name) !== value) {
      warn(`${name} duplicado com valores diferentes (${vars.get(name)} -> ${value}); ${source} prevalece`);
    }
    vars.set(name, value);
  }
}

// Compõe --shadow-sm, --glow-md etc. a partir de x/y/blur/spread + cor.
for (const [group, color] of Object.entries(EFFECT_COLORS)) {
  for (const size of ["sm", "md", "lg"]) {
    const part = (p) => vars.get(`--effects-${group}-${size}-${p}`);
    const [x, y, blur, spread] = ["x", "y", "blur", "spread"].map(part);
    if ([x, y, blur, spread].some((v) => v === undefined)) continue;
    vars.set(`--${group}-${size}`, `${x} ${y} ${blur} ${spread} var(--${color})`);
  }
}

// Valida referências var(--x) para tokens existentes.
for (const [name, value] of vars) {
  for (const [, ref] of value.matchAll(/var\((--[^)]+)\)/g)) {
    if (!vars.has(ref)) warn(`${name} referencia ${ref}, que não existe`);
  }
}

const css = `:root {
${[...vars].map(([name, value]) => `  ${name}: ${value};`).join("\n")}
}
`;

fs.writeFileSync("./src/tokens/tokens.css", css);

warnings.forEach((w) => console.warn(`aviso: ${w}`));
console.log(`tokens.css gerado com sucesso (${vars.size} variáveis).`);
