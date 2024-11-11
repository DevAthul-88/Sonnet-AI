"use client"

import { startTransition, useContext, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, MoreVertical, Pencil, Search, Trash, Loader2, Trash2, ArchiveIcon, Undo2 } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { usePathname, useRouter } from 'next/navigation';
import { useChatContext } from "@/context/AppRefreshContext"





interface Chat {
  id: string
  name: string
  status: string
  user?: {
    name: string
    image: string
  }
  messages?: Array<{
    content: string
  }>
  createdAt: string
}

export default function HistoryList() {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [chatId, setChatId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newChatName, setNewChatName] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRstoreConfirm, setRestoreConfirm] = useState(false)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const { toast } = useToast()
  const { refreshChats, refreshKey } = useChatContext();



  const fetchChats = async () => {
    try {
      const res = await fetch("/api/archived")
      if (!res.ok) throw new Error("Failed to fetch chats")
      const data = await res.json()
      setChats(data.chats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChats()
  }, [refreshKey])

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.messages?.[0]?.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRenaming(true)

    try {
      const response = await fetch(`/api/chats/${chatId}/rename`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newName: newChatName }),
      })

      if (!response.ok) {
        throw new Error('Failed to rename chat')
      }

      const result = await response.json()
      setNewChatName(result.name)
      toast({
        title: "Success",
        description: "Chat renamed successfully!",
      })
      fetchChats()
      refreshChats();
      setIsRenameModalOpen(false)
    } catch (error) {
      console.error('Error renaming chat:', error)
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      })
    } finally {
      setIsRenaming(false)
    }
  }

  const handleOpenRenameModal = (id: string, currentName: string) => {
    setNewChatName(currentName)
    setChatId(id)
    setIsRenameModalOpen(true)
  }

  const handleDeleteChat = (id: string) => {
    setChatId(id)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false)
    setLoading1(true)

    try {
      const response = await fetch(`/api/chats/${chatId}/delete`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete the chat')
      }

      toast({
        title: "Success",
        description: "Chat deleted successfully.",
      })

      fetchChats()
      refreshChats();
    } catch (error) {
      console.error("Error deleting chat:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading1(false)
    }
  }

  const handleArchiveChat = (id: string) => {
    setChatId(id);
    setShowRestoreConfirm(true);
  };

  const handleConfirmRestore = async () => {
    setShowRestoreConfirm(false);
    setLoading1(true);

    try {
      const response = await fetch(`/api/chats/${chatId}/restore`, {
        method: 'POST', // Use POST for restoring
      });

      if (!response.ok) {
        throw new Error('Failed to restore the chat');
      }

      toast({
        title: "Success",
        description: "Chat restored successfully.",
      });

      fetchChats();
      refreshChats();



    } catch (error) {
      console.error("Error restoring chat:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading1(false);
    }
  };


  return (
    <div>
      <Dialog open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
              Enter a new name for your chat.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRename}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newChatName || ''}
                  onChange={(e) => setNewChatName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isRenaming}>
                {isRenaming && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                {isRenaming ? 'Saving...' : 'Save changes'}
              </Button>
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
              {loading1 ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              {loading1 ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRestoreConfirm} onOpenChange={setShowRestoreConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to restore this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This chat will be restored from the archive and will appear in your chat list again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading1} onClick={handleConfirmRestore}>
              {loading1 ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              {loading1 ? 'Restoring...' : 'Restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>



      <div className="flex-1 overflow-auto pb-20">
        {error && (
          <div className="p-4 text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="sticky top-0 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm z-10">
          <div className="relative p-4">
            <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              className="w-full bg-zinc-900 border-zinc-800 pl-10 placeholder:text-zinc-400 focus-visible:ring-zinc-700"
              placeholder="Search for a chat..."
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-4 border-b border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-48 bg-zinc-800" />
                <Skeleton className="h-8 w-8 rounded-md bg-zinc-800" />
              </div>
              <Skeleton className="h-4 w-full mb-4 bg-zinc-800" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full bg-zinc-800" />
                <Skeleton className="h-4 w-24 bg-zinc-800" />
                <Skeleton className="h-4 w-16 bg-zinc-800" />
              </div>
            </div>
          ))
        ) : filteredChats.length === 0 ? (
          <div>
            <div className="p-4 text-center text-zinc-400 mt-5">  No chats found. Start a new conversation to see it here.</div>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="group border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors"
            >



              <div className="p-4">
                <div className="flex items-center justify-between mb-1">

                  <h2 className="font-medium flex items-center gap-2">
                    {chat.name}
                    {chat.status === "locked" && <Lock className="h-3 w-3 text-zinc-400" />}
                  </h2>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" aria-label="More options">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800">
                      <DropdownMenuItem
                        onClick={() => handleOpenRenameModal(chat.id, chat.name)}
                        className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />

                      <DropdownMenuItem
                        onClick={() => handleArchiveChat(chat.id)}
                        className="hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer"
                      >
                        <Undo2 className="mr-2 h-4 w-4" /> {/* Use the appropriate archive icon */}
                        Restore Chat
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />


                      <DropdownMenuItem
                        onClick={() => handleDeleteChat(chat.id)}
                        className="text-red-400 hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-zinc-400 line-clamp-2 mb-2">
                  {chat.messages?.[0]?.content || "No messages yet"}
                </p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={chat.user?.image || ''} alt={chat.user?.name || 'User'} />
                    <AvatarFallback className="bg-zinc-800 text-zinc-300">
                      {chat.user?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-zinc-400">{chat.user?.name || "Unknown"}</span>
                  <span className="text-sm text-zinc-500">
                    Updated {new Date(chat.createdAt).toLocaleDateString()}
                  </span>
                </div>

              </div>
            </div>
          ))
        )}
      </div>


      <style jsx global>{`
        body {
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}