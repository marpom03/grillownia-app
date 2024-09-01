import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/navbar/Navbar.jsx'
export default function RootLayout() {
  return (
    <div>
        <Navbar/>
        <Outlet />
    </div>
  )
}
