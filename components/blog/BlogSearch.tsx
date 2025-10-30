'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface BlogSearchProps {
  placeholder?: string
  className?: string
}

export default function BlogSearch({ placeholder = "Search articles...", className = "" }: BlogSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Initialize search query from URL parameters
  useEffect(() => {
    const query = searchParams.get('search') || ''
    setSearchQuery(query)
  }, [searchParams])

  const handleSearch = (query: string) => {
    setIsSearching(true)
    
    const params = new URLSearchParams(searchParams.toString())
    
    if (query.trim()) {
      params.set('search', query.trim())
    } else {
      params.delete('search')
    }
    
    // Reset to first page
    params.delete('page')
    
    const queryString = params.toString()
    const url = queryString ? `/blog?${queryString}` : '/blog'
    
    router.push(url)
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
    }, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  const handleClear = () => {
    setSearchQuery('')
    handleSearch('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 transition-colors ${isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          disabled={isSearching}
        />
        
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={isSearching}
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>
      
      {/* Search suggestions or quick actions */}
      {searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <div className="p-2">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2 transition-colors"
            >
              <Search className="h-4 w-4" />
              Search "{searchQuery}"
            </button>
          </div>
        </div>
      )}
    </form>
  )
}