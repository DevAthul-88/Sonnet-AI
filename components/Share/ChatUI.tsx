'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import Markdown from 'react-markdown'
import { cn } from "@/lib/utils"
import { Loader2, Send, Bot, User, ChevronUp, ChevronDown, Copy, Code, Download } from "lucide-react"
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import ChatNav from './ChatNav'
import { Skeleton } from '../ui/skeleton'
import { useRouter } from 'next/navigation'
import FullScreenDialog from './FullScreenDialog'
import CodeBlock from './CodeBlock'



type Message = {
  id: string // Changed to string for UUIDs
  sender: 'user' | 'bot'
  content: string
  timestamp: Date,
  type_u: string
}

interface Chat {
  id: string;
  status: string;
  userId: string;
  name: string;
  messages: Message[]; // Assuming messages are included in chat
}

export default function ChatUI({ chatId }: { chatId: string }) { // Accept chatId as prop
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null)
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false)

  const { data: session, status } = useSession();
  const { toast } = useToast()

  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const scrollAreaRef = useRef(null);
  const lastMessageRef = useRef<HTMLDivElement>(null)

  const onCopy = (content: string) => {
    // Convert Markdown to plain text by stripping Markdown syntax
    const plainTextContent = content
      .replace(/[#*_-]+/g, '') // Remove headers, lists, and horizontal rules
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep link text
      .replace(/!\[.*?\]\([^\)]+\)/g, '') // Remove images
      .replace(/\n{2,}/g, '\n') // Reduce multiple newlines to a single newline
      .trim(); // Trim whitespace

    navigator.clipboard.writeText(plainTextContent).then(() => {
      toast({
        title: "Copied",
        description: "Message copied to clipboard",
      });
    }).catch((err) => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    });
  };

  useEffect(() => {
    // Fetch chat and messages for the current chat when the component mounts or chatId changes
    const fetchChatAndMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/share/${chatId}/messages`);
        const data = await response.json();

        if (response.ok) {
          // Set the fetched chat details
          setChat(data.chat);

          // Map fetched messages to the desired format
          const fetchedMessages = data.chat.messages.map((msg: any) => ({
            id: msg.id,
            sender: msg.userId, // Assuming userId is used as the sender
            content: msg.content,
            type_u: msg.type_u,
            timestamp: new Date(msg.createdAt), // Adjust this based on your response format
          }));

          // Set the messages state
          setMessages(fetchedMessages);
        } else if (response.status === 404) {
          // Redirect to "Page Not Found" if 404
          router.push('/pagenotfound');
        } else {
          // Handle other errors
          toast({
            title: "Error",
            description: "Something went wrong. Please try again later.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChatAndMessages();
  }, [chatId, router]);


  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };


  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth' // Smooth scrolling effect
      });
    }
  };


  useEffect(() => {
    if (messages.length >= 3) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100); // Delay scrolling to allow for content to render
      return () => clearTimeout(timer);
    }
  }, [messages, shouldAutoScroll]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      // Construct a new user message
      const newUserMessage: Message = {
        id: uuidv4(),
        sender: 'user',
        content: message,
        type_u: "user",
        timestamp: new Date(),
      };

      // Optimistically update the frontend
      setMessages([...messages, newUserMessage]);
      setMessage(''); // Clear the input field
      setIsLoading(true);
      setIsTyping(true);

      try {
        // Send user message to the backend
        const userResponse = await fetch(`/api/messages/${chatId}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message, // The user's message
            userId: session?.user?.id, // Replace with actual userId
            chatId: chatId, // Replace with the current chatId
          }),
        });

        const responseData = await userResponse.json(); // Parse the response once

        // Check for rate limiting errors
        if (responseData?.limit === true) {
          return toast({
            title: "Error",
            description: responseData?.error,
            variant: "destructive",
          });
        }

        // Check if the user message was saved successfully
        if (!userResponse.ok) {
          throw new Error('Failed to save user message');
        }

        // Check if AI response exists
        if (!responseData.response) {
          throw new Error('Failed to fetch AI response');
        }

        // Create a new bot message based on the AI response
        const newBotMessage: Message = {
          id: uuidv4(),
          sender: 'bot',
          content: responseData.response, // AI's response from backend
          timestamp: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, newBotMessage]);

      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    }
  };

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1; // Tolerance for detecting bottom
      setShowScrollToBottom(!isAtBottom);
    }
  };

  const onDownload = (content) => {
    // Convert Markdown to plain text by stripping Markdown syntax
    const plainTextContent = content
      .replace(/[#*_-]+/g, '') // Remove headers, lists, and horizontal rules
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep link text
      .replace(/!\[.*?\]\([^\)]+\)/g, '') // Remove images
      .replace(/\n{2,}/g, '\n') // Reduce multiple newlines to a single newline
      .trim(); // Trim whitespace

    const blob = new Blob([plainTextContent], { type: 'text/plain' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `chat-message-${uuidv4()}.txt`; // Custom file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  };

  if (chat?.name) {
    document.title = chat?.name + '- Sonnet By Athul';
  }


  return (
    <>
      <ChatNav messages={messages} id={chatId} chatName={chat?.name} chat={chat} />

      <div className="flex flex-col h-screen bg-background">
        {/* Chat Section */}
        <div className="flex-grow overflow-hidden flex justify-center">
          <div className="w-full max-w-5xl rounded-lg pt-2 pb-2">
            {loading == true ? <Skeleton /> : <>
              <div className="h-[calc(100vh-10rem)]  scroll-area"
                ref={scrollAreaRef}
                onScrollCapture={handleScroll}
                style={{ paddingBottom: '4rem' }}
              >
                <div>
                  <div className="space-y-6  px-4" ref={viewportRef}>
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.type_u === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "flex max-w-[85%]",
                            message.type_u === "user" ? "flex-row-reverse" : "flex-row"
                          )}
                        >
                          <Avatar className="w-10 h-10 mx-3 flex-shrink-0">
                            <AvatarFallback>
                              {message.type_u === "user" ? (
                                <User className="w-6 h-6" />
                              ) : (
                                <Bot className="w-6 h-6" />
                              )}
                            </AvatarFallback>
                            <AvatarImage
                              src={message.type_u === "user" ? "/placeholder-user.jpg" : "/placeholder.svg"}
                            />
                          </Avatar>
                          <div
                            className={cn(
                              "rounded-lg p-4 shadow-md relative group transition-transform transform",
                              message.type_u === "user"
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            <div className="max-w-full overflow-hidden break-words">
                              <Markdown
                                components={{
                                  h1: ({ node, ...props }) => (
                                    <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
                                  ),
                                  h2: ({ node, ...props }) => (
                                    <h2 className="text-xl font-semibold mt-5 mb-3" {...props} />
                                  ),
                                  h3: ({ node, ...props }) => (
                                    <h3 className="text-lg font-medium mt-4 mb-2" {...props} />
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
                                  code: CodeBlock,
                                  img: ({ node, ...props }) => (
                                    <img
                                      className="rounded-lg max-w-full h-auto shadow-md my-4"
                                      {...props}
                                      alt={props.alt || "Markdown image"}
                                    />
                                  ),
                                }}
                              >
                                {message.content}
                              </Markdown>
                            </div>

                            <p className="text-sm mt-2 opacity-70">
                              {formatTimestamp(message.createdAt)}
                            </p>

                            <div className="flex items-center space-x-2 mt-3">

                              {message.type_u !== "user" && (
                                <FullScreenDialog message={message} />
                              )}

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => onCopy(message.content)}
                                      className="px-2 py-1 text-sm"
                                    >
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy message</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => onDownload(message.content)}
                                      className="px-2 py-1 text-sm"
                                    >
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Download message</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex items-center text-base text-muted-foreground">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sonnet is typing...
                      </div>
                    )}
                    <div ref={lastMessageRef} />
                  </div>
                </div>

              </div>
            </>}
          </div>
        </div>






        {showScrollToBottom && (
          <Button
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 rounded-full p-1 w-8 h-8 z-50 animate-bounce transition ease-in-out duration-1000"
            size="icon"
            variant="secondary"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}


        <style jsx global>{`
  body {
    overflow: hidden;
  }
`}</style>

      </div>
    </>
  )
}
