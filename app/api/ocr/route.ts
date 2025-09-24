import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import Tesseract from 'tesseract.js'
import { Buffer } from 'buffer'

export async function POST(request: NextRequest) {
  try {
    // Get authorization token from request headers
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Create authenticated supabase client
    const _authenticatedSupabase = supabase.auth.setSession({
      access_token: token,
      refresh_token: ''
    })
    
    // Check authentication with the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fileId } = await request.json()
    
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
    }

    // Verify file ownership
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', user.id)
      .single()

    if (fileError || !file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Get the file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('ocr-files')
      .download(file.file_path)

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
    }

    // Convert blob to buffer for Tesseract
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const startTime = Date.now()

    // Perform OCR using Tesseract.js
    const { data: { text, confidence } } = await Tesseract.recognize(
      buffer,
      'eng+chi_sim+chi_tra', // Support English and Chinese
      {
        logger: m => console.log(m) // Optional: log progress
      }
    )

    const processingTime = Date.now() - startTime
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length
    const characterCount = text.length

    // Detect primary language (simple heuristic)
    const chineseCharRegex = /[\u4e00-\u9fff]/g
    const chineseCharCount = (text.match(chineseCharRegex) || []).length
    const detectedLanguage = chineseCharCount > characterCount * 0.3 ? 'zh' : 'en'

    // Save OCR result to database
    const { data: ocrResult, error: ocrError } = await supabase
      .from('ocr_results')
      .insert({
        file_id: fileId,
        user_id: user.id,
        extracted_text: text,
        confidence_score: confidence / 100, // Tesseract returns 0-100, we want 0-1
        language_detected: detectedLanguage,
        processing_time_ms: processingTime,
        word_count: wordCount,
        character_count: characterCount,
        status: 'completed'
      })
      .select()
      .single()

    if (ocrError) {
      console.error('Error saving OCR result:', ocrError)
      return NextResponse.json({ error: 'Failed to save OCR result' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      result: {
        id: ocrResult.id,
        text: ocrResult.extracted_text,
        confidence: ocrResult.confidence_score,
        language: ocrResult.language_detected,
        processing_time: ocrResult.processing_time_ms,
        word_count: ocrResult.word_count,
        character_count: ocrResult.character_count,
        status: ocrResult.status
      }
    })
  } catch (error) {
    console.error('OCR processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}