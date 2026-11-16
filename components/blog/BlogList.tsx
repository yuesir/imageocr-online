import { BlogListProps } from '@/lib/types/blog'
import BlogCard from './BlogCard'

export default function BlogList({ posts, currentPage, totalPages, totalPosts, category, searchQuery }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-secondary  rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground  mb-2">
            No Articles Found
          </h3>
          <p className="text-muted-foreground ">
            {searchQuery ? `No articles found containing "${searchQuery}"` : 
             category ? `No articles in "${category}" category yet` : 
             'No articles have been published yet'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Articles Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Article Statistics */}
      <div className="flex items-center justify-between text-sm text-muted-foreground  pt-4 border-t border-border ">
        <div>
          Showing {((currentPage - 1) * 6) + 1} - {Math.min(currentPage * 6, totalPosts)} of {totalPosts} articles
        </div>
        <div>
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  )
}