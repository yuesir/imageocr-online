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
  const activeCategoryClass = "bg-primary text-white border-border"
  const inactiveCategoryClass = "bg-card  text-muted-foreground  border-border  hover:bg-background "

  return (
    <div className="bg-card  rounded-lg border border-border  p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-5 w-5 text-muted-foreground " />
        <h3 className="font-semibold text-foreground ">Categories</h3>
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
      <div className="mt-4 pt-3 border-t border-border ">
        <p className="text-xs text-muted-foreground ">
          {categories.length} categories total
        </p>
      </div>
    </div>
  )
}