import { useCallback, useState } from 'react'

export function useClipboard() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = useCallback(async (text: string, label = text) => {
    try {
      if (globalThis.navigator?.clipboard && globalThis.isSecureContext) {
        await globalThis.navigator.clipboard.writeText(text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.append(textarea)
        textarea.select()
        document.execCommand('copy')
        textarea.remove()
      }
      setCopied(label)
      globalThis.setTimeout(() => setCopied(null), 1600)
      return true
    } catch {
      setCopied(null)
      return false
    }
  }, [])

  return { copied, copy }
}
