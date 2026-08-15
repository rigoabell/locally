import { useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'
import { CopyButton } from '../components/CopyButton'
import { Button, Field, Panel, Select, TextArea, TextInput } from '../components/ui'
import { downloadDataUrl } from '../lib/utils'

const LEVELS = ['L', 'M', 'Q', 'H'] as const

export function QrCodeTool() {
  const [text, setText] = useState('https://rigoabell.github.io/locally')
  const [size, setSize] = useState(256)
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('M')
  const [dark, setDark] = useState('#0f172a')
  const [light, setLight] = useState('#ffffff')
  const [dataUrl, setDataUrl] = useState<string>('')
  const [error, setError] = useState('')

  const canGenerate = useMemo(() => text.trim().length > 0, [text])

  async function generate() {
    setError('')
    try {
      const url = await QRCode.toDataURL(text.trim(), {
        width: size,
        margin: 2,
        errorCorrectionLevel: level,
        color: { dark, light },
      })
      setDataUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate a QR code for that input.')
      setDataUrl('')
    }
  }

  return (
    <Panel>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            void generate()
          }}
        >
          <Field label="Text or URL">
            <TextArea value={text} onChange={(event) => setText(event.target.value)} rows={5} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Size (px)">
              <TextInput
                type="number"
                min={128}
                max={1024}
                step={32}
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
              />
            </Field>
            <Field label="Error correction">
              <Select value={level} onChange={(event) => setLevel(event.target.value as (typeof LEVELS)[number])}>
                {LEVELS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Foreground">
              <TextInput type="color" value={dark} onChange={(event) => setDark(event.target.value)} />
            </Field>
            <Field label="Background">
              <TextInput type="color" value={light} onChange={(event) => setLight(event.target.value)} />
            </Field>
          </div>
          <Button type="submit" disabled={!canGenerate}>
            Generate QR code
          </Button>
          {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        </form>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-950">
          {dataUrl ? (
            <>
              <img src={dataUrl} alt="Generated QR code" className="h-auto w-full max-w-64 rounded-xl bg-white p-2" />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={() => downloadDataUrl(dataUrl, 'qr-code.png')}>
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
                <CopyButton value={text.trim()} label="Copy text" />
              </div>
            </>
          ) : (
            <p className="text-sm text-zinc-500">Generate a QR code to preview it here.</p>
          )}
        </div>
      </div>
    </Panel>
  )
}
