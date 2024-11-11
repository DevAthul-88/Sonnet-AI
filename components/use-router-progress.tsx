'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function useRouterProgress() {
  const [progress, setProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      // Handle route change start
      setIsTransitioning(true)
      setProgress(10)
      
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 90) {
            return Math.min(prevProgress + Math.random() * 10, 90)
          }
          return prevProgress
        })
      }, 300)

      // Handle route change complete
      setTimeout(() => {
        setProgress(100)
        setTimeout(() => {
          setIsTransitioning(false)
          setProgress(0) // Reset progress after the animation
        }, 500)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [pathname]) // Run effect whenever the pathname changes

  return { progress, isTransitioning }
}
