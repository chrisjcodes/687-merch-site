'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CollectionsIcon from '@mui/icons-material/Collections';
import { useRouter } from 'next/navigation';

interface Collection {
  id: string;
  title: string;
}

interface UnassignedCollectionsProps {
  assignedCollectionIds: string[];
}

export default function UnassignedCollections({ assignedCollectionIds }: UnassignedCollectionsProps) {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch('/api/admin/collections');
        if (response.ok) {
          const data = await response.json();
          // Filter out already assigned collections
          const unassigned = data.collections.filter(
            (c: Collection) => !assignedCollectionIds.includes(c.id)
          );
          setCollections(unassigned);
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, [assignedCollectionIds]);

  const handleQuickCreate = async (collection: Collection) => {
    setCreating(collection.id);
    try {
      const response = await fetch('/api/admin/shops/quick-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionId: collection.id,
          collectionTitle: collection.title,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to edit the new shop
        router.push(`/admin/shops/${data.shop.id}`);
      }
    } catch (err) {
      console.error('Error creating shop:', err);
    } finally {
      setCreating(null);
    }
  };

  if (loading) {
    return (
      <Card sx={{ bgcolor: '#1a1a1a', color: '#fff' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </CardContent>
      </Card>
    );
  }

  if (collections.length === 0) {
    return (
      <Card sx={{ bgcolor: '#1a1a1a', color: '#fff' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CollectionsIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Unassigned Collections</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            All Shopify collections have been assigned to shops.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ bgcolor: '#1a1a1a', color: '#fff' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CollectionsIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Unassigned Collections</Typography>
          <Chip
            label={collections.length}
            size="small"
            sx={{ ml: 1, bgcolor: 'primary.main', color: '#000', fontWeight: 600 }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3 }}>
          Create a shop from any of these Shopify collections with one click.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {collections.map((collection) => (
            <Box
              key={collection.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="body1">{collection.title}</Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={creating === collection.id ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
                disabled={creating !== null}
                onClick={() => handleQuickCreate(collection)}
                sx={{
                  bgcolor: 'primary.main',
                  color: '#000',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#f2d633' },
                }}
              >
                {creating === collection.id ? 'Creating...' : 'Create Shop'}
              </Button>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
