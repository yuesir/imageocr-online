import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog'
import MarkdownContent from '@/components/blog/MarkdownContent'
import TableOfContents from '@/components/blog/TableOfContents'
import RelatedPosts from '@/components/blog/RelatedPosts'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static paths
export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist or has been deleted'
    }
  }

  const seoTitle = post.seo?.title || post.title
  const seoDescription = post.seo?.description || post.description
  const seoKeywords = post.seo?.keywords || [...post.tags, post.category]

  return {
    title: `${seoTitle} - OCR Technology Blog`,
    description: seoDescription,
    keywords: seoKeywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      url: `https://imageocrai.com/blog/${post.slug}`,
      images: post.image ? [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: post.image ? [post.image] : undefined
    }
  }
}

// Article content loading component
function ArticleContentSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-secondary  rounded mb-4" />
      <div className="h-4 bg-secondary  rounded mb-2" />
      <div className="h-4 bg-secondary  rounded mb-2" />
      <div className="h-4 bg-secondary  rounded mb-8" />
      
      {[...Array(5)].map((_, i) => (
        <div key={i} className="mb-6">
          <div className="h-6 bg-secondary  rounded mb-3" />
          <div className="h-4 bg-secondary  rounded mb-2" />
          <div className="h-4 bg-secondary  rounded mb-2" />
          <div className="h-4 bg-secondary  rounded w-3/4" />
        </div>
      ))}
    </div>
  )
}

async function ArticleContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category, post.tags)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main content */}
      <div className="lg:col-span-3">
        {/* Back to blog */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-primary  hover:text-primary  mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Article header */}
        <article className="bg-card  rounded-lg shadow-tactile overflow-hidden">
          {/* Featured image */}
          {post.image && (
            <div className="aspect-video relative overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Category and featured badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-primary  ">
                <Tag className="w-3 h-3 mr-1" />
                {post.category}
              </span>
              {post.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-primary  ">
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground  mb-4">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground  mb-6">
              {post.description}
            </p>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground  mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>

            {/* Tags and Share buttons */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-8 border-b border-border ">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary text-muted-foreground  "
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Article content */}
            <div className="article-content prose prose-lg dark:prose-invert max-w-none mt-8">
              <MarkdownContent content={post.content} />
            </div>
          </div>
        </article>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <RelatedPosts posts={relatedPosts} />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <TableOfContents items={post.tableOfContents} />
        </div>
      </div>
    </div>
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Suspense fallback={<ArticleContentSkeleton />}>
            <ArticleContent slug={slug} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}