'use client';

import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';

interface Mockup {
  id: string;
  name: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  sortOrder: number;
  createdAt: string;
}

interface MockupUploadProps {
  jobItemId: string;
  onMockupsChange?: () => void;
}

export function MockupUpload({ jobItemId, onMockupsChange }: MockupUploadProps) {
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mockupName, setMockupName] = useState('');
  const [mockupDescription, setMockupDescription] = useState('');
  const [editingMockup, setEditingMockup] = useState<Mockup | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMockups();
  }, [jobItemId]);

  const fetchMockups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/job-items/${jobItemId}/mockups`);
      if (response.ok) {
        const data = await response.json();
        setMockups(data.mockups || []);
      } else {
        setError('Failed to load mockups');
      }
    } catch (error) {
      console.error('Failed to fetch mockups:', error);
      setError('Failed to load mockups');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!mockupName) {
        // Auto-suggest name from filename
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setMockupName(nameWithoutExt);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !mockupName.trim()) {
      setError('Please select a file and enter a name');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', mockupName.trim());
      formData.append('description', mockupDescription.trim());
      formData.append('sortOrder', (mockups.length).toString());

      const response = await fetch(`/api/admin/job-items/${jobItemId}/mockups`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      setSuccess('Mockup uploaded successfully!');
      resetForm();
      setUploadDialogOpen(false);
      await fetchMockups();
      onMockupsChange?.();
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (mockup: Mockup) => {
    setEditingMockup(mockup);
    setMockupName(mockup.name);
    setMockupDescription(mockup.description || '');
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingMockup || !mockupName.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const response = await fetch(`/api/admin/mockups/${editingMockup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: mockupName.trim(),
          description: mockupDescription.trim(),
          sortOrder: editingMockup.sortOrder,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }

      setSuccess('Mockup updated successfully!');
      setEditDialogOpen(false);
      setEditingMockup(null);
      resetForm();
      await fetchMockups();
      onMockupsChange?.();
    } catch (error) {
      console.error('Update failed:', error);
      setError(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (mockup: Mockup) => {
    if (!confirm(`Are you sure you want to delete "${mockup.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/mockups/${mockup.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      setSuccess('Mockup deleted successfully!');
      await fetchMockups();
      onMockupsChange?.();
    } catch (error) {
      console.error('Delete failed:', error);
      setError(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setMockupName('');
    setMockupDescription('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Mockups ({mockups.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Upload Mockup
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {mockups.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            bgcolor: 'grey.50',
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No mockups uploaded yet
          </Typography>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload First Mockup
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {mockups.map((mockup) => (
            <Grid item xs={12} sm={6} md={4} key={mockup.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={mockup.fileUrl}
                  alt={mockup.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {mockup.name}
                  </Typography>
                  {mockup.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {mockup.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={formatFileSize(mockup.fileSize)}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={mockup.mimeType.split('/')[1].toUpperCase()}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton size="small" onClick={() => handleEdit(mockup)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(mockup)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Mockup</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              fullWidth
              sx={{ mb: 2 }}
            >
              {selectedFile ? `Selected: ${selectedFile.name}` : 'Select Image File'}
            </Button>
            
            <TextField
              label="Mockup Name"
              value={mockupName}
              onChange={(e) => setMockupName(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Description (Optional)"
              value={mockupDescription}
              onChange={(e) => setMockupDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setUploadDialogOpen(false); resetForm(); }}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            variant="contained" 
            disabled={uploading || !selectedFile || !mockupName.trim()}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Mockup</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              label="Mockup Name"
              value={mockupName}
              onChange={(e) => setMockupName(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Description (Optional)"
              value={mockupDescription}
              onChange={(e) => setMockupDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditDialogOpen(false); setEditingMockup(null); resetForm(); }}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            variant="contained" 
            disabled={uploading || !mockupName.trim()}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}