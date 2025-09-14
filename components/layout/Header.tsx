'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogIn, Zap } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { UserMenu } from '@/components/ui/user-menu'

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-foreground">ImageOCRAI</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/invoices-ocr" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Invoice OCR
            </Link>
            <Link href="/jpg-to-text" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              JPG to Text
            </Link>
            <Link href="/receipts-ocr" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Receipt OCR
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <UserMenu 
                userEmail={user.email || ''} 
                onSignOut={() => signOut()}
              />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}