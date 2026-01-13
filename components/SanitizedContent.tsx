'use client'

import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'

interface SanitizedContentProps {
  content: string
  className?: string
}

export default function SanitizedContent({ content, className }: SanitizedContentProps) {
  const [sanitizedHTML, setSanitizedHTML] = useState('')

  useEffect(() => {
    if (content && typeof window !== 'undefined') {
      setSanitizedHTML(DOMPurify.sanitize(content))
    }
  }, [content])

  if (!sanitizedHTML) return null

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  )
}