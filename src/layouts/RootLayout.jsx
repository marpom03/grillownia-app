import React from 'react'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div>
        <h1>
            Root layout    
        </h1>
        <Outlet />
    </div>
  )
}
