"use client"

import { ChatProvider } from '@/context/AppRefreshContext'
import Head from 'next/head'
import React from 'react'

function WrapperLayout({ children }) {
  return (
    <ChatProvider>
      {children}
    </ChatProvider>
  )
}

export default WrapperLayout