'use client'

import { useState, useEffect } from 'react'
import { TableOfContentsItem } from '@/lib/types/blog'
import { List, ChevronRight } from 'lucide-react'

interface TableOfContentsProps {
  items: TableOfContentsItem[]
  className?: string
}

export default function TableOfContents({ items, className = "" }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    )

    // Observe all heading elements
    const headingElements = items.map(item => document.getElementById(item.id)).filter(Boolean)
    headingElements.forEach(element => {
      if (element) observer.observe(element)
    })

    return () => {
      headingElements.forEach(element => {
        if (element) observer.unobserve(element)
      })
    }
  }, [items])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Consider fixed navigation bar height
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  const renderTocItem = (item: TableOfContentsItem, level: number = 0) => {
    const isActive = activeId === item.id
    const hasChildren = item.children && item.children.length > 0

    return (
      <li key={item.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <button
          onClick={() => scrollToHeading(item.id)}
          className={`block w-full text-left py-1 px-2 rounded text-sm transition-colors ${
            isActive
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <span className={`inline-block ${level > 0 ? 'text-xs' : 'text-sm'}`}>
            {item.title}
          </span>
        </button>
        
        {hasChildren && (
          <ul className="mt-1 space-y-1">
            {item.children!.map(child => renderTocItem(child, level + 1))}
          </ul>
        )}
      </li>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Table of Contents</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight 
            className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} 
          />
        </button>
      </div>

      {/* Table of Contents Content */}
      {isOpen && (
        <div className="p-4">
          <nav>
            <ul className="space-y-1">
              {items.map(item => renderTocItem(item))}
            </ul>
          </nav>
          
          {/* Progress Indicator */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${items.findIndex(item => item.id === activeId) >= 0 
                      ? ((items.findIndex(item => item.id === activeId) + 1) / items.length) * 100 
                      : 0}%` 
                  }}
                />
              </div>
              <span>
                {items.findIndex(item => item.id === activeId) + 1}/{items.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}