'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import {
  Print as PrintIcon,
  LocalOffer as PatchIcon,
  Brush as EmbroideryIcon,
  Style as VinylIcon,
} from '@mui/icons-material';
import { getAvailableStrategies, DecorationTypeStrategy } from '@/lib/decoration-strategies';

interface DecorationTypeSelectorProps {
  onSelectType: (strategy: DecorationTypeStrategy) => void;
  selectedTypeId?: string;
}

const STRATEGY_ICONS: Record<string, React.ReactElement> = {
  screen_print_transfers: <PrintIcon />,
  hybrid_transfers: <PrintIcon />,
  leather_patches: <PatchIcon />,
  '3d_embroidered_patches': <EmbroideryIcon />,
  direct_embroidery: <EmbroideryIcon />,
  heat_transfer_vinyl: <VinylIcon />,
};

const STRATEGY_COLORS: Record<string, 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
  screen_print_transfers: 'primary',
  hybrid_transfers: 'info',
  leather_patches: 'warning',
  '3d_embroidered_patches': 'secondary',
  direct_embroidery: 'secondary',
  heat_transfer_vinyl: 'success',
};

export function DecorationTypeSelector({ onSelectType, selectedTypeId }: DecorationTypeSelectorProps) {
  const strategies = getAvailableStrategies();

  const getPricingModelLabel = (model: string) => {
    switch (model) {
      case 'QUANTITY_BREAKS': return 'Quantity Breaks';
      case 'SIZE_QUANTITY': return 'Size + Quantity';
      case 'COLOR_QUANTITY': return 'Color + Quantity';
      case 'STITCH_COUNT': return 'Stitch Count';
      default: return model;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Decoration Type
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose the type of decoration product to create a tailored configuration form
      </Typography>

      <Grid container spacing={2}>
        {strategies.map((strategy) => (
          <Grid item xs={12} sm={6} md={4} key={strategy.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: selectedTypeId === strategy.id ? 2 : 1,
                borderColor: selectedTypeId === strategy.id ? 'primary.main' : 'divider',
                '&:hover': {
                  boxShadow: 2,
                  transform: 'translateY(-2px)',
                }
              }}
              onClick={() => onSelectType(strategy)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    color: `${STRATEGY_COLORS[strategy.id] || 'primary'}.main`,
                    mr: 1 
                  }}>
                    {STRATEGY_ICONS[strategy.id] || <PrintIcon />}
                  </Box>
                  <Typography variant="h6" component="h3">
                    {strategy.displayName}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {strategy.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  <Chip 
                    label={getPricingModelLabel(strategy.pricingModel)}
                    size="small" 
                    color={STRATEGY_COLORS[strategy.id] || 'primary'}
                    variant="outlined"
                  />
                  {strategy.hasColorPricing && (
                    <Chip label="Color Pricing" size="small" variant="outlined" />
                  )}
                  {strategy.hasArtworkPricing && (
                    <Chip label="Artwork Types" size="small" variant="outlined" />
                  )}
                  {strategy.hasSizePricing && (
                    <Chip label="Size Based" size="small" variant="outlined" />
                  )}
                  {strategy.hasVariantPricing && (
                    <Chip label="Variants" size="small" variant="outlined" />
                  )}
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Min Qty: {strategy.defaultFields.minimumQuantity} • 
                  {strategy.quantityBreaks.length} Quantity Breaks
                  {strategy.sizeRanges && ` • ${strategy.sizeRanges.length} Size Options`}
                </Typography>

                {selectedTypeId === strategy.id && (
                  <Button 
                    variant="contained" 
                    size="small" 
                    fullWidth 
                    sx={{ mt: 2 }}
                    color={STRATEGY_COLORS[strategy.id] || 'primary'}
                  >
                    Selected
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}