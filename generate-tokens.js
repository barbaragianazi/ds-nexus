// Script que gera tokens.css, tailwind-theme.css e tokens.flat.json a partir dos JSON do Figma. Rode com npm run generate:tokens.
import fs from "fs";

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const primitives = read("./src/tokens/primitives.json");
// O Figma exporta um arquivo por modo da coleção semantics.
const semantics = read("./src/tokens/semantics.light.tokens.json");
const semanticsDark = read("./src/tokens/semantics.dark.tokens.json");

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
// Nomes vindos dos semantics (usados para decidir o que vai ao tema Tailwind).
const semanticNames = new Set();
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
    if (source === "semantics") semanticNames.add(name);
  }
}

// Tema escuro: só entram os semantics cujo valor difere do light. O bloco do dark
// sobrescreve o :root, então o que é igual nos dois modos não precisa ser repetido.
const darkVars = new Map();
const darkNames = new Set();
for (const { path: rawPath, token } of collect(semanticsDark)) {
  const path = normalize(rawPath);
  if (isPlaceholder(token)) continue;
  const value = formatValue(path, token);
  if (value === null) continue;
  const name = `--${toKebab(path)}`;
  darkNames.add(name);
  if (!semanticNames.has(name)) {
    warn(`${name} existe no dark mas não no light; ignorado`);
    continue;
  }
  if (vars.get(name) !== value) darkVars.set(name, value);
}
for (const name of semanticNames) {
  if (!darkNames.has(name)) warn(`${name} existe no light mas não no dark; usa o valor do light`);
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
for (const [name, value] of [...vars, ...darkVars]) {
  for (const [, ref] of value.matchAll(/var\((--[^)]+)\)/g)) {
    if (!vars.has(ref)) warn(`${name} referencia ${ref}, que não existe`);
  }
}

// Tema Tailwind v4: só referencia as variáveis de tokens.css (nunca repete valores).
// Prefixo "nexus" evita colisão com a escala padrão do Tailwind e com tokens.css
// (ex.: --radius-md em tokens.css vs --radius-nexus-md no tema).
// namespace Tailwind -> utilities: color (bg-/text-), spacing (p-/gap-/m-), radius (rounded-),
// text (text-), leading, tracking, font-weight (font-), shadow.
const THEME_RULES = [
  // Semantics: cores e radius.
  { match: /^--color-(.+)$/, semantic: true, to: (m) => `--color-nexus-${m[1]}` },
  { match: /^--radius-(.+)$/, semantic: true, to: (m) => `--radius-nexus-${m[1]}` },
  // Primitives de layout e tipografia (escalas sem equivalente semântico).
  { match: /^--spacing-(.+)$/, to: (m) => `--spacing-nexus-${m[1]}` },
  { match: /^--typography-font-size-(.+)$/, to: (m) => `--text-nexus-${m[1]}` },
  { match: /^--typography-line-height-(.+)$/, to: (m) => `--leading-nexus-${m[1]}` },
  { match: /^--typography-letter-spacing-(.+)$/, to: (m) => `--tracking-nexus-${m[1]}` },
  { match: /^--typography-weight-(.+)$/, to: (m) => `--font-weight-nexus-${m[1]}` },
  // Efeitos compostos. Glow não tem namespace próprio: usa o de shadow.
  { match: /^--shadow-(.+)$/, to: (m) => `--shadow-nexus-${m[1]}` },
  { match: /^--glow-(.+)$/, to: (m) => `--shadow-nexus-glow-${m[1]}` },
];

const theme = [];
for (const name of vars.keys()) {
  for (const rule of THEME_RULES) {
    const m = name.match(rule.match);
    if (!m) continue;
    if (!rule.semantic || semanticNames.has(name)) theme.push(`  ${rule.to(m)}: var(${name});`);
    break;
  }
}

const tailwindCss = `/* Gerado por generate-tokens.js. Não edite manualmente. */
@theme inline {
${theme.join("\n")}
}
`;

// Light é o padrão (:root). O dark vale quando <html data-theme="dark">; o seletor
// :root[...] tem mais especificidade que :root, então vence independente da ordem.
const declarations = (map) => [...map].map(([name, value]) => `  ${name}: ${value};`).join("\n");
const css = `:root {
${declarations(vars)}
}

:root[data-theme="dark"] {
${declarations(darkVars)}
}
`;

fs.writeFileSync("./src/tokens/tokens.css", css);
fs.writeFileSync("./src/tokens/tailwind-theme.css", tailwindCss);

// Mapa plano { "--nome": "valor" } para o manager do Storybook, que não importa CSS (?raw).
fs.writeFileSync("./src/tokens/tokens.flat.json", JSON.stringify(Object.fromEntries(vars), null, 2) + "\n");

warnings.forEach((w) => console.warn(`aviso: ${w}`));
console.log(`tokens.css gerado com sucesso (${vars.size} variáveis, ${darkVars.size} sobrescritas no dark) e tailwind-theme.css (${theme.length} theme variables).`);
