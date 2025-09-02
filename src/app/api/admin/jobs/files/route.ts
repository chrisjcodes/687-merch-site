import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth-helpers';
import { put } from '@vercel/blob';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobId = formData.get('jobId') as string;
    const placementId = formData.get('placementId') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    if (!jobId || !placementId) {
      return NextResponse.json(
        { error: 'Missing jobId or placementId' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['image/png', 'image/svg+xml', 'application/pdf', 'application/eps'];
    const allowedExtensions = ['.png', '.svg', '.pdf', '.eps'];
    const fileExtension = path.extname(file.name).toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG, SVG, PDF, and EPS files are allowed.' },
        { status: 400 }
      );
    }
    
    // Generate unique filename with proper path structure
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${placementId}_${timestamp}_${sanitizedName}`;
    const blobPath = `jobs/${jobId}/${filename}`;
    
    // Upload to Vercel Blob
    const blob = await put(blobPath, file, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    return NextResponse.json({
      success: true,
      filename,
      originalName: file.name,
      fileUrl: blob.url,
      blobPath: blobPath,
      size: file.size,
      type: file.type,
    });
    
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}