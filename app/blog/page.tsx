import { Suspense } from 'react'
import { Metadata } from 'next'
import { getPaginatedPosts } from '@/lib/blog'
import BlogList from '@/components/blog/BlogList'
import Pagination from '@/components/blog/Pagination'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BookOpen } from 'lucide-react'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'OCR Technology Blog - Image Recognition & Text Extraction Technology Sharing',
  description: 'Professional OCR technology blog sharing image recognition, text extraction, machine learning and other cutting-edge technologies to help developers master OCR application development skills.',
  keywords: ['OCR Technology', 'Image Recognition', 'Text Extraction', 'Machine Learning', 'Artificial Intelligence', 'Technology Blog'],
  openGraph: {
    title: 'OCR Technology Blog - Image Recognition & Text Extraction Technology Sharing',
    description: 'Professional OCR technology blog sharing image recognition, text extraction, machine learning and other cutting-edge technologies',
    type: 'website',
    url: 'https://imageocr-online.com/blog'
  }
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>
}

// Loading component
function BlogListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200 dark:bg-gray-700" />
          <div className="p-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="flex gap-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function BlogContent({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10)

  // Get paginated posts (without category, search, or tag filters)
  const { posts, totalPages, totalPosts } = await getPaginatedPosts(page)

  return (
    <div className="space-y-8">
      {/* Blog posts */}
      <BlogList 
        posts={posts}
        currentPage={page}
        totalPages={totalPages}
        totalPosts={totalPosts}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/blog"
            searchParams={new URLSearchParams()}
          />
        </div>
      )}

      {/* Empty state */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No articles found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            No articles published yet
          </p>
        </div>
      )}
    </div>
  )
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Page header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                OCR Technology Blog
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Image OCR Recognition: Best Practices for Specific Scenarios
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Suspense fallback={<BlogListSkeleton />}>
            <BlogContent searchParams={resolvedSearchParams} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}