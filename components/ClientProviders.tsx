'use client'
import { Toaster } from 'react-hot-toast'
import React from 'react'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      {children}
    </>
  )
}
