import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { RelatedPost } from '@/lib/types/blog'

interface RelatedPostsProps {
  posts: RelatedPost[]
  className?: string
}

export default function RelatedPosts({ posts, className = "" }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={`bg-card  rounded-lg border border-border  ${className}`}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground  mb-4">
          Related Articles
        </h3>
        
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex gap-4 p-4 rounded-lg hover:bg-background  transition-colors">
                  {/* Article Image */}
                  {post.image && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Article Information */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground  group-hover:text-primary  transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground  line-clamp-2 mb-3">
                      {post.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground ">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary text-primary  ">
                        {post.category}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTime} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
        
        {/* View More */}
        <div className="mt-6 pt-4 border-t border-border ">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary  hover:text-primary  font-medium text-sm transition-colors"
          >
            View More Articles
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}