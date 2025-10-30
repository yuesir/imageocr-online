import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost, BlogPostContent, TableOfContentsItem, RelatedPost, BlogMetadata } from './types/blog'
import Fuse from 'fuse.js'

const POSTS_DIRECTORY = path.join(process.cwd(), 'content/blog')
const POSTS_PER_PAGE = 6

// 确保博客目录存在
function ensureBlogDirectory() {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    fs.mkdirSync(POSTS_DIRECTORY, { recursive: true })
  }
}

// 获取所有博客文章
export async function getAllPosts(): Promise<BlogPost[]> {
  ensureBlogDirectory()
  
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return []
  }

  const fileNames = fs.readdirSync(POSTS_DIRECTORY)
  const posts = fileNames
    .filter(name => name.endsWith('.mdx'))
    .map(name => {
      const slug = name.replace(/\.mdx$/, '')
      const fullPath = path.join(POSTS_DIRECTORY, name)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      const metadata = data as BlogMetadata
      
      return {
        slug,
        title: metadata.title || '',
        description: metadata.description || '',
        content: content.substring(0, 200) + '...',
        date: metadata.date || new Date().toISOString(),
        author: metadata.author || 'Anonymous',
        category: metadata.category || 'Uncategorized',
        tags: metadata.tags || [],
        readingTime: metadata.readingTime || calculateReadingTime(content),
        published: metadata.published !== false,
        featured: metadata.featured || false,
        image: metadata.image,
        seo: metadata.seo
      } as BlogPost
    })
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

// 根据 slug 获取单篇文章
export async function getPostBySlug(slug: string): Promise<BlogPostContent | null> {
  ensureBlogDirectory()
  
  const fullPath = path.join(POSTS_DIRECTORY, `${slug}.mdx`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const metadata = data as BlogMetadata

  const tableOfContents = generateTableOfContents(content)

  return {
    slug,
    title: metadata.title || '',
    description: metadata.description || '',
    content,
    mdxContent: content,
    date: metadata.date || new Date().toISOString(),
    author: metadata.author || 'Anonymous',
    category: metadata.category || 'Uncategorized',
    tags: metadata.tags || [],
    readingTime: metadata.readingTime || calculateReadingTime(content),
    published: metadata.published !== false,
    featured: metadata.featured || false,
    image: metadata.image,
    seo: metadata.seo,
    tableOfContents
  }
}

// 获取分页文章
export async function getPaginatedPosts(
  page: number = 1,
  category?: string,
  searchQuery?: string,
  tag?: string
): Promise<{
  posts: BlogPost[]
  currentPage: number
  totalPages: number
  totalPosts: number
}> {
  let posts = await getAllPosts()

  // 按分类筛选
  if (category && category !== 'all') {
    posts = posts.filter(post => 
      post.category.toLowerCase() === category.toLowerCase()
    )
  }

  // 按标签筛选
  if (tag) {
    posts = posts.filter(post => 
      post.tags.some(postTag => 
        postTag.toLowerCase() === tag.toLowerCase()
      )
    )
  }

  // 搜索筛选
  if (searchQuery) {
    posts = searchPosts(posts, searchQuery)
  }

  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
  const startIndex = (page - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE

  return {
    posts: posts.slice(startIndex, endIndex),
    currentPage: page,
    totalPages,
    totalPosts
  }
}

// 搜索文章
export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  const fuse = new Fuse(posts, {
    keys: ['title', 'description', 'content', 'tags', 'category'],
    threshold: 0.3,
    includeScore: true
  })

  const results = fuse.search(query)
  return results.map(result => result.item)
}

// 获取相关文章
export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  tags: string[],
  limit: number = 3
): Promise<RelatedPost[]> {
  const allPosts = await getAllPosts()
  
  // 排除当前文章
  const otherPosts = allPosts.filter(post => post.slug !== currentSlug)
  
  // 计算相关性分数
  const scoredPosts = otherPosts.map(post => {
    let score = 0
    
    // 同分类加分
    if (post.category === category) {
      score += 3
    }
    
    // 共同标签加分
    const commonTags = post.tags.filter(tag => tags.includes(tag))
    score += commonTags.length * 2
    
    return { post, score }
  })
  
  // 按分数排序并返回前几篇
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      category: post.category,
      readingTime: post.readingTime,
      image: post.image
    }))
}

// 获取所有分类
export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts()
  const categories = [...new Set(posts.map(post => post.category))]
  return categories.sort()
}

// 获取所有标签
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tags = [...new Set(posts.flatMap(post => post.tags))]
  return tags.sort()
}

// 计算阅读时间（分钟）
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// 生成目录
function generateTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: TableOfContentsItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    headings.push({
      id,
      title,
      level
    })
  }

  return buildNestedToc(headings)
}

// 构建嵌套目录结构
function buildNestedToc(headings: TableOfContentsItem[]): TableOfContentsItem[] {
  const result: TableOfContentsItem[] = []
  const stack: TableOfContentsItem[] = []

  for (const heading of headings) {
    // 清理栈，移除比当前标题级别高或相等的项
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      // 顶级标题
      result.push(heading)
    } else {
      // 子标题
      const parent = stack[stack.length - 1]
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(heading)
    }

    stack.push(heading)
  }

  return result
}

// 获取特色文章
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts
    .filter(post => post.featured)
    .slice(0, limit)
}

// 获取最新文章
export async function getLatestPosts(limit: number = 5): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.slice(0, limit)
}