'use client'

import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  children: string
  className?: string
  inline?: boolean
}

export default function CodeBlock({ children, className, inline, ...props }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : 'text'

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  if (inline) {
    return (
      <code className="bg-gray-200 dark:bg-gray-800 text-primary px-1 py-0.5 rounded text-sm" {...props}>
        {children}
      </code>
    )
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`absolute right-2 top-2 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm"
          onClick={copyToClipboard}
        >
          <span className="sr-only">{isCopied ? 'Copied' : 'Copy code'}</span>
          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <SyntaxHighlighter
        style={atomDark}
        language={language}
        PreTag="div"
        className="rounded-md my-4 p-4 text-sm max-w-full overflow-x-auto"
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}