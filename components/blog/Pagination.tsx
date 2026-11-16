'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { PaginationProps } from '@/lib/types/blog'

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    
    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  const buttonBaseClass = "relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors focus:z-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  const activeButtonClass = "z-10 bg-primary text-white border-border"
  const inactiveButtonClass = "bg-card  text-muted-foreground  border-border  hover:bg-background "
  const disabledButtonClass = "bg-secondary  text-muted-foreground  border-border  cursor-not-allowed"

  return (
    <nav className="flex items-center justify-between border-t border-border  px-4 py-3 sm:px-6" aria-label="Pagination Navigation">
      {/* Mobile simplified version */}
      <div className="flex flex-1 justify-between sm:hidden">
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="relative inline-flex items-center rounded-md border border-border  bg-card  px-4 py-2 text-sm font-medium text-muted-foreground  hover:bg-background "
          >
            Previous
          </Link>
        ) : (
          <span className="relative inline-flex items-center rounded-md border border-border  bg-secondary  px-4 py-2 text-sm font-medium text-muted-foreground  cursor-not-allowed">
            Previous
          </span>
        )}
        
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="relative ml-3 inline-flex items-center rounded-md border border-border  bg-card  px-4 py-2 text-sm font-medium text-muted-foreground  hover:bg-background "
          >
            Next
          </Link>
        ) : (
          <span className="relative ml-3 inline-flex items-center rounded-md border border-border  bg-secondary  px-4 py-2 text-sm font-medium text-muted-foreground  cursor-not-allowed">
            Next
          </span>
        )}
      </div>

      {/* Desktop full version */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground ">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span> pages
          </p>
        </div>
        
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-tactile" aria-label="Pagination">
            {/* Previous page button */}
            {currentPage > 1 ? (
              <Link
                href={createPageUrl(currentPage - 1)}
                className={`${buttonBaseClass} ${inactiveButtonClass} rounded-l-md border`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span className={`${buttonBaseClass} ${disabledButtonClass} rounded-l-md border`}>
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </span>
            )}

            {/* Page number buttons */}
            {visiblePages.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`dots-${index}`}
                    className={`${buttonBaseClass} ${inactiveButtonClass} border`}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </span>
                )
              }

              const pageNumber = page as number
              const isActive = pageNumber === currentPage

              return (
                <Link
                  key={pageNumber}
                  href={createPageUrl(pageNumber)}
                  className={`${buttonBaseClass} ${isActive ? activeButtonClass : inactiveButtonClass} border`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNumber}
                </Link>
              )
            })}

            {/* Next page button */}
            {currentPage < totalPages ? (
              <Link
                href={createPageUrl(currentPage + 1)}
                className={`${buttonBaseClass} ${inactiveButtonClass} rounded-r-md border`}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span className={`${buttonBaseClass} ${disabledButtonClass} rounded-r-md border`}>
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
          </nav>
        </div>
      </div>
    </nav>
  )
}