import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { copyText } from '../lib/utils'
import { Button } from './ui'

type CopyButtonProps = {
  value: string
  label?: string
  disabled?: boolean
}

export function CopyButton({ value, label = 'Copy', disabled }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    const ok = await copyText(value)
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Button type="button" variant="secondary" onClick={onCopy} disabled={disabled || !value}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied' : label}
    </Button>
  )
}
