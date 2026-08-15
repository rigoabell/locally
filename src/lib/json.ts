export type JsonResult =
  | { ok: true; formatted: string; minified: string }
  | { ok: false; error: string }

export function processJson(input: string, indent = 2): JsonResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { ok: false, error: 'Paste JSON to format or validate.' }
  }
  try {
    const parsed: unknown = JSON.parse(trimmed)
    return {
      ok: true,
      formatted: JSON.stringify(parsed, null, indent),
      minified: JSON.stringify(parsed),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON'
    return { ok: false, error: message }
  }
}
