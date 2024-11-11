'use client'

import { Progress } from '@/components/ui/progress'
import { useRouterProgress } from './use-router-progress'

export function RouterProgressBar() {
  const { progress, isTransitioning } = useRouterProgress()

  if (!isTransitioning) {
    return null
  }

  return (
    <Progress
      value={progress}
      className="fixed top-0 left-0 right-0 z-50 h-1 w-full rounded-none bg-transparent"
    />
  )
}