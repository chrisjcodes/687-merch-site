'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  CircularProgress,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BlockIcon from '@mui/icons-material/Block';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const shopSchema = z.object({
  name: z.string().min(1, 'Shop name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  themeMode: z.enum(['light', 'dark']),
  shopifyCollectionId: z.string().min(1, 'Collection is required'),
  isLive: z.boolean(),
  activationMode: z.enum(['manual', 'scheduled']),
  activeUntil: z.string().nullable().optional(),
  logoUrl: z.string().optional(),
});

type ShopFormData = z.infer<typeof shopSchema>;

interface ShopFormProps {
  initialData?: ShopFormData & { id: string };
  isEdit?: boolean;
}

export default function ShopForm({ initialData, isEdit = false }: ShopFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [collections, setCollections] = useState<Array<{ id: string; title: string }>>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logoUrl || null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ShopFormData>({
    resolver: zodResolver(shopSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      themeColor: '#f2bf00',
      themeMode: 'light' as const,
      shopifyCollectionId: '',
      isLive: false,
      activationMode: 'manual' as const,
      activeUntil: null,
      logoUrl: '',
    },
  });

  const shopName = watch('name');
  const isActive = watch('isLive');
  const activationMode = watch('activationMode');
  const activeUntil = watch('activeUntil');

  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleRegenerateSlug = () => {
    if (shopName) {
      setValue('slug', generateSlugFromName(shopName));
    }
  };

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEdit && shopName) {
      setValue('slug', generateSlugFromName(shopName));
    }
  }, [shopName, isEdit, setValue]);

  // Fetch Shopify collections
  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch('/api/admin/collections');
        if (response.ok) {
          const data = await response.json();
          setCollections(data.collections);
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
      } finally {
        setLoadingCollections(false);
      }
    }
    fetchCollections();
  }, []);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setValue('logoUrl', data.url);
        setLogoPreview(data.url);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to upload logo');
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('An error occurred while uploading');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setValue('logoUrl', '');
    setLogoPreview(null);
  };

  const onSubmit = async (data: ShopFormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const url = isEdit ? `/api/admin/shops/${initialData?.id}` : '/api/admin/shops';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/shops');
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save shop');
      }
    } catch (err) {
      console.error('Error saving shop:', err);
      setError('An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  const textFieldSx = {
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.9)',
      '&.Mui-disabled': {
        color: 'rgba(255, 255, 255, 0.6)',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
    '& .MuiFormHelperText-root': {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '0.8rem',
      mt: 1,
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
      '&.Mui-disabled': {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
      },
    },
    '& .MuiOutlinedInput-input': {
      color: '#fff',
    },
    '& .MuiOutlinedInput-input.Mui-disabled': {
      color: 'rgba(255, 255, 255, 0.6)',
      WebkitTextFillColor: 'rgba(255, 255, 255, 0.6)',
    },
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        p: 4,
        bgcolor: '#1a1a1a',
        color: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Activation Options */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: isActive
              ? (activationMode === 'scheduled' ? 'rgba(255, 152, 0, 0.15)' : 'rgba(76, 175, 80, 0.15)')
              : 'rgba(255, 255, 255, 0.05)',
            border: isActive
              ? (activationMode === 'scheduled' ? '2px solid #ff9800' : '2px solid #4caf50')
              : '2px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.2s ease',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: isActive ? 2 : 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {!isActive ? (
                <BlockIcon sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 28 }} />
              ) : activationMode === 'scheduled' ? (
                <ScheduleIcon sx={{ color: '#ff9800', fontSize: 28 }} />
              ) : (
                <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 28 }} />
              )}
              <Box>
                <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                  {!isActive
                    ? 'Shop is Inactive'
                    : activationMode === 'scheduled'
                      ? 'Active Until Date'
                      : 'Shop is Active'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {!isActive
                    ? 'Shop is hidden from customers'
                    : activationMode === 'scheduled' && activeUntil
                      ? `Will deactivate on ${new Date(activeUntil).toLocaleDateString()}`
                      : 'Customers can access this shop'}
                </Typography>
              </Box>
            </Box>
            <Controller
              name="isLive"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                    if (!e.target.checked) {
                      setValue('activationMode', 'manual');
                      setValue('activeUntil', null);
                    }
                  }}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: activationMode === 'scheduled' ? '#ff9800' : '#4caf50',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: activationMode === 'scheduled' ? '#ff9800' : '#4caf50',
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    transform: 'scale(1.2)',
                  }}
                />
              )}
            />
          </Box>

          {/* Show activation mode options when active */}
          {isActive && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <Controller
                name="activationMode"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    value={field.value}
                    exclusive
                    onChange={(_, value) => {
                      if (value) {
                        field.onChange(value);
                        if (value === 'manual') {
                          setValue('activeUntil', null);
                        }
                      }
                    }}
                    size="small"
                    sx={{
                      '& .MuiToggleButton-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        px: 2,
                        '&.Mui-selected': {
                          bgcolor: field.value === 'scheduled' ? '#ff9800' : '#4caf50',
                          color: '#000',
                          '&:hover': {
                            bgcolor: field.value === 'scheduled' ? '#f57c00' : '#388e3c',
                          },
                        },
                      },
                    }}
                  >
                    <ToggleButton value="manual">
                      <CheckCircleIcon sx={{ mr: 0.5, fontSize: 18 }} />
                      Always Active
                    </ToggleButton>
                    <ToggleButton value="scheduled">
                      <ScheduleIcon sx={{ mr: 0.5, fontSize: 18 }} />
                      Active Until
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />

              {activationMode === 'scheduled' && (
                <TextField
                  {...register('activeUntil')}
                  type="date"
                  size="small"
                  label="Deactivation Date"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0],
                  }}
                  sx={{
                    minWidth: 180,
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.9)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#ff9800' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#ff9800' },
                    },
                    '& .MuiOutlinedInput-input': { color: '#fff' },
                    '& input::-webkit-calendar-picker-indicator': {
                      filter: 'invert(1)',
                    },
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Shop Configuration Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              mb: 3,
              pb: 1.5,
              borderBottom: '2px solid rgba(242, 191, 0, 0.5)',
              fontWeight: 600,
            }}
          >
            Shop Configuration
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              {...register('name')}
              label="Shop Name"
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={textFieldSx}
            />

            <TextField
              {...register('slug')}
              label="URL Slug"
              fullWidth
              required
              error={!!errors.slug}
              helperText={errors.slug?.message || 'This will be used in the URL: /shop/{slug}'}
              sx={textFieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Regenerate slug from name">
                      <IconButton
                        onClick={handleRegenerateSlug}
                        edge="end"
                        size="small"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth error={!!errors.shopifyCollectionId}>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>Shopify Collection</InputLabel>
              <Controller
                name="shopifyCollectionId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Shopify Collection"
                    disabled={loadingCollections}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                      '& .MuiSelect-select': {
                        color: '#fff',
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: '#2a2a2a',
                          '& .MuiMenuItem-root': {
                            color: '#fff',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&.Mui-selected': {
                              bgcolor: 'rgba(242, 191, 0, 0.2)',
                              '&:hover': {
                                bgcolor: 'rgba(242, 191, 0, 0.3)',
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    {loadingCollections ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} /> Loading collections...
                      </MenuItem>
                    ) : collections.length === 0 ? (
                      <MenuItem disabled>No collections found</MenuItem>
                    ) : (
                      collections.map((collection) => (
                        <MenuItem key={collection.id} value={collection.id}>
                          {collection.title}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                )}
              />
              {errors.shopifyCollectionId && (
                <Typography variant="caption" sx={{ color: '#f44336', mt: 0.5, ml: 1.75 }}>
                  {errors.shopifyCollectionId.message}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Box>

        {/* Theme & Appearance Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              mb: 3,
              pb: 1.5,
              borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
              fontWeight: 600,
            }}
          >
            Theme & Appearance (Optional)
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <FormControl>
              <FormLabel sx={{ color: '#fff', mb: 1.5 }}>Theme Mode</FormLabel>
              <Controller
                name="themeMode"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    value={field.value}
                    exclusive
                    onChange={(_, value) => value && field.onChange(value)}
                    sx={{
                      '& .MuiToggleButton-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        px: 3,
                        py: 1.5,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: '#000',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        },
                      },
                    }}
                  >
                    <ToggleButton value="light">
                      <LightModeIcon sx={{ mr: 1 }} />
                      Light
                    </ToggleButton>
                    <ToggleButton value="dark">
                      <DarkModeIcon sx={{ mr: 1 }} />
                      Dark
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ color: '#fff', mb: 1.5 }}>Accent Color</FormLabel>
              <Box
                component="input"
                type="color"
                {...register('themeColor')}
                sx={{
                  width: 52,
                  height: 52,
                  padding: 0,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: 'transparent',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ color: '#fff', mb: 1.5 }}>Logo</FormLabel>
              <input type="hidden" {...register('logoUrl')} />

              {logoPreview ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 52,
                      bgcolor: '#fff',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      fill
                      style={{ objectFit: 'contain', padding: 6 }}
                    />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={handleRemoveLogo}
                    sx={{
                      color: '#f44336',
                      '&:hover': {
                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  startIcon={isUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                  disabled={isUploading}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    height: 52,
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                  />
                </Button>
              )}
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/admin/shops')}
            disabled={isSubmitting}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#fff',
              '&:hover': {
                borderColor: '#fff',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              bgcolor: 'primary.main',
              color: '#000',
              fontWeight: 700,
              '&:hover': {
                bgcolor: '#f2d633',
              },
            }}
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Shop' : 'Create Shop'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
