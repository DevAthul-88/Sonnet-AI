"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Download, Code, Share, MoreVertical, Edit, Trash, Lock, Unlock } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "../ui/label"
import { useToast } from "@/hooks/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import ChatShare from "./ChatShare"

export default function ChatNav({ messages, id, chatName, chat }) {
    const [isEditingName, setIsEditingName] = useState(false)
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
    const [newChatName, setNewChatName] = useState(null);
    const [isPrivate, setIsPrivate] = useState(chat?.status === 'PRIVATE')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDownloadChat = () => {
        // Convert chat messages to plain text
        const chatContent = messages
            .map(msg => {
                // Strip Markdown syntax from each message's content
                const plainTextContent = msg.content
                    .replace(/[#*_-]+/g, '') // Remove headers, lists, and horizontal rules
                    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links but keep link text
                    .replace(/!\[.*?\]\([^\)]+\)/g, '') // Remove images
                    .replace(/\n{2,}/g, '\n') // Reduce multiple newlines to a single newline
                    .trim(); // Trim whitespace

                return `${msg.type_u.toUpperCase()}: ${plainTextContent}`;
            })
            .join('\n\n');

        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat_history_${id}.txt`; // Custom file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    const handleDownloadCode = () => {
        const codeBlocks = messages.flatMap(msg => {
            const matches = msg.content.match(/```[\s\S]*?```/g)
            return matches ? matches.map(block => block.replace(/```\w*\n/, '').replace(/```$/, '')) : []
        })
        const codeContent = codeBlocks.join('\n\n')
        const blob = new Blob([codeContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `code_snippets_${id}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="flex flex-col flex-wrap bg-background">


            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between p-4 border-b space-y-4 sm:space-y-0">
                {isEditingName ? (
                    <form onSubmit={handleNameSubmit} className="flex-1 mr-4">
                        <Input
                            value={newChatName}
                            onChange={handleNameChange}
                            onBlur={() => setIsEditingName(false)}
                            autoFocus
                        />
                    </form>
                ) : (
                    <>
                        {chatName && <div className="flex items-center space-x-2">
                            <h1 className="text-xl font-semibold">
                                {chatName}
                            </h1>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="cursor-help">
                                            {isPrivate ? (
                                                <Lock className="h-4 w-4 text-yellow-500" />
                                            ) : (
                                                <Unlock className="h-4 w-4 text-green-500" />
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{isPrivate ? "Private chat" : "Public chat"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>}
                    </>
                )}
                <div className="flex items-center space-x-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={handleDownloadChat}>
                                    <Download className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Download chat</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" onClick={handleDownloadCode}>
                                    <Code className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Download code snippets</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}