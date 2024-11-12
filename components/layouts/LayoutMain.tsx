"use client"

import { useState, useEffect, useContext, useCallback } from "react"
import {
  LifeBuoy,
  Menu,
  ChevronRight,
  BookIcon,
  FlagIcon,
  PlusSquare,
  X,
  Settings,
  LogOut,
  User,
  Laptop,
  Sun,
  Moon,
  ArchiveIcon,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TooltipProvider } from "@radix-ui/react-tooltip"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Twitter, Facebook, Linkedin, Mail } from "lucide-react"
import Logo from '../logo.png'
import LogoText from '../logo_text.png'


// Assuming you're using Next-Auth or a similar authentication library
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ModalContext } from "../modals/providers"
import { Toaster } from "../ui/toaster"
import Image from "next/image"
import ShareButton from "../ShareButton"
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
import { usePathname, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Label } from "recharts"
import { Input } from "../ui/input"
import WrapperLayout from "./WrapperLayout"
import RecentChats from "./RecentChats"
import useLocalStorage from "@/hooks/use-local-storage"




interface ChatMessage {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export default function LayoutMain({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useLocalStorage('sidebarExpanded', false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { setShowSignInModal } = useContext(ModalContext);
  const { data: session, status } = useSession()

  const toggleSidebar = useCallback(() => {
    setSidebarExpanded(!sidebarExpanded);
  }, [sidebarExpanded, setSidebarExpanded]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ensure `window` is available (client-side only)
      const checkScreenSize = () => {
        if (typeof window !== 'undefined') {
          const mobile = window.innerWidth < 768;
          setIsMobile(mobile);

          // Hide sidebar if on mobile
          if (mobile) {
            setSidebarExpanded(false);
          }
        }
      };

      checkScreenSize(); // Initial check on mount
      window.addEventListener('resize', checkScreenSize);

      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);


  const { theme, setTheme } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)



  return (

    <WrapperLayout>
      <TooltipProvider>
        <Toaster />



        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Feedback Submission</DialogTitle>
              <DialogDescription>
                Input and suggestions are greatly valued. Reach out through any of the available channels to share feedback, ideas, or report issues.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <h3 className="text-lg font-semibold">Connect through:</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" >
                  <Link href={"https://twitter.com/WebDevAthul"} target="_blank">
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" >
                  <Link href={"https://www.facebook.com/profile.php?id=100007516185458"} target="_blank">
                    <div className="flex items-center gap-2 w-100">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="flex items-center gap-2">
                  <Link href={"https://in.linkedin.com/in/athul-vinod-36378820a"} target="_blank">
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Link href={"mailto:athulvinod894@gmail.com"} target="_blank">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Feedback is essential for continuous improvement and is greatly appreciated.
              </p>
            </div>
          </DialogContent>
        </Dialog>



        <div className={`grid h-screen w-full ${sidebarExpanded && !isMobile ? 'md:pl-64' : 'md:pl-14'}`}>
          <aside className={`fixed inset-y-0 left-0 z-30 flex h-full flex-col border-r transition-all duration-300 bg-background ${sidebarExpanded ? 'w-64' : 'w-14'
            } ${isMobile ? (sidebarExpanded ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}>
            <div className="flex items-center justify-between border-b p-2">
              <Link href={"/"} className="flex justify-center h-10 items-center">
                {!sidebarExpanded ? <Image src={Logo} width={35} /> : <Image src={LogoText} width={100} />}
              </Link>
              {sidebarExpanded && (
                <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Collapse sidebar">
                  {isMobile ? <X className="size-5" /> : <ChevronRight className="size-5" />}
                </Button>
              )}
            </div>
            <nav className="grid gap-1 p-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={"/"}>
                    <Button
                      variant={sidebarExpanded ? "default" : "ghost"}
                      size={sidebarExpanded ? "default" : "icon"}
                      className={`rounded-lg ${sidebarExpanded ? 'w-full justify-start' : 'w-full justify-center'}`}
                      aria-label="New Chat"
                    >
                      <PlusSquare className={`size-5 ${sidebarExpanded ? 'mr-2' : ''}`} />
                      {sidebarExpanded && <span className="flex-grow text-left">New Chat</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {!sidebarExpanded && (
                  <TooltipContent side="right" sideOffset={5}>
                    New Chat
                  </TooltipContent>
                )}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={"/chat/history"}>
                    <Button
                      variant="ghost"
                      size={sidebarExpanded ? "default" : "icon"}
                      className={`rounded-lg ${sidebarExpanded ? 'w-full justify-start' : 'w-full justify-center'}`}
                      aria-label="Chat History"
                    >
                      <BookIcon className={`size-5 ${sidebarExpanded ? 'mr-2' : ''}`} />
                      {sidebarExpanded && <span className="flex-grow text-left">Chat History</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {!sidebarExpanded && (
                  <TooltipContent side="right" sideOffset={5}>
                    Chat History
                  </TooltipContent>
                )}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={'/chat/archived'}>
                    <Button
                      variant="ghost"
                      size={sidebarExpanded ? "default" : "icon"}
                      className={`rounded-lg ${sidebarExpanded ? 'w-full justify-start' : 'w-full justify-center'}`}
                      aria-label="Archived Chats"
                    >
                      <ArchiveIcon className={`size-5 ${sidebarExpanded ? 'mr-2' : ''}`} />
                      {sidebarExpanded && <span className="flex-grow text-left">Archived Chats</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {!sidebarExpanded && (
                  <TooltipContent side="right" sideOffset={5}>
                    Archived Chats
                  </TooltipContent>
                )}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={sidebarExpanded ? "default" : "icon"}
                    className={`rounded-lg ${sidebarExpanded ? 'w-full justify-start' : 'w-full justify-center'}`}
                    aria-label="Feedback"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <FlagIcon className={`size-5 ${sidebarExpanded ? 'mr-2' : ''}`} />
                    {sidebarExpanded && <span className="flex-grow text-left">Feedback</span>}
                  </Button>
                </TooltipTrigger>
                {!sidebarExpanded && (
                  <TooltipContent side="right" sideOffset={5}>
                    Feedback
                  </TooltipContent>
                )}
              </Tooltip>

              {sidebarExpanded && (
                <RecentChats />
              )}


            </nav>
            <nav className="mt-auto grid gap-1 p-2">
              <Tooltip>
                <Link href={'/help'}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size={sidebarExpanded ? "default" : "icon"}
                      className={`rounded-lg ${sidebarExpanded ? 'w-full justify-start' : 'w-full justify-center'}`}
                      aria-label="Help"
                    >
                      <LifeBuoy className={`size-5 ${sidebarExpanded ? 'mr-2' : ''}`} />
                      {sidebarExpanded && <span className="flex-grow text-left">Help</span>}
                    </Button>
                  </TooltipTrigger>
                  {!sidebarExpanded && (
                    <TooltipContent side="right" sideOffset={5}>
                      Help
                    </TooltipContent>
                  )}
                </Link>
              </Tooltip>
              {status === "loading" ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <>
                  {status === "authenticated" ? (
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size={sidebarExpanded ? "default" : "icon"}
                              className={`rounded-lg ${sidebarExpanded ? 'w-full justify-start items-center' : 'w-full justify-center'}`}
                              aria-label="Account"
                            >
                              <Avatar className={`h-8 w-8 ${sidebarExpanded && 'mr-2'}`}>
                                <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                                <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                              </Avatar>
                              {sidebarExpanded && (
                                <div className="flex flex-col items-start overflow-hidden">
                                  <span className="text-sm font-medium truncate">{session?.user?.name}</span>
                                  <span className="text-xs text-muted-foreground truncate">{session?.user?.email}</span>
                                </div>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        {!sidebarExpanded && (
                          <TooltipContent side="right" sideOffset={5}>
                            Account
                          </TooltipContent>
                        )}
                      </Tooltip>
                      <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={5}>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                          </div>
                        </DropdownMenuLabel>


                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <Link href={'/settings'}>

                            Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                          <DropdownMenuLabel>Theme</DropdownMenuLabel>
                          <DropdownMenuRadioItem value="light">
                            <Sun className="mr-2 h-4 w-4" />
                            Light
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="dark">
                            <Moon className="mr-2 h-4 w-4" />
                            Dark
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="system">
                            <Laptop className="mr-2 h-4 w-4" />
                            System
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(event) => {
                          event.preventDefault();
                          signOut({
                            callbackUrl: `${window.location.origin}/`,
                          });
                        }}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) :
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size={sidebarExpanded ? "default" : "icon"}
                          className={`rounded-lg ${sidebarExpanded ? 'w-full justify-start' : 'w-full justify-center'}`}
                          aria-label="Account"
                          onClick={() => {
                            setShowSignInModal(true)
                          }}
                        >
                          <User className={`size-5 ${sidebarExpanded ? 'mr-2' : ''}`} />
                          {sidebarExpanded && <span className="flex-grow text-left">Account</span>}
                        </Button>
                      </TooltipTrigger>
                      {!sidebarExpanded && (
                        <TooltipContent side="right" sideOffset={5}>
                          Account
                        </TooltipContent>
                      )}
                    </Tooltip>
                  }
                </>
              )}
            </nav>
          </aside>
          <div className="flex flex-col">
            <header className="sticky top-0 z-20 flex h-[57px] items-center gap-1 border-b bg-background px-4">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={toggleSidebar}
                aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                <Menu className="size-5" />
              </Button>
              <h1 className="text-xl font-semibold">Sonnet</h1>
              <ShareButton />
            </header>
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </TooltipProvider>
    </WrapperLayout>

  )
}