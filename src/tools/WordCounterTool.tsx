import { useMemo, useState } from 'react'
import { CopyButton } from '../components/CopyButton'
import { Button, Panel, Stat, TextArea } from '../components/ui'
import { countText, formatDuration } from '../lib/wordCount'

export function WordCounterTool() {
  const [text, setText] = useState('')
  const stats = useMemo(() => countText(text), [text])

  return (
    <Panel>
      <TextArea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste or type text to count words, characters, sentences, and reading time."
        rows={12}
        className="font-sans text-sm"
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Words" value={stats.words.toLocaleString()} />
        <Stat label="Characters" value={stats.characters.toLocaleString()} />
        <Stat label="No spaces" value={stats.charactersNoSpaces.toLocaleString()} />
        <Stat label="Sentences" value={stats.sentences.toLocaleString()} />
        <Stat label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
        <Stat label="Lines" value={stats.lines.toLocaleString()} />
        <Stat label="Reading time" value={formatDuration(stats.readingMinutes)} />
        <Stat label="Speaking time" value={formatDuration(stats.speakingMinutes)} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton value={text} label="Copy text" disabled={!text} />
        <Button type="button" variant="ghost" onClick={() => setText('')} disabled={!text}>
          Clear
        </Button>
      </div>
    </Panel>
  )
}
