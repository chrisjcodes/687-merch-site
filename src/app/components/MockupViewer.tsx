'use client';

import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  ZoomIn as ZoomIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

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

interface MockupViewerProps {
  jobItemId: string;
  title?: string;
  showTitle?: boolean;
}

export function MockupViewer({ jobItemId, title = 'Mockups', showTitle = true }: MockupViewerProps) {
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMockup, setSelectedMockup] = useState<Mockup | null>(null);

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
      } else if (response.status === 403) {
        setError('Access denied');
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

  if (error) {
    return null; // Silently fail for access denied or other errors
  }

  if (mockups.length === 0) {
    return null; // Don't show anything if no mockups
  }

  return (
    <Box>
      {showTitle && (
        <Typography variant="h6" sx={{ mb: 3 }}>
          {title} ({mockups.length})
        </Typography>
      )}

      <Grid container spacing={2}>
        {mockups.map((mockup) => (
          <Grid item xs={12} sm={6} md={4} key={mockup.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
              onClick={() => setSelectedMockup(mockup)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={mockup.fileUrl}
                  alt={mockup.name}
                  sx={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    borderRadius: 1,
                    p: 0.5,
                  }}
                >
                  <ZoomIcon fontSize="small" />
                </Box>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" noWrap>
                  {mockup.name}
                </Typography>
                {mockup.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
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
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Fullscreen Image Dialog */}
      <Dialog 
        open={!!selectedMockup} 
        onClose={() => setSelectedMockup(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'black',
            color: 'white',
          }
        }}
      >
        {selectedMockup && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              bgcolor: 'rgba(0,0,0,0.8)',
            }}>
              <Box>
                <Typography variant="h6">{selectedMockup.name}</Typography>
                {selectedMockup.description && (
                  <Typography variant="body2" color="grey.300">
                    {selectedMockup.description}
                  </Typography>
                )}
              </Box>
              <IconButton 
                onClick={() => setSelectedMockup(null)}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0, bgcolor: 'black' }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: '60vh',
                }}
              >
                <img
                  src={selectedMockup.fileUrl}
                  alt={selectedMockup.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}