'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CategoryFilterProps } from '@/lib/types/blog'
import { Filter } from 'lucide-react'

export default function CategoryFilter({ categories, currentCategory, baseUrl }: CategoryFilterProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(urlSearchParams.toString())
    
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    
    // Reset to first page
    params.delete('page')
    
    const queryString = params.toString()
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl
    
    router.push(url)
  }

  const allCategories = ['all', ...categories]
  const activeCategoryClass = "bg-blue-600 text-white border-blue-600"
  const inactiveCategoryClass = "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Categories</h3>
      </div>
      
      <div className="space-y-2">
        {allCategories.map((category) => {
          const isActive = (category === 'all' && !currentCategory) || currentCategory === category
          const displayName = category === 'all' ? 'All' : category
          
          return (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                isActive ? activeCategoryClass : inactiveCategoryClass
              }`}
            >
              {displayName}
            </button>
          )
        })}
      </div>
      
      {/* Category Statistics */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {categories.length} categories total
        </p>
      </div>
    </div>
  )
}