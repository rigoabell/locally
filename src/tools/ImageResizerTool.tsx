import { useRef, useState } from 'react'
import { Download, ImageUp } from 'lucide-react'
import { Button, Field, Panel, Select, Stat, TextInput, Toggle } from '../components/ui'
import {
  FORMAT_EXTENSION,
  loadImageSize,
  processImage,
  type ImageFormat,
  type ProcessedImage,
} from '../lib/image'
import { downloadBlob, formatBytes } from '../lib/utils'

export function ImageResizerTool() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState('')
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [lockAspect, setLockAspect] = useState(true)
  const [quality, setQuality] = useState(0.8)
  const [format, setFormat] = useState<ImageFormat>('image/jpeg')
  const [result, setResult] = useState<ProcessedImage | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onFile(next: File | null) {
    if (result?.url) URL.revokeObjectURL(result.url)
    if (originalUrl) URL.revokeObjectURL(originalUrl)
    setResult(null)
    setFile(next)
    setError('')
    if (!next) {
      setOriginalUrl('')
      return
    }
    if (!next.type.startsWith('image/')) {
      setError('Choose an image file (JPG, PNG, WebP, or GIF).')
      setFile(null)
      return
    }
    try {
      const size = await loadImageSize(next)
      setWidth(size.width)
      setHeight(size.height)
      setOriginalUrl(URL.createObjectURL(next))
    } catch {
      setError('This browser could not read that image.')
      setFile(null)
    }
  }

  async function run() {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      if (result) URL.revokeObjectURL(result.url)
      const processed = await processImage(file, { width, height, quality, format, lockAspect })
      setResult(processed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not process the image.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel>
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-10 text-center dark:border-zinc-700 dark:bg-zinc-950"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          void onFile(event.dataTransfer.files[0] ?? null)
        }}
        onClick={() => inputRef.current?.click()}
      >
        <ImageUp className="h-8 w-8 text-violet-600" />
        <p className="mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">Drop an image here or click to choose</p>
        <p className="mt-1 text-xs text-zinc-500">Processed in your browser. Nothing is uploaded.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void onFile(event.target.files?.[0] ?? null)}
        />
      </div>

      {file ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Width (px)">
                <TextInput type="number" min={1} max={8192} value={width} onChange={(event) => setWidth(Number(event.target.value))} />
              </Field>
              <Field label="Height (px)">
                <TextInput
                  type="number"
                  min={1}
                  max={8192}
                  value={height}
                  onChange={(event) => setHeight(Number(event.target.value))}
                />
              </Field>
            </div>
            <Toggle checked={lockAspect} onChange={setLockAspect} label="Keep aspect ratio" />
            <Field label={`Quality: ${Math.round(quality * 100)}%`}>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="w-full accent-violet-600"
                disabled={format === 'image/png'}
              />
            </Field>
            <Field label="Output format">
              <Select value={format} onChange={(event) => setFormat(event.target.value as ImageFormat)}>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </Select>
            </Field>
            <Button type="button" onClick={() => void run()} disabled={busy}>
              {busy ? 'Processing…' : 'Resize / compress'}
            </Button>
          </div>
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="Original" value={formatBytes(file.size)} />
              <Stat label="Result" value={result ? formatBytes(result.blob.size) : '—'} />
            </div>
            {(result?.url ?? originalUrl) ? (
              <img
                src={result?.url ?? originalUrl}
                alt={result ? 'Processed image preview' : 'Original image preview'}
                className="max-h-80 w-full rounded-2xl object-contain bg-zinc-100 dark:bg-zinc-950"
              />
            ) : null}
            {result ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => downloadBlob(result.blob, `resized.${FORMAT_EXTENSION[format]}`)}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
    </Panel>
  )
}
