"use client";

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-8xl font-extrabold tracking-tighter sm:text-9xl">
          4<span className="text-primary">0</span>4
        </h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl mt-4">
          Oops! Page not found
        </h2>
        <p className="text-muted-foreground mt-4 mb-8 max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
          The page you're looking for doesn't exist or has been moved. 
          Don't worry, you can find plenty of other things on our homepage.
        </p>
        <Button size="lg">
          <Link href="/">
            Return to Homepage
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}