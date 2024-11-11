'use client'

import React from 'react'
import { Maximize2, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Message {
  id: string
  type_u: string
  content: string
  createdAt: string
  attachments?: Array<{
    name: string
    url: string
  }>
}

interface FullScreenDialogProps {
  message: Message
}

export default function FullScreenDialog({ message }: FullScreenDialogProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(false)

  if (message.type_u === "user") {
    return null
  }

  return (
    <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="px-2 py-1 text-sm"
                onClick={() => setIsFullScreen(true)}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Full Screen
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View in full screen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="w-[95vw] h-[95vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">AI Response</DialogTitle>

          </div>
        </DialogHeader>
        <ScrollArea className="h-[calc(95vh-80px)] p-6">
          <Markdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-medium mt-5 mb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-4 leading-relaxed text-base" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold" {...props} />
              ),
              em: ({ node, ...props }) => <em className="italic" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 pl-4 italic text-gray-600 dark:text-gray-300 border-primary my-4"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />
              ),
              li: ({ node, ...props }) => <li className="mb-1 text-base" {...props} />,
              a: ({ node, ...props }) => (
                <a
                  className="text-blue-500 hover:underline transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "")
                return !inline ? (
                  <div className="relative my-6">
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match ? match[1] : "text"}
                      PreTag="div"
                      className="rounded-md p-4 text-sm max-w-full overflow-x-auto"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-gray-200 dark:bg-gray-800 text-primary px-1 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                )
              },
              img: ({ node, ...props }) => (
                <img
                  className="rounded-lg max-w-full h-auto shadow-md my-6"
                  {...props}
                  alt={props.alt || "Markdown image"}
                />
              ),
            }}
          >
            {message.content}
          </Markdown>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-medium mb-4">Attachments</h3>
              {message.attachments.map((attachment, index) => (
                <div key={index} className="mb-4">
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {attachment.name}
                  </a>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}