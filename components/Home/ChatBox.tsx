"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { CornerDownLeft, Loader, Mic } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { useSession } from "next-auth/react";
import { useContext, useState, KeyboardEvent, useEffect, useCallback } from "react";
import { ModalContext } from "../modals/providers";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const useSpeechRecognition = (setMessage: (message: string) => void, setIsListening: (isListening: boolean) => void) => {
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

    useEffect(() => {
        if (!("webkitSpeechRecognition" in window)) {
            console.warn("Browser does not support speech recognition.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const newRecognition = new SpeechRecognition();
        newRecognition.continuous = false;
        newRecognition.interimResults = true;
        newRecognition.lang = 'en-US';

        newRecognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setMessage(prevMessage => prevMessage + ' ' + transcript);
        };

        newRecognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        newRecognition.onend = () => {
            setIsListening(false);
        };

        setRecognition(newRecognition);

        return () => {
            if (newRecognition) {
                newRecognition.abort();
            }
        };
    }, [setMessage, setIsListening]);

    return recognition;
};

export default function ChatBox() {
    const { data: session, status } = useSession();
    const { setShowSignInModal } = useContext(ModalContext);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    

    const recognition = useSpeechRecognition(setMessage, setIsListening);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            return; // Do not send empty messages
        }

        let userId = session?.user?.id;

        if (!userId) {
            return toast({
                title: "Error",
                description: "Something went wrong, please try again later",
                variant: "destructive",
            });
        }

        setIsLoading(true);

        try {
            const response = await axios.post('/api/sendMessage', {
                message,
                userId,
            });
            const { chatId } = response.data;

            router.push(`/chat/${chatId}`);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFocus = () => {
        if (status === "unauthenticated") {
            setShowSignInModal(true);
        }
    };

    const handleMicClick = useCallback(() => {
        if (!recognition) {
            toast({
                title: "Unsupported",
                description: "Your browser does not support speech recognition.",
                variant: "destructive",
            });
            return;
        }

        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    }, [recognition, isListening, toast, setIsListening]); // Ensure setIsListening is included in the dependencies

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background transition-colors duration-300">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/20" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>

            <div className="w-full border max-w-3xl space-y-6 text-center z-10 p-8 backdrop-blur-sm bg-background/30 rounded-xl shadow-lg">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">What can I help you ship?</h1>
                <p className="text-muted-foreground">
                    Generate UI, ask questions, debug, execute code, and much more.
                </p>
                <div className="relative w-full">
                    <form
                        onSubmit={handleSubmit}
                        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring transition-all duration-300 ease-in-out"
                    >
                        <Label htmlFor="message" className="sr-only">
                            Message
                        </Label>
                        <Textarea
                            id="message"
                            placeholder="Type your message here..."
                            className="min-h-12 hover:border-none focus:border-none resize-none border-0 p-3 shadow-none focus-visible:ring-0 bg-transparent"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={handleFocus}
                        />
                        <div className="flex items-center p-3 pt-0">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full"
                                            onClick={handleMicClick}
                                        >
                                           {isListening ? <Mic className="h-4 w-4 text-primary animate-pulse" /> : <Mic className="h-4 w-4" />}

                                            <span className="sr-only">Use Microphone</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Use Microphone</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        Sending...
                                        <Loader className="animate-spin h-3.5 w-3.5" />
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <CornerDownLeft className="h-3.5 w-3.5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="flex justify-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 transition-colors duration-200">Generate a multi-step onboarding flow</Badge>
                    <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 transition-colors duration-200">How can I schedule cron jobs?</Badge>
                    <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 transition-colors duration-200">Write code to implement a min heap</Badge>
                    <Badge variant="secondary" className="bg-secondary/50 hover:bg-secondary/70 transition-colors duration-200">SaaS Pricing Calculator</Badge>
                </div>
            </div>
        </div>
    );
}