'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import { Calculate as CalculateIcon } from '@mui/icons-material';
import { useState } from 'react';
import { PricingRequest, PricingResult } from '@/lib/pricing-calculator';

interface PricingCalculatorProps {
  decorationProductId: string;
  decorationProductName: string;
  hasColorPricing?: boolean;
  hasArtworkPricing?: boolean;
  hasSizePricing?: boolean;
  minimumQuantity?: number;
}

export function PricingCalculator({
  decorationProductId,
  decorationProductName,
  hasColorPricing = false,
  hasArtworkPricing = false,
  hasSizePricing = false,
  minimumQuantity = 1
}: PricingCalculatorProps) {
  const [formData, setFormData] = useState({
    quantity: minimumQuantity,
    width: '',
    height: '',
    colorCount: 1,
    artworkType: 'VECTOR' as 'EASY_PRINTS' | 'VECTOR' | 'NON_VECTOR',
    rushService: false
  });

  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleCalculate = async () => {
    setLoading(true);
    setError('');

    try {
      const request: PricingRequest = {
        decorationProductId,
        quantity: formData.quantity,
        ...(hasSizePricing && formData.width && formData.height && {
          width: parseFloat(formData.width),
          height: parseFloat(formData.height)
        }),
        ...(hasColorPricing && { colorCount: formData.colorCount }),
        ...(hasArtworkPricing && { artworkType: formData.artworkType }),
        rushService: formData.rushService
      };

      const response = await fetch('/api/admin/decoration-pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate pricing');
      }

      const result: PricingResult = await response.json();
      setPricingResult(result);
    } catch (error) {
      console.error('Error calculating pricing:', error);
      setError(error instanceof Error ? error.message : 'Failed to calculate pricing');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear previous results when inputs change
    if (pricingResult) {
      setPricingResult(null);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalculateIcon />
          Pricing Calculator - {decorationProductName}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <TextField
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || minimumQuantity)}
            inputProps={{ min: minimumQuantity }}
            helperText={`Minimum quantity: ${minimumQuantity}`}
            required
          />

          {hasSizePricing && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Width (inches)"
                type="number"
                value={formData.width}
                onChange={(e) => handleInputChange('width', e.target.value)}
                inputProps={{ min: 0, step: 0.1 }}
              />
              <TextField
                label="Height (inches)"
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Box>
          )}

          {hasColorPricing && (
            <TextField
              label="Number of Colors"
              type="number"
              value={formData.colorCount}
              onChange={(e) => handleInputChange('colorCount', parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, max: 10 }}
            />
          )}

          {hasArtworkPricing && (
            <FormControl>
              <InputLabel>Artwork Type</InputLabel>
              <Select
                value={formData.artworkType}
                label="Artwork Type"
                onChange={(e) => handleInputChange('artworkType', e.target.value)}
              >
                <MenuItem value="EASY_PRINTS">Easy Prints (Vendor Layouts)</MenuItem>
                <MenuItem value="VECTOR">Vector Artwork</MenuItem>
                <MenuItem value="NON_VECTOR">Non-Vector Artwork</MenuItem>
              </Select>
            </FormControl>
          )}

          <Button
            variant="contained"
            onClick={handleCalculate}
            disabled={loading || formData.quantity < minimumQuantity}
            startIcon={loading ? <CircularProgress size={20} /> : <CalculateIcon />}
            sx={{ alignSelf: 'flex-start' }}
          >
            {loading ? 'Calculating...' : 'Calculate Pricing'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {pricingResult && (
          <Box>
            <Divider sx={{ mb: 2 }} />
            
            {pricingResult.errors && pricingResult.errors.length > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {pricingResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Pricing Breakdown</Typography>
              <Chip
                label={`Total: ${formatPrice(pricingResult.totalPrice)}`}
                color="primary"
                size="large"
                sx={{ fontWeight: 'bold', fontSize: '1rem' }}
              />
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableBody>
                  {pricingResult.breakdown.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: item.type === 'UNIT_COST' ? 'bold' : 'normal' }}>
                        {formatPrice(item.totalPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ backgroundColor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(pricingResult.totalPrice)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {pricingResult.appliedPricing && (
              <Box sx={{ mt: 2, p: 1, backgroundColor: 'action.selected', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Applied pricing: {pricingResult.appliedPricing.minQuantity}
                  {pricingResult.appliedPricing.maxQuantity ? `-${pricingResult.appliedPricing.maxQuantity}` : '+'} units
                  {pricingResult.appliedPricing.sizeRange && `, ${pricingResult.appliedPricing.sizeRange}`}
                  {pricingResult.appliedPricing.colorCount && `, ${pricingResult.appliedPricing.colorCount} colors`}
                  {pricingResult.appliedPricing.artworkType && `, ${pricingResult.appliedPricing.artworkType.toLowerCase()}`}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Unit Price: ${formatPrice(pricingResult.unitPrice)}`}
                variant="outlined" 
                size="small"
              />
              <Chip 
                label={`Per Unit Total: ${formatPrice(pricingResult.totalUnitCost)}`}
                variant="outlined" 
                size="small"
              />
              {pricingResult.setupFee > 0 && (
                <Chip 
                  label={`Setup: ${formatPrice(pricingResult.setupFee)}`}
                  variant="outlined" 
                  size="small"
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}