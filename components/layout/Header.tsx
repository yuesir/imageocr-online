'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LogIn, Zap } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserMenu } from '@/components/ui/user-menu'

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/invoices-ocr', label: 'Invoice OCR' },
  { href: '/jpg-to-text', label: 'JPG to Text' },
  { href: '/receipts-ocr', label: 'Receipt OCR' },
  { href: '/pricing', label: 'Pricing' },
]

export function Header() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || (href !== '/' && pathname?.startsWith(`${href}/`))
  const menuClassName = (href: string) => `border-b-2 px-1 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring ${isActive(href) ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`

  return (
    <nav className="border-b bg-card/80  backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Zap className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
            <span className="font-serif text-xl text-foreground sm:text-2xl">ImageOCRAI</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map(({ href, label }) => (
              <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined} className={menuClassName(href)}>
                {label}
              </Link>
            ))}
          </div>
          
          <details className="relative md:hidden">
            <summary className="cursor-pointer text-sm text-muted-foreground">Tools</summary>
            <div className="absolute left-0 top-8 z-50 w-52 rounded-lg border bg-popover p-4 shadow-tactile space-y-3">
              {[...navigation, { href: '/blog', label: 'Journal' }].map(({ href, label }) => <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined} className={`block ${menuClassName(href)}`}>{label}</Link>)}
            </div>
          </details>
          <div className="flex items-center gap-1 sm:gap-4">
            {user ? (
              <UserMenu 
                userEmail={user.email || ''} 
                onSignOut={() => signOut()}
              />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="mr-2 hidden h-4 w-4 sm:block" />
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
