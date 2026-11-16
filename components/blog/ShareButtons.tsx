'use client'

import { Share2 } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const shareTitle = encodeURIComponent(title)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      // Can add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border ">
      <span className="text-sm font-medium text-muted-foreground ">Share Article:</span>
      <div className="flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-secondary text-primary hover:bg-secondary    transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </a>
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-lg bg-secondary text-muted-foreground hover:bg-secondary    transition-colors"
          title="Copy Link"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}