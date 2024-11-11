"use client"

import { useChatContext } from '@/context/AppRefreshContext';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Link from 'next/link';
import React, { useContext, useState } from 'react'
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArchiveIcon, Loader2, MoreVertical, Pen, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import { ModalContext } from '../modals/providers';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';

function RecentChats() {
    const { recentChats, loading, error } = useChatContext();
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
    const [newChatName, setNewChatName] = useState(null);
    const { setShowSignInModal } = useContext(ModalContext);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [id, setId] = useState(null);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const { toast } = useToast()
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
    const router = useRouter();
    const { refreshChats } = useChatContext();

    const handleDelete = (chatId: string) => {
        setId(chatId);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!id) return; // Ensure an id is set before proceeding

        setShowDeleteConfirm(false);
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

 
            router.push('/'); // Redirect to home page
        } catch (error) {
            console.error("Error deleting chat:", error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading1(false); // Stop loading
        }
    };

    const handleOpenRenameModal = (chatId: string, currentName: string) => {
        setId(chatId); // Set the chat ID
        setNewChatName(currentName); // Pre-fill with the current chat name
        setIsRenameModalOpen(true); // Open the modal
    };

    const handleRename = async (e) => {
        e.preventDefault();
        if (!id) return;

        setLoading2(true);
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

            refreshChats();
            toast({
                title: "Success",
                description: "Chat renamed successfully!",
            });
            setIsRenameModalOpen(false); // Close the modal
        } catch (error) {
            console.error('Error renaming chat:', error);
            toast({
                title: "Error",
                description: "Something went wrong, please try again later",
                variant: "destructive",
            });
        } finally {
            setLoading2(false);
        }
    };

    const handleArchiveChat = (id: string) => {
        setId(id);
        setShowArchiveConfirm(true);
    };



    const handleConfirmArchive = async () => {
        if (!id) return; // Ensure there's a chat ID set before proceeding
        setShowArchiveConfirm(false); // Close the confirmation dialog
        setLoading3(true); // Start loading

        try {
            const response = await fetch(`/api/chats/${id}/archive`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to archive the chat');
            }

            toast({
                title: "Success",
                description: "Chat archived successfully.",
            });

            // Remove archived chat from recentChats
            refreshChats();

            

        } catch (error) {
            console.error("Error archiving chat:", error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading3(false); // Stop loading
        }
    };

    return (
        <div>

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
                            <Button type="submit"> {loading2 ? 'Saving...' : 'Save changes'}</Button>
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

            <AlertDialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to archive this chat?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This chat will be moved to the archive. You can restore it later if needed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={loading1} onClick={handleConfirmArchive}>
                            {loading3 ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                            {loading3 ? 'Archiving...' : 'Archive'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <ScrollArea>
                <div className="pl-3 mt-4">

                    {recentChats.length > 0 ? (
                        <>
                            <h3 className="mb-2 px-2 text-sm font-semibold text-muted-foreground">Recent Chats</h3>
                            {recentChats.map((chat) => (
                                <div key={chat.id} className="flex items-center mb-2 group">
                                    <Link href={`/chat/${chat.id}`} className="flex-grow">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start rounded-lg text-left px-2 py-1 h-auto group-hover:w-full transition-all duration-200"
                                        >
                                            <div className="flex flex-col items-start overflow-hidden">
                                                <span className="text-sm font-medium truncate w-full">{chat.name}</span>
                                            </div>
                                        </Button>
                                    </Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="px-0 text-muted-foreground">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">

                                            <DropdownMenuItem key={chat.id} onClick={() => handleOpenRenameModal(chat.id, chat.name)}>
                                                <Pen className="mr-2 h-4 w-4" />
                                                <span>Rename</span>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() => handleArchiveChat(chat.id)}
                                                className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer"
                                            >
                                                <ArchiveIcon className="mr-2 h-4 w-4" /> {/* Use the appropriate archive icon */}
                                                Archive Chat
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => handleDelete(chat.id)}>
                                                <Trash className="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}

                        </>
                    ) : null}


                </div>
            </ScrollArea></div>
    )
}

export default RecentChats