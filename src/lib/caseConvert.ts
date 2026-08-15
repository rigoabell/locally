function splitWords(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase())
}

export function toUpperCase(text: string): string {
  return text.toUpperCase()
}

export function toLowerCase(text: string): string {
  return text.toLowerCase()
}

export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^|[\s"'(])(\p{L})/gu, (match) => match.toUpperCase())
}

export function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\p{L})|([.!?…]\s+\p{L})/gu, (match) => match.toUpperCase())
}

export function toCamelCase(text: string): string {
  const [first, ...rest] = splitWords(text)
  if (!first) return ''
  return first + rest.map(capitalize).join('')
}

export function toPascalCase(text: string): string {
  return splitWords(text).map(capitalize).join('')
}

export function toSnakeCase(text: string): string {
  return splitWords(text).join('_')
}

export function toKebabCase(text: string): string {
  return splitWords(text).join('-')
}

export function toConstantCase(text: string): string {
  return splitWords(text).join('_').toUpperCase()
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export const CASE_MODES = [
  { id: 'upper', label: 'UPPER CASE', convert: toUpperCase },
  { id: 'lower', label: 'lower case', convert: toLowerCase },
  { id: 'title', label: 'Title Case', convert: toTitleCase },
  { id: 'sentence', label: 'Sentence case', convert: toSentenceCase },
  { id: 'camel', label: 'camelCase', convert: toCamelCase },
  { id: 'pascal', label: 'PascalCase', convert: toPascalCase },
  { id: 'snake', label: 'snake_case', convert: toSnakeCase },
  { id: 'kebab', label: 'kebab-case', convert: toKebabCase },
  { id: 'constant', label: 'CONSTANT_CASE', convert: toConstantCase },
] as const
