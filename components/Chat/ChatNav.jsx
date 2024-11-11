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
import { useChatContext } from "@/context/AppRefreshContext"

export default function ChatNav({ messages, id, chatName, chat, status }) {
    const [isEditingName, setIsEditingName] = useState(false)
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
    const [newChatName, setNewChatName] = useState(null);
    const [oldChatName, setOldChatName] = useState(chatName);
    const [isPrivate, setIsPrivate] = useState(status === 'PRIVATE')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const { toast } = useToast()
    const router = useRouter();
    const { refreshChats, refreshKey } = useChatContext();

    useEffect(() => {
 
        console.log(chatName);
        
    },[refreshKey])

    const handleOpenRenameModal = () => {
        setNewChatName(chatName)
        setIsRenameModalOpen(true)
    }

    const handleRename = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/chats/${id}/rename`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newName: newChatName }),
            });

            if (!response.ok) {
                toast({
                    title: "Error",
                    description: "Something went wrong, please try again later",
                    variant: "destructive",
                });
                throw new Error('Failed to rename chat');
            }

            const result = await response.json();

            // Update the chatName state with the new name
            setNewChatName(newChatName);

            setOldChatName(result?.chat?.name)

            toast({
                title: "Success",
                description: "Chat renamed successfully!",
            });
            setIsRenameModalOpen(false);
            refreshChats();
        } catch (error) {
            console.error('Error renaming chat:', error);
            toast({
                title: "Error",
                description: "Something went wrong, please try again later",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = (e) => {
        setChatName(e.target.value)
    }

    const handleNameSubmit = (e) => {
        e.preventDefault()
        setIsEditingName(false)
    }

    const handleDeleteChat = () => {
        setShowDeleteConfirm(true)
    }

    const handleConfirmDelete = async () => {
        setShowDeleteConfirm(false)
        setLoading1(true); // Start loading

        try {
            const response = await fetch(`/api/chats/${id}/delete`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the chat');
            }

            toast({
                title: "Success",
                description: "Chat deleted successfully.",
            });

            // Redirect to the home page after deletion
            router.push('/');
            refreshChats();
        } catch (error) {
            setLoading1(false)
            console.error("Error deleting chat:", error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading1(false); // Stop loading
        }
    }

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

            <Dialog open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Rename Chat</DialogTitle>
                        <DialogDescription>
                            Enter a new name for your chat.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRename}>
                    <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-12 items-center gap-4">
                                <div className="col-span-2">
                                    <Label htmlFor="name">Name</Label>
                                </div>
                                <div className="col-span-10">
                                    <Input
                                        id="name"
                                        value={newChatName}
                                        onChange={(e) => setNewChatName(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
 
                        <DialogFooter>
                            <Button type="submit"> {loading ? 'Saving...' : 'Save changes'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the chat
                            and remove the data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={loading1} onClick={handleConfirmDelete}>
                            {loading1 ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                                {newChatName ? newChatName : chatName}
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
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ChatShare setIsPrivate1={setIsPrivate} chat={chat} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Share chat</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleOpenRenameModal}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDeleteChat}>
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}