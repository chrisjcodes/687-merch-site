# File Management Documentation

The 687 Merch Site uses Vercel Blob storage for secure, scalable design file management with global CDN delivery.

## File Storage Overview

### Vercel Blob Integration
- **Scalable**: Automatically handles file storage and delivery
- **Global CDN**: Fast file access worldwide via Vercel's edge network  
- **Secure**: Built-in access controls and authentication
- **Simple**: No server management or storage infrastructure needed

### Supported File Types
- **PNG**: Raster images, logos, photos
- **SVG**: Vector graphics, scalable logos
- **PDF**: Print-ready artwork, multi-page designs
- **EPS**: Vector graphics for professional printing

### File Organization Structure
```
jobs/
├── {jobId}/
│   ├── {placementId}_{timestamp}_{originalName}.png
│   ├── {placementId}_{timestamp}_{originalName}.svg
│   └── {placementId}_{timestamp}_{originalName}.pdf
└── {anotherJobId}/
    └── ...
```

## File Upload System

### Upload API Endpoint (`/api/admin/jobs/files`)

```typescript
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  await requireAdminSession();
  
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const jobId = formData.get('jobId') as string;
  const placementId = formData.get('placementId') as string;
  
  // Validate file type
  const allowedTypes = ['image/png', 'image/svg+xml', 'application/pdf', 'application/eps'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type' },
      { status: 400 }
    );
  }
  
  // Generate unique filename
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
    size: file.size,
    type: file.type,
  });
}
```

### File Upload Workflow

1. **Form Submission**: User selects file in job creation form
2. **Immediate Upload**: File uploaded to Vercel Blob during job creation
3. **Database Storage**: File URL and metadata saved to job item
4. **Access Control**: Files accessible via public URLs for authorized users

### Frontend File Upload

**File Upload Component**
```tsx
'use client';
import { useState } from 'react';

export function FileUpload({ onFileUpload, placementId }) {
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('placementId', placementId);
      
      const response = await fetch('/api/admin/jobs/files', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        onFileUpload(result);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div>
      <input
        type="file"
        accept=".png,.svg,.pdf,.eps"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

## File Access & Downloads

### Direct URL Access

**Public URLs**: Vercel Blob provides public URLs that work as direct downloads
```
https://blob.vercel-storage.com/jobs/cm123456789/placement-1_1642234567890_logo.png
```

**Download Implementation**
```tsx
const handleDownload = (fileUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
```

### File Metadata Storage

**Database Integration**
Files are referenced in the job item's `printSpec` JSON field:

```json
{
  "placements": [
    {
      "id": "placement-1",
      "location": "Full Size Front",
      "width": 12,
      "height": 12,
      "art": "Company Logo",
      "decorationMethod": "HTV",
      "designFileName": "logo.png",
      "designFileUrl": "https://blob.vercel-storage.com/jobs/cm123456789/placement-1_1642234567890_logo.png"
    }
  ]
}
```

**Database Update API**
```typescript
// /api/admin/jobs/[id]/files
export async function PATCH(request: NextRequest, { params }) {
  const { id: jobId } = await params;
  const { placementId, fileUrl, fileName } = await request.json();
  
  // Update job item with file reference
  const updatedItems = await updateJobItemPrintSpec(jobId, placementId, {
    designFileName: fileName,
    designFileUrl: fileUrl
  });
  
  return NextResponse.json({ success: true });
}
```

## File Validation & Security

### File Type Validation

**MIME Type Checking**
```typescript
const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'image/png',
    'image/svg+xml', 
    'application/pdf',
    'application/eps',
    'application/postscript' // Alternative EPS MIME type
  ];
  
  return allowedTypes.includes(file.type);
};
```

**File Extension Validation**
```typescript
const validateFileExtension = (fileName: string): boolean => {
  const allowedExtensions = ['.png', '.svg', '.pdf', '.eps'];
  const extension = path.extname(fileName).toLowerCase();
  return allowedExtensions.includes(extension);
};
```

### File Size Limits

**Client-Side Validation**
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};
```

**Vercel Blob Limits**
- Default limit: 500MB per file
- Configurable based on plan
- Automatic handling of large file uploads

### Security Features

**Access Control**
- Upload requires admin authentication
- File URLs are public but obfuscated
- No directory listing possible
- Files organized by job ID

**File Naming Security**
```typescript
const sanitizeFilename = (filename: string): string => {
  // Remove potentially dangerous characters
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

const generateSecureFilename = (
  placementId: string, 
  originalName: string
): string => {
  const timestamp = Date.now();
  const sanitized = sanitizeFilename(originalName);
  return `${placementId}_${timestamp}_${sanitized}`;
};
```

## File Processing & Optimization

### Image Optimization

**Automatic Optimization** (Vercel Blob)
- Automatic format conversion (WebP when supported)
- Compression for web delivery
- Multiple resolution variants
- Lazy loading support

**Manual Optimization Options**
```typescript
// Future enhancement: Custom image processing
import sharp from 'sharp';

const optimizeImage = async (buffer: Buffer): Promise<Buffer> => {
  return await sharp(buffer)
    .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
};
```

### File Processing Workflow

1. **Upload**: Original file uploaded to Vercel Blob
2. **Validation**: File type and size validation
3. **Storage**: Secure storage with unique filename
4. **Reference**: Database updated with file URL
5. **Access**: Public URL available for downloads

## Error Handling

### Upload Error Scenarios

**Common Errors**
```typescript
enum FileUploadError {
  INVALID_FILE_TYPE = 'Invalid file type. Only PNG, SVG, PDF, and EPS files are allowed.',
  FILE_TOO_LARGE = 'File size exceeds the maximum limit of 10MB.',
  UPLOAD_FAILED = 'File upload failed. Please try again.',
  UNAUTHORIZED = 'Unauthorized. Admin access required.',
  INVALID_JOB_ID = 'Invalid job ID provided.',
}
```

**Error Handling Implementation**
```typescript
export async function POST(request: NextRequest) {
  try {
    // Upload logic here
  } catch (error) {
    if (error.code === 'FILE_TOO_LARGE') {
      return NextResponse.json(
        { error: FileUploadError.FILE_TOO_LARGE },
        { status: 413 }
      );
    }
    
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: FileUploadError.UPLOAD_FAILED },
      { status: 500 }
    );
  }
}
```

### Download Error Handling

**Client-Side Error Handling**
```tsx
const handleDownload = async (fileUrl: string, fileName: string) => {
  try {
    // Check if file exists
    const response = await fetch(fileUrl, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error('File not found');
    }
    
    // Proceed with download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Download failed:', error);
    alert('File download failed. Please contact support.');
  }
};
```

## Performance Optimization

### CDN Benefits

**Global Distribution**
- Files served from nearest edge location
- Reduced latency worldwide
- Automatic caching
- High availability

**Bandwidth Optimization**
- Compressed file delivery
- Browser caching headers
- Efficient file formats
- Progressive loading

### Upload Optimization

**Progress Tracking**
```tsx
const [uploadProgress, setUploadProgress] = useState(0);

const uploadWithProgress = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const xhr = new XMLHttpRequest();
  
  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      setUploadProgress(percentComplete);
    }
  });
  
  return new Promise((resolve, reject) => {
    xhr.onload = () => resolve(JSON.parse(xhr.responseText));
    xhr.onerror = reject;
    xhr.open('POST', '/api/admin/jobs/files');
    xhr.send(formData);
  });
};
```

## File Management Best Practices

### Naming Conventions

**Consistent Naming**
```typescript
const generateFileName = (
  placementId: string,
  timestamp: number,
  originalName: string
): string => {
  const sanitized = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();
  
  return `${placementId}_${timestamp}_${sanitized}`;
};
```

**Versioning Support** (Future Enhancement)
```typescript
const generateVersionedFileName = (
  placementId: string,
  originalName: string,
  version: number = 1
): string => {
  const timestamp = Date.now();
  const sanitized = sanitizeFilename(originalName);
  const nameWithoutExt = path.parse(sanitized).name;
  const extension = path.parse(sanitized).ext;
  
  return `${placementId}_${timestamp}_${nameWithoutExt}_v${version}${extension}`;
};
```

### Cleanup & Maintenance

**Orphaned File Detection**
```typescript
// Future enhancement: Cleanup orphaned files
const findOrphanedFiles = async (): Promise<string[]> => {
  // Get all file URLs from database
  const jobItems = await prisma.jobItem.findMany({
    select: { printSpec: true }
  });
  
  const dbFileUrls = new Set<string>();
  jobItems.forEach(item => {
    const printSpec = item.printSpec as any;
    if (printSpec.placements) {
      printSpec.placements.forEach((placement: any) => {
        if (placement.designFileUrl) {
          dbFileUrls.add(placement.designFileUrl);
        }
      });
    }
  });
  
  // Compare with actual blob storage files
  // Return list of orphaned file URLs
};
```

## Future Enhancements

### Planned Features

**File Versioning**
- Multiple versions per placement
- Version history and rollback
- Approval workflows for design changes

**Advanced File Types**
- AI file support (.ai)
- PSD file support (.psd)
- Video file support for motion graphics

**File Processing**
- Automatic thumbnail generation
- Format conversion capabilities
- Batch processing tools

**Enhanced Security**
- Virus scanning integration
- Digital watermarking
- Access logging and auditing

### Integration Opportunities

**Design Tools Integration**
- Adobe Creative Cloud connector
- Figma plugin support
- Canva integration

**Print Service Integration**
- Direct file transfer to print providers
- Color profile management
- Print-ready file validation

This file management system provides a robust, scalable foundation for handling design files in the 687 Merch Site while maintaining security and performance.