'use client'

import { useState, useEffect } from 'react'
import { Share, Twitter, Facebook, Linkedin, Link2, Mail, Copy, Moon, Sun, QrCode } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {QRCodeSVG} from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/config/site'

export default function ShareButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const shareUrl = siteConfig.url

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copySuccess])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => setCopySuccess(true))
      .catch((err) => console.error('Failed to copy: ', err))
  }

  const shareButtons = [
    { icon: <Twitter className="h-4 w-4" />, label: 'Twitter', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}` },
    { icon: <Facebook className="h-4 w-4" />, label: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { icon: <Linkedin className="h-4 w-4" />, label: 'LinkedIn', url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}` },
    { icon: <Mail className="h-4 w-4" />, label: 'Email', url: `mailto:?body=${encodeURIComponent(shareUrl)}` },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto gap-1.5 text-sm"
        >
          <Share className="size-3.5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-md ${isDarkMode ? 'dark' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Share</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="social" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="link">Link</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
            </TabsList>
            <TabsContent value="social" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                {shareButtons.map((button, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex flex-col items-center justify-center h-20"
                    onClick={() => window.open(button.url, '_blank')}
                  >
                    {button.icon}
                    <span className="mt-2 text-xs">{button.label}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="link" className="mt-4">
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Input
                    id="link"
                    defaultValue={shareUrl}
                    readOnly
                    className="pr-12"
                  />
                </div>
                <Button size="icon" className="px-3" onClick={handleCopyLink}>
                  <span className="sr-only">Copy</span>
                  {copySuccess ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <AnimatePresence>
                {copySuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-green-500 mt-2"
                  >
                    Link copied to clipboard!
                  </motion.p>
                )}
              </AnimatePresence>
            </TabsContent>
            <TabsContent value="qr" className="mt-4 flex justify-center">
              <QRCodeSVG value={shareUrl} size={200} />
            </TabsContent>
          </Tabs>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}