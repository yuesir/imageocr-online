'use client'

import { marked } from 'marked'
import { useEffect, useState } from 'react'

interface MarkdownContentProps {
  content: string
}

// 生成标题ID的函数，与blog.ts中的逻辑保持一致
function generateHeadingId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    const parseMarkdown = async () => {
      try {
        // 创建自定义renderer
        const renderer = new marked.Renderer()
        
        // 重写标题渲染方法，为每个标题添加ID
        renderer.heading = function({ tokens, depth }) {
          const text = this.parser.parseInline(tokens)
          const id = generateHeadingId(text)
          return `<h${depth} id="${id}">${text}</h${depth}>`
        }
        
        // 配置 marked 选项
        marked.setOptions({
          breaks: true,
          gfm: true,
          renderer: renderer
        })
        
        const html = await marked.parse(content)
        setHtmlContent(html)
      } catch (error) {
        console.error('Error parsing markdown:', error)
        setHtmlContent('<p>Error loading content</p>')
      }
    }

    parseMarkdown()
  }, [content])

  if (!htmlContent) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-secondary  rounded mb-2" />
        <div className="h-4 bg-secondary  rounded mb-2" />
        <div className="h-4 bg-secondary  rounded mb-4" />
      </div>
    )
  }

  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
    />
  )
}