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
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const dropShopSchema = z.object({
  name: z.string().min(1, 'Shop name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  shopifyCollectionId: z.string().min(1, 'Collection is required'),
  isLive: z.boolean(),
  logoUrl: z.string().optional(),
});

type DropShopFormData = z.infer<typeof dropShopSchema>;

interface DropShopFormProps {
  initialData?: DropShopFormData & { id: string };
  isEdit?: boolean;
}

export default function DropShopForm({ initialData, isEdit = false }: DropShopFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [collections, setCollections] = useState<Array<{ id: string; title: string }>>([]);
  const [loadingCollections, setLoadingCollections] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DropShopFormData>({
    resolver: zodResolver(dropShopSchema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      themeColor: '#f2bf00',
      shopifyCollectionId: '',
      isLive: false,
      logoUrl: '',
    },
  });

  const shopName = watch('name');

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEdit && shopName) {
      const slug = shopName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
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

  const onSubmit = async (data: DropShopFormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const url = isEdit ? `/api/admin/drop-shops/${initialData?.id}` : '/api/admin/drop-shops';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/drop-shops');
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
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
          helperText={errors.slug?.message || 'This will be used in the URL: /drop/{slug}'}
          disabled={isEdit}
          sx={textFieldSx}
        />

        <TextField
          {...register('themeColor')}
          label="Theme Color"
          type="color"
          fullWidth
          required
          error={!!errors.themeColor}
          helperText={errors.themeColor?.message || 'Primary color for buttons, links, etc.'}
          sx={textFieldSx}
        />

        <FormControl fullWidth error={!!errors.shopifyCollectionId}>
          <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Shopify Collection</InputLabel>
          <Controller
            name="shopifyCollectionId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Shopify Collection"
                disabled={loadingCollections}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
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
            <Typography variant="caption" sx={{ color: '#f44336', mt: 0.5 }}>
              {errors.shopifyCollectionId.message}
            </Typography>
          )}
        </FormControl>

        <FormControl>
          <FormLabel sx={{ color: '#fff', mb: 1 }}>Logo (Optional)</FormLabel>
          <TextField
            {...register('logoUrl')}
            placeholder="Upload logo (coming soon)"
            fullWidth
            disabled
            sx={textFieldSx}
          />
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 0.5 }}>
            Logo upload will be available soon
          </Typography>
        </FormControl>

        <FormControlLabel
          control={
            <Controller
              name="isLive"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              )}
            />
          }
          label={<Typography sx={{ color: '#fff' }}>Shop is Live</Typography>}
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/admin/drop-shops')}
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
