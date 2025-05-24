import ReactQueryProvider from '@/providers/react-query-provider'
import React from 'react'

export default function layout({children}: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
    {children}
    </ReactQueryProvider>
  )
}
