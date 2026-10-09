// Script que gera o design.md a partir dos JSON de tokens e dos componentes. Rode com npm run generate:design.
import fs from "fs";
import path from "path";

// Gera design.md a partir de src/tokens/{primitives,semantics.light.tokens,semantics.dark.tokens}.json e de src/components.
// Uso: node generate-design-md.js

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const primitives = read("./src/tokens/primitives.json");
// O Figma exporta um arquivo por modo da coleção semantics.
const semantics = read("./src/tokens/semantics.light.tokens.json");
const semanticsDark = read("./src/tokens/semantics.dark.tokens.json");

// Caminhos cujos valores numéricos levam "px".
const PX_GROUPS = new Set([
  "spacing",
  "radius",
  "font-size",
  "line-height",
  "letter-spacing",
  "effects",
]);

// Aceita "colors" (export antigo) e "color" como a mesma raiz.
const normalize = (segments) =>
  segments[0] === "colors" ? ["color", ...segments.slice(1)] : segments;

// ---------- tokens ----------

// Percorre o JSON do Figma e devolve [{ path, token }] na ordem do arquivo.
function collect(obj, prefix = [], out = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$") || !value || typeof value !== "object") continue;
    if ("$value" in value) out.push({ path: [...prefix, key], token: value });
    else collect(value, [...prefix, key], out);
  }
  return out;
}

const trimNumber = (n) => String(Number(n.toFixed(3)));

function hexOf({ components, alpha = 1, hex }) {
  const h = (n) => Math.round(n * 255).toString(16).padStart(2, "0");
  const base = (hex ?? `#${components.map(h).join("")}`).toUpperCase();
  return alpha < 1 ? `${base} (alpha ${trimNumber(alpha)})` : base;
}

function formatValue(tokenPath, { $value: value }) {
  if (value && typeof value === "object") {
    return "components" in value ? hexOf(value) : JSON.stringify(value);
  }
  if (typeof value === "number") {
    return tokenPath.some((p) => PX_GROUPS.has(p)) ? `${trimNumber(value)}px` : trimNumber(value);
  }
  if (typeof value === "string") {
    // Referência no formato {colors.neutral.200}
    const ref = value.match(/^\{([^}]+)\}$/);
    return ref ? `ref ${normalize(ref[1].split(".")).join("/")}` : value;
  }
  return String(value);
}

// Alias vem somente de aliasData; nunca é inferido.
function aliasOf(token) {
  const name = token.$extensions?.["com.figma.aliasData"]?.targetVariableName;
  return name ? normalize(name.split("/")).join("/") : null;
}

const fullName = (tokenPath) => normalize(tokenPath).join("/");

// ---------- helpers de markdown ----------

const titleCase = (s) =>
  s
    .split(/[-_ ]+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

// Agrupa tokens pelo segmento em `depth`, preservando a ordem de aparição.
function groupBy(tokens, depth) {
  const groups = new Map();
  for (const t of tokens) {
    const norm = normalize(t.path);
    const key = norm[depth] ?? "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  }
  return groups;
}

const orderKeys = (keys, preferred) => [
  ...preferred.filter((k) => keys.includes(k)),
  ...keys.filter((k) => !preferred.includes(k)),
];

function primitiveLines(tokens) {
  return tokens.map(({ path: p, token }) => `- \`${fullName(p)}\`: \`${formatValue(p, token)}\``);
}

// Tokens do modo dark indexados pelo nome completo.
const darkByName = new Map(collect(semanticsDark).map(({ path: p, token }) => [fullName(p), { p, token }]));

function semanticLines(tokens) {
  return tokens.flatMap(({ path: p, token }) => {
    const lines = [`- \`${fullName(p)}\``, `  - value (light): \`${formatValue(p, token)}\``];
    const alias = aliasOf(token);
    if (alias) lines.push(`  - alias (light): \`${alias}\``);

    const dark = darkByName.get(fullName(p));
    if (dark) {
      const darkValue = formatValue(dark.p, dark.token);
      const darkAlias = aliasOf(dark.token);
      if (darkValue === formatValue(p, token) && darkAlias === alias) {
        lines.push("  - dark: igual ao light");
      } else {
        lines.push(`  - value (dark): \`${darkValue}\``);
        if (darkAlias) lines.push(`  - alias (dark): \`${darkAlias}\``);
      }
    }
    return lines;
  });
}

// Effects: um bloco por efeito (ex.: effects/shadow/sm) com x, y, blur, spread.
function effectLines(tokens) {
  const byEffect = new Map();
  for (const { path: p, token } of tokens) {
    const norm = normalize(p);
    const key = norm.slice(0, -1).join("/");
    if (!byEffect.has(key)) byEffect.set(key, []);
    byEffect.get(key).push(`${norm[norm.length - 1]} ${formatValue(p, token)}`);
  }
  return [...byEffect].map(([key, fields]) => `- \`${key}\`: ${fields.join(", ")}`);
}

// ---------- seções de tokens ----------

function primitiveSection() {
  const all = collect(primitives);
  const roots = groupBy(all, 0);
  const out = ["## Primitive Tokens", "", "Valores-base exportados do Figma (`src/tokens/primitives.json`).", ""];

  for (const root of orderKeys([...roots.keys()], ["color", "typography", "spacing", "radius", "effects"])) {
    const tokens = roots.get(root);
    out.push(`### ${titleCase(root)}`, "");

    if (root === "effects") {
      const kinds = groupBy(tokens, 1);
      for (const kind of kinds.keys()) {
        out.push(`#### ${titleCase(kind)}`, "", ...effectLines(kinds.get(kind)), "");
      }
      out.push(
        "A cor de shadow e glow não está presente nos tokens exportados e, por isso, não é documentada aqui.",
        "",
      );
      continue;
    }

    const subs = groupBy(tokens, 1);
    // Tokens sem subgrupo (ex.: spacing/4) ficam direto na seção.
    const hasSubgroups = tokens.some((t) => normalize(t.path).length > 2);
    if (!hasSubgroups) {
      out.push(...primitiveLines(tokens), "");
      continue;
    }
    const preferred = root === "typography" ? ["font-size", "line-height", "letter-spacing", "weight"] : [];
    for (const sub of orderKeys([...subs.keys()], preferred)) {
      out.push(`#### ${titleCase(sub)}`, "", ...primitiveLines(subs.get(sub)), "");
    }
  }
  return out;
}

function semanticSection() {
  const all = collect(semantics);
  const roots = groupBy(all, 0);
  const out = [
    "## Semantic Tokens",
    "",
    "Tokens com intenção de uso (`src/tokens/semantics.light.tokens.json` e `semantics.dark.tokens.json`, um arquivo por modo). O alias indica o primitive de origem e só aparece quando o Figma o exporta. O tema escuro vale quando `<html data-theme=\"dark\">`; sem o atributo, vale o light.",
    "",
  ];

  for (const root of roots.keys()) {
    const tokens = roots.get(root);
    if (root === "color") {
      const subs = groupBy(tokens, 1);
      for (const sub of subs.keys()) {
        out.push(`### ${titleCase(sub)}`, "", ...semanticLines(subs.get(sub)), "");
      }
    } else {
      out.push(`### ${titleCase(root)}`, "", ...semanticLines(tokens), "");
    }
  }
  return out;
}

// ---------- componentes ----------

const COMPONENTS_DIR = "./src/components";

// Colapsa espaços e quebras de linha de uma expressão de tipo.
const clean = (s) => s.replace(/\s+/g, " ").trim();

function unionTypes(source) {
  const unions = new Map();
  for (const m of source.matchAll(/export type (\w+)\s*=\s*((?:"[^"]*"\s*\|?\s*)+);/g)) {
    unions.set(m[1], [...m[2].matchAll(/"([^"]*)"/g)].map((x) => x[1]));
  }
  return unions;
}

// Lê o corpo `{ ... }` de `export type XProps = ...` e devolve props de primeiro nível.
function propsOf(source) {
  const start = source.search(/export type \w*Props\s*=/);
  if (start === -1) return [];
  // Primeiro "{" após o "=": cobre `= {` e `= Omit<...> & {`.
  const open = source.indexOf("{", start);
  if (open === -1) return [];

  let depth = 0;
  let end = open;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}" && --depth === 0) {
      end = i;
      break;
    }
  }

  const props = [];
  let doc = null;
  for (const line of source.slice(open + 1, end).split("\n")) {
    const comment = line.match(/^\s{2}\/\*\*\s*(.*?)\s*\*\/\s*$/);
    if (comment) {
      doc = comment[1];
      continue;
    }
    const prop = line.match(/^\s{2}(\w+)(\?)?:\s*(.+?);\s*$/);
    if (prop) {
      props.push({ name: prop[1], optional: Boolean(prop[2]), type: clean(prop[3]), doc });
    }
    doc = null;
  }
  return props;
}

function componentSection() {
  const out = [
    "## Components",
    "",
    "Lista gerada a partir de `src/components`. Props e tipos são lidos do código; regras de uso ainda não foram documentadas.",
    "",
  ];

  if (!fs.existsSync(COMPONENTS_DIR)) return [...out, "Nenhum componente encontrado.", ""];

  const names = fs
    .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  if (names.length === 0) return [...out, "Nenhum componente encontrado.", ""];

  for (const name of names) {
    const dir = path.join(COMPONENTS_DIR, name);
    const file = path.join(dir, `${name}.tsx`);
    out.push(`### ${name}`, "", "Status: draft", "");
    if (!fs.existsSync(file)) {
      out.push("Arquivo do componente não encontrado.", "");
      continue;
    }

    const source = fs.readFileSync(file, "utf8");
    const unions = unionTypes(source);
    const posix = (p) => p.split(path.sep).join("/").replace(/^\.\//, "");
    out.push(`- source: \`${posix(file)}\``);
    if (fs.existsSync(path.join(dir, `${name}.stories.tsx`))) {
      out.push(`- stories: \`${posix(path.join(dir, `${name}.stories.tsx`))}\``);
    }
    out.push("");

    if (unions.size > 0) {
      out.push("Tipos com valores explícitos:", "");
      for (const [type, values] of unions) {
        out.push(`- \`${type}\`: ${values.map((v) => `\`${v}\``).join(", ")}`);
      }
      out.push("");
    }

    const props = propsOf(source);
    if (props.length > 0) {
      out.push("Props:", "");
      for (const p of props) {
        const values = unions.get(p.type);
        const type = values ? `${p.type} (${values.map((v) => `"${v}"`).join(" | ")})` : p.type;
        out.push(`- \`${p.name}${p.optional ? "?" : ""}\`: \`${type}\`${p.doc ? ` - ${p.doc}` : ""}`);
      }
      out.push("");
    }
  }
  return out;
}

// ---------- documento ----------

const header = [
  "# Design System Nexus",
  "",
  "> Status: em construção",
  "> Este documento é gerado automaticamente a partir dos tokens do Design System e será evoluído junto com os componentes e regras de uso.",
  "",
  "Arquivo gerado por `generate-design-md.js`. Não edite manualmente: altere os tokens ou o código e gere novamente com `npm run generate:design` (ou `npm run generate:ds` para atualizar também `tokens.css`, `tokens.flat.json` e `tailwind-theme.css`).",
  "",
  "O Design System ainda está em desenvolvimento:",
  "",
  "- tokens, componentes e regras podem sofrer alterações;",
  "- implementações devem priorizar os tokens e componentes documentados aqui.",
  "",
];

const rules = [
  "## Regras gerais",
  "",
  "- Priorizar tokens semânticos em componentes.",
  "- Usar primitives apenas quando não existir semantic adequado.",
  "- Evitar valores hardcoded de cor, spacing, radius, tipografia e efeitos.",
  "- Primitives representam valores-base.",
  "- Semantics representam intenção e finalidade de uso.",
  "- Componentes devem consumir semantics sempre que possível.",
  "- Não criar novos tokens diretamente no código sem refletir essa decisão no Design System/Figma.",
  "- O Storybook é a referência visual e funcional dos componentes implementados.",
  "- O design.md é a referência textual estruturada para pessoas e agentes de IA.",
  "",
];

const tailwind = [
  "## Tailwind CSS",
  "",
  "- Tailwind CSS v4 é suportado pelo Design System.",
  "- `primitives.json`, `semantics.light.tokens.json` e `semantics.dark.tokens.json` continuam sendo a fonte de verdade.",
  "- `src/tokens/tokens.css` contém as CSS Custom Properties oficiais.",
  "- `src/tokens/tailwind-theme.css` expõe tokens selecionados para utilities Tailwind, sempre via `var(--...)` de `tokens.css` e com o prefixo `nexus`.",
  "- `src/styles/tailwind.css` é a entrada do Tailwind (theme + utilities, sem preflight).",
  "- Componentes devem priorizar semantic tokens.",
  "- Valores arbitrários devem ser evitados quando existir token equivalente.",
  "- `tokens.css` e `tailwind-theme.css` são arquivos gerados por `generate-tokens.js` e não devem ser editados manualmente.",
  "",
  "Utilities disponíveis:",
  "",
  "- Cores (semantics): `bg-nexus-surface-brand`, `text-nexus-text-primary`, `border-nexus-feedback-danger-default`",
  "- Radius (semantics): `rounded-nexus-md`",
  "- Spacing (primitives): `p-nexus-16`, `gap-nexus-8`, `m-nexus-4`",
  "- Tipografia: `text-nexus-16` (font-size), `leading-nexus-24`, `tracking-nexus-wide`, `font-nexus-bold`",
  "- Efeitos: `shadow-nexus-md`, `shadow-nexus-glow-md`",
  "",
  "Primitives de cor (`--color-blue-500` etc.) ficam disponíveis apenas via `var()` em `tokens.css`, sem utility Tailwind.",
  "",
];

const maturity = [
  "## Maturity",
  "",
  "- Foundations: draft",
  "- Components: draft",
  "- Documentation: draft",
  "",
  "Significado dos status:",
  "",
  "- `draft`: pode sofrer alterações",
  "- `stable`: aprovado para uso consistente",
  "- `deprecated`: evitar uso",
  "",
];

const maintenance = [
  "## Manutenção",
  "",
  "Sempre que houver alteração que impacte o Design System, o design.md deve ser regenerado. São impactos:",
  "",
  "- novos tokens ou alteração de tokens",
  "- novos Foundations",
  "- novos componentes",
  "- alteração de props, novas variantes ou novos estados",
  "- regras de uso e acessibilidade",
  "- depreciação de componentes",
  "- mudanças estruturais do Design System",
  "",
  "Comando: `npm run generate:ds`",
  "",
  "Fluxo ao atualizar tokens do Figma:",
  "",
  "1. Atualize `src/tokens/primitives.json`, `src/tokens/semantics.light.tokens.json` e `src/tokens/semantics.dark.tokens.json` com o export do Figma.",
  "2. Rode `npm run dev`, `npm run storybook` ou `npm run build`: o `generate:ds` roda automaticamente antes e tudo já está atualizado.",
  "3. Para só regenerar os arquivos, sem subir nada, use `npm run generate:ds`.",
  "",
];

const doc = [
  ...header,
  ...rules,
  ...primitiveSection(),
  ...semanticSection(),
  ...tailwind,
  ...componentSection(),
  ...maturity,
  ...maintenance,
]
  .join("\n")
  .replace(/\n{3,}/g, "\n\n")
  .trimEnd()
  .concat("\n");

fs.writeFileSync("./design.md", doc);
console.log(`design.md gerado com sucesso (${doc.split("\n").length} linhas).`);
