'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Step,
  Stepper,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { DecorationTypeSelector } from '@/components/decoration-forms/DecorationTypeSelector';
import { ScreenPrintTransferForm } from '@/components/decoration-forms/ScreenPrintTransferForm';
import { PatchForm } from '@/components/decoration-forms/PatchForm';
import { DirectEmbroideryForm } from '@/components/decoration-forms/DirectEmbroideryForm';
import { HeatTransferVinylForm } from '@/components/decoration-forms/HeatTransferVinylForm';
import { DecorationTypeStrategy, getDecorationStrategy, getAvailableStrategies } from '@/lib/decoration-strategies';

interface DecorationVendor {
  id: string;
  name: string;
  displayName: string;
}

interface StrategyBasedDecorationDialogProps {
  open: boolean;
  decorationProduct?: any;
  onClose: () => void;
  onSave: () => void;
}

const steps = ['Select Type', 'Choose Vendor', 'Configure Product'];

export function StrategyBasedDecorationDialog({
  open,
  decorationProduct,
  onClose,
  onSave,
}: StrategyBasedDecorationDialogProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<DecorationTypeStrategy | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [vendors, setVendors] = useState<DecorationVendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(decorationProduct);

  // Function to determine strategy from existing product data
  const determineStrategyFromProduct = (product: any): DecorationTypeStrategy | null => {
    if (!product) return null;
    
    // Check category name or other identifying properties
    const categoryName = product.category?.name?.toLowerCase() || '';
    const productName = product.name?.toLowerCase() || '';
    
    // Map category/product names to strategy IDs
    if (categoryName.includes('screen') && categoryName.includes('transfer')) {
      return getDecorationStrategy('screen_print_transfers');
    }
    if (categoryName.includes('hybrid') && categoryName.includes('transfer')) {
      return getDecorationStrategy('hybrid_transfers');
    }
    if (categoryName.includes('leather') && categoryName.includes('patch')) {
      return getDecorationStrategy('leather_patches');
    }
    if (categoryName.includes('embroidered') && categoryName.includes('patch')) {
      return getDecorationStrategy('3d_embroidered_patches');
    }
    if (categoryName.includes('direct') && categoryName.includes('embroidery')) {
      return getDecorationStrategy('direct_embroidery');
    }
    if (categoryName.includes('heat') && categoryName.includes('transfer') && categoryName.includes('vinyl')) {
      return getDecorationStrategy('heat_transfer_vinyl');
    }
    if (categoryName.includes('htv')) {
      return getDecorationStrategy('heat_transfer_vinyl');
    }
    if (categoryName.includes('embroidery') && !categoryName.includes('patch')) {
      return getDecorationStrategy('direct_embroidery');
    }
    
    // Fallback: try to match by product name patterns
    if (productName.includes('screen') || productName.includes('transfer')) {
      return getDecorationStrategy('screen_print_transfers');
    }
    if (productName.includes('patch')) {
      return getDecorationStrategy('leather_patches');
    }
    if (productName.includes('embroidery')) {
      return getDecorationStrategy('direct_embroidery');
    }
    if (productName.includes('vinyl') || productName.includes('htv')) {
      return getDecorationStrategy('heat_transfer_vinyl');
    }
    
    // Default fallback - return first available strategy
    const strategies = getAvailableStrategies();
    return strategies.length > 0 ? strategies[0] : null;
  };

  useEffect(() => {
    if (open) {
      fetchVendors();
      
      if (decorationProduct) {
        // For editing, determine strategy and skip to configuration step
        const strategy = determineStrategyFromProduct(decorationProduct);
        setSelectedStrategy(strategy);
        setActiveStep(2);
        setSelectedVendor(decorationProduct.vendor?.id || decorationProduct.vendorId);
        setError('');
      } else {
        // Reset for new product
        setActiveStep(0);
        setSelectedStrategy(null);
        setSelectedVendor('');
        setError('');
      }
    }
  }, [open, decorationProduct]);

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/admin/decoration-vendors');
      if (response.ok) {
        const data = await response.json();
        setVendors(data.vendors || []);
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedStrategy) {
      setError('Please select a decoration type');
      return;
    }
    if (activeStep === 1 && !selectedVendor) {
      setError('Please select a vendor');
      return;
    }
    
    setError('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleSelectStrategy = (strategy: DecorationTypeStrategy) => {
    setSelectedStrategy(strategy);
    setError('');
  };

  const handleSaveProduct = async (productData: any) => {
    setLoading(true);
    setError('');

    try {
      const url = isEditing 
        ? `/api/admin/decoration-products/${decorationProduct.id}`
        : '/api/admin/decoration-products';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productData,
          strategyId: selectedStrategy?.id, // For reference
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save decoration product');
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving decoration product:', error);
      setError(error instanceof Error ? error.message : 'Failed to save decoration product');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <DecorationTypeSelector
            onSelectType={handleSelectStrategy}
            selectedTypeId={selectedStrategy?.id}
          />
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Choose Vendor for {selectedStrategy?.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the vendor that provides this decoration service
            </Typography>

            <FormControl fullWidth>
              <InputLabel>Vendor</InputLabel>
              <Select
                value={selectedVendor}
                label="Vendor"
                onChange={(e) => setSelectedVendor(e.target.value)}
              >
                {vendors.map((vendor) => (
                  <MenuItem key={vendor.id} value={vendor.id}>
                    {vendor.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedVendor && (
              <Alert severity="info" sx={{ mt: 2 }}>
                You'll configure pricing and specifications for{' '}
                <strong>{vendors.find(v => v.id === selectedVendor)?.displayName}</strong>'s{' '}
                <strong>{selectedStrategy?.displayName}</strong> service in the next step.
              </Alert>
            )}
          </Box>
        );

      case 2:
        if (!selectedStrategy || !selectedVendor) {
          return (
            <Alert severity="error">
              Missing strategy or vendor selection. Please go back and complete the previous steps.
            </Alert>
          );
        }

        return renderConfigurationForm();

      default:
        return null;
    }
  };

  const renderConfigurationForm = () => {
    if (!selectedStrategy) return null;

    const commonProps = {
      initialData: decorationProduct,
      vendorId: selectedVendor,
      onSave: handleSaveProduct,
      isEditing,
    };

    switch (selectedStrategy.id) {
      case 'screen_print_transfers':
        return <ScreenPrintTransferForm {...commonProps} />;
      
      case 'hybrid_transfers':
        return <ScreenPrintTransferForm {...commonProps} />;
      
      case 'leather_patches':
        return <PatchForm {...commonProps} strategyId="leather_patches" />;
      
      case '3d_embroidered_patches':
        return <PatchForm {...commonProps} strategyId="3d_embroidered_patches" />;
      
      case 'direct_embroidery':
        return <DirectEmbroideryForm {...commonProps} />;
      
      case 'heat_transfer_vinyl':
        return <HeatTransferVinylForm {...commonProps} />;
      
      default:
        return (
          <Alert severity="warning">
            Configuration form for {selectedStrategy.displayName} is not yet implemented.
            This would be a specialized form for this decoration type.
          </Alert>
        );
    }
  };

  const getDialogTitle = () => {
    if (isEditing) {
      return `Edit ${decorationProduct?.displayName || 'Decoration Product'}`;
    }
    
    if (activeStep === 0) return 'Create Decoration Product - Select Type';
    if (activeStep === 1) return `Create ${selectedStrategy?.displayName} - Choose Vendor`;
    if (activeStep === 2) return `Configure ${selectedStrategy?.displayName}`;
    
    return 'Create Decoration Product';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle>
        <Box>
          <Typography variant="h6">{getDialogTitle()}</Typography>
          {!isEditing && (
            <Box sx={{ mt: 2 }}>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {renderStepContent(isEditing ? 2 : activeStep)}
        </Box>
      </DialogContent>

      {!isEditing && activeStep < 2 && (
        <DialogActions>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleBack} disabled={activeStep === 0}>
            Back
          </Button>
          <Button onClick={handleNext} variant="contained">
            {activeStep === steps.length - 1 ? 'Configure' : 'Next'}
          </Button>
        </DialogActions>
      )}

      {(isEditing || activeStep === 2) && (
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          {activeStep > 0 && !isEditing && (
            <Button onClick={handleBack} disabled={loading}>
              Back
            </Button>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ flex: 1, px: 2 }}>
            The specialized form will handle saving
          </Typography>
        </DialogActions>
      )}
    </Dialog>
  );
}