export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  date: string
  author: string
  category: string
  tags: string[]
  readingTime: number
  published: boolean
  featured?: boolean
  image?: string
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
}

export interface BlogPostContent extends BlogPost {
  mdxContent: string
  tableOfContents: TableOfContentsItem[]
}

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
  children?: TableOfContentsItem[]
}

export interface BlogListProps {
  posts: BlogPost[]
  currentPage: number
  totalPages: number
  totalPosts: number
  category?: string
  searchQuery?: string
}

export interface BlogSearchParams {
  page?: string
  category?: string
  search?: string
  tag?: string
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: URLSearchParams
}

export interface CategoryFilterProps {
  categories: string[]
  currentCategory?: string
  baseUrl: string
  searchParams?: URLSearchParams
}

export interface RelatedPost {
  slug: string
  title: string
  description: string
  date: string
  category: string
  readingTime: number
  image?: string
}

export interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export interface BlogMetadata {
  title: string
  description: string
  date: string
  author: string
  category: string
  tags: string[]
  published: boolean
  featured?: boolean
  image?: string
  readingTime?: number
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
}