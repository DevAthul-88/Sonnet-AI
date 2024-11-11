'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Lightbulb, Info, Moon, Sun, Zap, Brain, Globe, Lock, Star } from 'lucide-react'

export default function Help() {
    const [darkMode, setDarkMode] = useState(false)

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        document.documentElement.classList.toggle('dark')
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <div className="container mx-auto p-4 max-w-4xl  dark:text-white transition-colors duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">How to Use Sonnet AI Chatbot</h1>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Getting Started with Sonnet</CardTitle>
                        <CardDescription>Follow these steps to start chatting with Sonnet</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Open the chat interface by clicking on the chat icon in the app.</li>
                            <li>Type your question or prompt in the input field at the bottom of the chat.</li>
                            <li>Press the send button or hit Enter to submit your message.</li>
                            <li>Wait for Sonnet to process your input and generate a response.</li>
                            <li>Read Sonnet's response and continue the conversation as needed.</li>
                        </ol>
                    </CardContent>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Feature Showcase</CardTitle>
                        <CardDescription>Discover Sonnet's powerful capabilities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col items-center p-4 bg-blue-100 dark:bg-blue-900 rounded-lg transition-all hover:scale-105">
                                <Zap className="h-12 w-12 text-blue-500 mb-2" />
                                <h3 className="text-lg font-semibold mb-2">Fast Responses</h3>
                                <p className="text-center text-sm">Get instant answers to your questions</p>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-green-100 dark:bg-green-900 rounded-lg transition-all hover:scale-105">
                                <Brain className="h-12 w-12 text-green-500 mb-2" />
                                <h3 className="text-lg font-semibold mb-2">Smart Learning</h3>
                                <p className="text-center text-sm">Sonnet adapts to your preferences over time</p>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-purple-100 dark:bg-purple-900 rounded-lg transition-all hover:scale-105">
                                <Globe className="h-12 w-12 text-purple-500 mb-2" />
                                <h3 className="text-lg font-semibold mb-2">Multilingual</h3>
                                <p className="text-center text-sm">Communicate in multiple languages</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Frequently Asked Questions</CardTitle>
                        <CardDescription>Quick answers to common queries about Sonnet</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Is Sonnet available 24/7?</AccordionTrigger>
                                <AccordionContent>
                                    Yes, Sonnet is available round the clock to assist you with your queries.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Can Sonnet understand context from previous messages?</AccordionTrigger>
                                <AccordionContent>
                                    Sonnet is designed to maintain context throughout the conversation, allowing for more natural and coherent interactions.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>How accurate is Sonnet's information?</AccordionTrigger>
                                <AccordionContent>
                                    Sonnet strives for high accuracy, but it's always a good idea to verify critical information from authoritative sources.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Advanced Features</CardTitle>
                        <CardDescription>Unlock Sonnet's full potential with these pro tips</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2">
                                <Lock className="text-blue-500" />
                                <span>Use "@private" to start a confidential conversation</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Lightbulb className="text-yellow-500" />
                                <span>Try "Explain like I'm 5" for simplified explanations</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Info className="text-green-500" />
                                <span>Ask Sonnet to "summarize our conversation" for a quick recap</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Community Highlights</CardTitle>
                        <CardDescription>See how others are using Sonnet to boost their productivity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <Avatar>
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
                                    <AvatarFallback>AB</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Alex Brown</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Software Engineer</p>
                                    <p className="mt-1">"Sonnet helped me debug a complex issue in half the time!"</p>
                                    <div className="mt-2">
                                        <Badge variant="secondary">Coding</Badge>
                                        <Badge variant="secondary" className="ml-2">Debugging</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <Avatar>
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
                                    <AvatarFallback>LM</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Liam Martin</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Content Creator</p>
                                    <p className="mt-1">"I use Sonnet to brainstorm creative content ideas daily!"</p>
                                    <div className="mt-2">
                                        <Badge variant="secondary">Creativity</Badge>
                                        <Badge variant="secondary" className="ml-2">Content</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <Avatar>
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
                                    <AvatarFallback>SC</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Sophia Clarke</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Data Analyst</p>
                                    <p className="mt-1">"Sonnet's data interpretation skills are phenomenal!"</p>
                                    <div className="mt-2">
                                        <Badge variant="secondary">Data Analysis</Badge>
                                        <Badge variant="secondary" className="ml-2">Insights</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <Avatar>
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
                                    <AvatarFallback>MJ</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Mia Johnson</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Project Manager</p>
                                    <p className="mt-1">"With Sonnet, managing tasks and team communication has become seamless."</p>
                                    <div className="mt-2">
                                        <Badge variant="secondary">Productivity</Badge>
                                        <Badge variant="secondary" className="ml-2">Collaboration</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <Button variant="outline" className="inline-flex items-center">
                                <Star className="mr-2 h-4 w-4" />
                                Share Your Sonnet Story
                            </Button>
                        </div>
                    </CardContent>

                </Card>
            </div>
        </div>
    )
}