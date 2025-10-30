'use client'

import { marked } from 'marked'
import { useEffect, useState } from 'react'

interface MarkdownContentProps {
  content: string
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    const parseMarkdown = async () => {
      try {
        // 配置 marked 选项
        marked.setOptions({
          breaks: true,
          gfm: true,
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
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
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