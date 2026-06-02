import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, BottomNav } from './Sidebar'
import { Header } from './Header'
import { ToastContainer } from '../ui/Toast'

export function AppShell({ title, subtitle }) {
  return (
    <div className="flex h-screen bg-[var(--color-background)] overflow-hidden">
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />

      {/* Global toast container */}
      <ToastContainer />
    </div>
  )
}
