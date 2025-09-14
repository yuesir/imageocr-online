import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateImageFile, generateId } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    // Get user from session (optional for anonymous users)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Allow both authenticated and anonymous users
    const isAuthenticated = !authError && user

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${generateId()}.${fileExtension}`
    // Use different path for authenticated vs anonymous users
    const filePath = isAuthenticated 
      ? `uploads/${user!.id}/${fileName}`
      : `temp/${fileName}`

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('ocr-files')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ocr-files')
      .getPublicUrl(filePath)

    // Save file record to database only for authenticated users
    if (isAuthenticated) {
      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
          id: generateId(),
          user_id: user!.id,
          original_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        // Clean up uploaded file
        await supabase.storage.from('ocr-files').remove([filePath])
        return NextResponse.json(
          { error: 'Failed to save file record' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        file: {
          id: fileRecord.id,
          filename: fileRecord.original_name,
          url: publicUrl,
          size: fileRecord.file_size,
          type: fileRecord.mime_type
        }
      })
    } else {
      // For anonymous users, return temporary file info without database record
      return NextResponse.json({
        success: true,
        file: {
          id: generateId(), // Temporary ID for frontend compatibility
          filename: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type
        }
      })
    }

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}