'use client'

import React, { useState, useEffect } from 'react'
import { Share, Lock, Unlock, Copy, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Chat {
    id: string;
    name: string;
    status: 'PRIVATE' | 'PUBLIC';
    createdAt: string;
    updatedAt: string;
    userId: string;
    messages: Array<any>; // You might want to define a more specific type for messages
}

interface ChatShareProps {
    chat: Chat;
    setIsPrivate1: (value: boolean) => void;
}


export default function ChatShare({ chat, setIsPrivate1 }: ChatShareProps) {
    const [isPrivate, setIsPrivate] = useState(chat?.status === 'PRIVATE')
    const [shareUrl, setShareUrl] = useState('')
    const [isCopied, setIsCopied] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        setShareUrl(`${window.location.origin}/share/${chat?.id}`)
    }, [chat?.id])

    const handlePrivacyToggle = async () => {
        try {
            // Toggle status between 'PUBLIC' and 'PRIVATE'
            const newStatus = isPrivate ? 'PUBLIC' : 'PRIVATE';
    
            const response = await fetch(`/api/chats/${chat.id}/privacy`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
    
            if (response.ok) {
                // Update local privacy state
                setIsPrivate(!isPrivate);
                setIsPrivate1(!isPrivate);
    
                toast({
                    title: "Privacy setting updated",
                    description: !isPrivate ? "Chat is now private" : "Chat is now public",
                });
            } else {
                // Handle failed API call with toast error
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update privacy setting');
            }
        } catch (error) {
            console.error('Error updating privacy setting:', error);
    
            // Display error toast if something went wrong
            toast({
                title: "Error",
                description: "Failed to update privacy setting. Please try again.",
                variant: "destructive",
            });
        }
    };
    

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setIsCopied(true)
            toast({
                title: "Link copied",
                description: "Share link has been copied to clipboard",
            })
            setTimeout(() => setIsCopied(false), 2000)
        } catch (error) {
            console.error('Error copying link:', error)
            toast({
                title: "Error",
                description: "Failed to copy link. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Share className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share "{chat?.name}"</DialogTitle>
                    <DialogDescription>
                        {isPrivate 
                            ? "This chat is currently private. Make it public to share." 
                            : "Anyone with the link can view this chat."}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 mt-4">
                    <Switch
                        id="privacy-mode"
                        checked={!isPrivate}
                        onCheckedChange={handlePrivacyToggle}
                    />
                    <Label htmlFor="privacy-mode" className="font-medium cursor-pointer">
                        {isPrivate ? (
                            <>
                                <Lock className="h-4 w-4 inline-block mr-2" />
                                Private
                            </>
                        ) : (
                            <>
                                <Unlock className="h-4 w-4 inline-block mr-2" />
                                Public
                            </>
                        )}
                    </Label>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                    <Input
                        value={shareUrl}
                        readOnly
                        className="flex-1"
                    />
                    <Button 
                        size="sm" 
                        className="shrink-0" 
                        onClick={handleCopyLink}
                        disabled={isPrivate}
                    >
                        {isCopied ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </>
                        )}
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                    Last updated: {new Date(chat?.updatedAt).toLocaleString()}
                </p>
            </DialogContent>
        </Dialog>
    )
}