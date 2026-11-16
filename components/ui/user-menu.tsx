'use client'

import { User, FileText, Settings, LogOut, ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from './dropdown-menu'
import { Button } from './button'
import Link from 'next/link'

interface UserMenuProps {
  userEmail: string
  onSignOut: () => void
}

export function UserMenu({ userEmail, onSignOut }: UserMenuProps) {
  return (
    <DropdownMenu
      trigger={
        <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-accent">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline text-sm max-w-32 truncate">
            {userEmail}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      }
      align="right"
    >
      <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b border-border mb-1">
        <div className="truncate">{userEmail}</div>
      </div>
      
      <Link href="/dashboard">
        <DropdownMenuItem className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
      </Link>
      
      <Link href="/preferences">
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
      </Link>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem 
        onClick={onSignOut}
        className="cursor-pointer text-destructive focus:text-destructive hover:text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Sign Out</span>
      </DropdownMenuItem>
    </DropdownMenu>
  )
}