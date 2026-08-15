export type TextStats = {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  lines: number
  readingMinutes: number
  speakingMinutes: number
}

export function countText(text: string): TextStats {
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const sentences = text.trim() === '' ? 0 : (text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) ?? []).filter((part) => part.trim()).length
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter((part) => part.trim()).length
  const lines = text === '' ? 0 : text.split(/\n/).length
  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingMinutes: words / 200,
    speakingMinutes: words / 130,
  }
}

export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0 sec'
  if (minutes < 1) return `${Math.max(1, Math.round(minutes * 60))} sec`
  if (minutes < 60) return `${minutes < 10 ? minutes.toFixed(1) : Math.round(minutes)} min`
  const hours = Math.floor(minutes / 60)
  const rest = Math.round(minutes % 60)
  return `${hours} hr ${rest} min`
}
