'use client'

import { useState, useEffect, useCallback, MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Clock,
  Languages,
  Percent,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { formatDate, formatFileSize, copyToClipboard } from '@/lib/utils'
import { Input } from '@/components/ui/input'

type OCRResult = {
  id: string
  file_id: string
  extracted_text: string
  confidence_score: number
  language_detected: string
  processing_time: number
  word_count: number
  character_count: number
  created_at: string
  files: {
    id: string
    original_name: string
    file_size: number
    mime_type: string
    file_path: string
  }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<OCRResult[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredResults, setFilteredResults] = useState<OCRResult[]>([])
  const [selectedResult, setSelectedResult] = useState<OCRResult | null>(null)

  const loadOCRResults = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ocr_results')
        .select(`
          *,
          files (
            id,
            original_name,
            file_size,
            mime_type,
            file_path
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setResults(data || [])
    } catch (error) {
      console.error('Error loading OCR results:', error)
      toast.error('Failed to load OCR results')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    loadOCRResults()
  }, [user, router, loadOCRResults])

  useEffect(() => {
    // Filter results based on search term
    const filtered = results.filter(result => 
      result.extracted_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.files.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.language_detected.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredResults(filtered)
  }, [results, searchTerm])

  const deleteResult = async (resultId: string) => {
    try {
      const { error } = await supabase
        .from('ocr_results')
        .delete()
        .eq('id', resultId)
        .eq('user_id', user?.id)

      if (error) throw error

      setResults(prev => prev.filter(result => result.id !== resultId))
      setSelectedResult(null)
      toast.success('OCR result deleted successfully')
    } catch (error) {
      console.error('Error deleting OCR result:', error)
      toast.error('Failed to delete OCR result')
    }
  }

  const downloadResult = (result: OCRResult) => {
    const blob = new Blob([result.extracted_text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.files.original_name}_ocr_result.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('OCR result downloaded')
  }

  const copyResult = async (text: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      toast.success('Text copied to clipboard')
    } else {
      toast.error('Failed to copy text')
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              OCR Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage your OCR processing history
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredResults.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchTerm ? 'No matching results found' : 'No OCR results yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Start by processing your first image'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/">
                    <Button>
                      Start OCR Processing
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Results List */}
              <div className="lg:col-span-2 space-y-4">
                {filteredResults.map((result) => (
                  <Card 
                    key={result.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedResult?.id === result.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedResult(result)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {result.files.original_name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {formatDate(result.created_at)}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation()
                              copyResult(result.extracted_text)
                            }}
                            title="Copy text"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation()
                              downloadResult(result)
                            }}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: MouseEvent) => {
                              e.stopPropagation()
                              deleteResult(result.id)
                            }}
                            title="Delete"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Languages className="h-4 w-4 text-gray-400" />
                          <span className="capitalize">{result.language_detected}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4 text-gray-400" />
                          <span>{Math.round(result.confidence_score)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{result.processing_time}ms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>{result.word_count} words</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {result.extracted_text.substring(0, 150)}...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Result Detail Panel */}
              <div className="lg:col-span-1">
                {selectedResult ? (
                  <Card className="sticky top-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Result Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">File Information</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Name:</strong> {selectedResult.files.original_name}</p>
                          <p><strong>Size:</strong> {formatFileSize(selectedResult.files.file_size)}</p>
                          <p><strong>Type:</strong> {selectedResult.files.mime_type}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">OCR Statistics</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Language:</strong> {selectedResult.language_detected}</p>
                           <p><strong>Confidence:</strong> {Math.round(selectedResult.confidence_score)}%</p>
                          <p><strong>Processing Time:</strong> {selectedResult.processing_time}ms</p>
                          <p><strong>Words:</strong> {selectedResult.word_count}</p>
                          <p><strong>Characters:</strong> {selectedResult.character_count}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Extracted Text</h4>
                        <div className="max-h-64 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                          <pre className="whitespace-pre-wrap font-mono">
                            {selectedResult.extracted_text}
                          </pre>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyResult(selectedResult.extracted_text)}
                          className="flex-1"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadResult(selectedResult)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-300">
                        Select a result to view details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}