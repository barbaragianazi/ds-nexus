// Função token(): lê o valor final de um token a partir do tokens.flat.json gerado.
// Única ponte entre o Storybook e os tokens. Cadeia:
//   primitives.json + semantics.{light,dark}.tokens.json -> generate-tokens.js -> tokens.flat.json -> aqui
// O manager não lê CSS variables nem importa .css (?raw), então usa o JSON plano gerado junto.
import flat from '../src/tokens/tokens.flat.json';

const values = new Map<string, string>(Object.entries(flat as Record<string, string>));

function resolve(name: string, depth = 0): string {
  const value = values.get(name);
  if (value === undefined) {
    throw new Error(`[storybook] token ${name} não existe nos tokens gerados. Ele foi renomeado ou removido nos JSON?`);
  }
  const ref = value.match(/^var\((--[\w-]+)\)$/);
  return ref && depth < 5 ? resolve(ref[1], depth + 1) : value;
}

/** Valor final de um token, ex.: token('color-neutral-700') -> '#101011'. */
export const token = (name: string) => resolve(`--${name}`);
