'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Typography,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';

interface DecorationMethod {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  defaultMinWidth?: number;
  defaultMaxWidth?: number;
  defaultMinHeight?: number;
  defaultMaxHeight?: number;
  colorOptions: string[];
  hasColorLimitations: boolean;
  maxColors?: number;
  baseSetupCost?: number;
  perColorCost?: number;
  perUnitCost?: number;
  estimatedTurnaround?: number;
}

interface DecorationMethodFormDialogProps {
  open: boolean;
  decorationMethod?: DecorationMethod | null;
  onClose: () => void;
  onSave: () => void;
}

const commonColors = [
  'White', 'Black', 'Navy', 'Royal Blue', 'Red', 'Green', 'Yellow', 'Orange',
  'Purple', 'Pink', 'Grey', 'Brown', 'Maroon', 'Forest Green', 'Light Blue',
  'Gold', 'Silver', 'Lime Green', 'Hot Pink', 'Teal'
];

export function DecorationMethodFormDialog({ open, decorationMethod, onClose, onSave }: DecorationMethodFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    isActive: true,
    defaultMinWidth: '',
    defaultMaxWidth: '',
    defaultMinHeight: '',
    defaultMaxHeight: '',
    colorOptions: [] as string[],
    hasColorLimitations: false,
    maxColors: '',
    baseSetupCost: '',
    perColorCost: '',
    perUnitCost: '',
    estimatedTurnaround: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!decorationMethod;

  useEffect(() => {
    if (decorationMethod) {
      setFormData({
        name: decorationMethod.name,
        displayName: decorationMethod.displayName,
        description: decorationMethod.description || '',
        isActive: decorationMethod.isActive,
        defaultMinWidth: decorationMethod.defaultMinWidth?.toString() || '',
        defaultMaxWidth: decorationMethod.defaultMaxWidth?.toString() || '',
        defaultMinHeight: decorationMethod.defaultMinHeight?.toString() || '',
        defaultMaxHeight: decorationMethod.defaultMaxHeight?.toString() || '',
        colorOptions: decorationMethod.colorOptions || [],
        hasColorLimitations: decorationMethod.hasColorLimitations,
        maxColors: decorationMethod.maxColors?.toString() || '',
        baseSetupCost: decorationMethod.baseSetupCost?.toString() || '',
        perColorCost: decorationMethod.perColorCost?.toString() || '',
        perUnitCost: decorationMethod.perUnitCost?.toString() || '',
        estimatedTurnaround: decorationMethod.estimatedTurnaround?.toString() || '',
      });
    } else {
      setFormData({
        name: '',
        displayName: '',
        description: '',
        isActive: true,
        defaultMinWidth: '',
        defaultMaxWidth: '',
        defaultMinHeight: '',
        defaultMaxHeight: '',
        colorOptions: [],
        hasColorLimitations: false,
        maxColors: '',
        baseSetupCost: '',
        perColorCost: '',
        perUnitCost: '',
        estimatedTurnaround: '',
      });
    }
    setError('');
  }, [decorationMethod, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.displayName) {
      setError('Name and display name are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = isEdit ? `/api/admin/decoration-methods/${decorationMethod.id}` : '/api/admin/decoration-methods';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        name: formData.name,
        displayName: formData.displayName,
        description: formData.description || null,
        isActive: formData.isActive,
        defaultMinWidth: formData.defaultMinWidth ? Number(formData.defaultMinWidth) : null,
        defaultMaxWidth: formData.defaultMaxWidth ? Number(formData.defaultMaxWidth) : null,
        defaultMinHeight: formData.defaultMinHeight ? Number(formData.defaultMinHeight) : null,
        defaultMaxHeight: formData.defaultMaxHeight ? Number(formData.defaultMaxHeight) : null,
        colorOptions: formData.colorOptions,
        hasColorLimitations: formData.hasColorLimitations,
        maxColors: formData.maxColors ? Number(formData.maxColors) : null,
        baseSetupCost: formData.baseSetupCost ? Number(formData.baseSetupCost) : null,
        perColorCost: formData.perColorCost ? Number(formData.perColorCost) : null,
        perUnitCost: formData.perUnitCost ? Number(formData.perUnitCost) : null,
        estimatedTurnaround: formData.estimatedTurnaround ? Number(formData.estimatedTurnaround) : null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEdit ? 'update' : 'create'} decoration method`);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} decoration method:`, error);
      setError(error instanceof Error ? error.message : `Failed to ${isEdit ? 'update' : 'create'} decoration method`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEdit ? 'Edit Decoration Method' : 'Add New Decoration Method'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            {/* Basic Information */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Internal Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  fullWidth
                  placeholder="e.g., screen_print, embroidery"
                  helperText="Used internally for identification (no spaces, lowercase with underscores)"
                />

                <TextField
                  label="Display Name"
                  value={formData.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  required
                  fullWidth
                  placeholder="e.g., Screen Print, Embroidery"
                  helperText="Name shown to users"
                />

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Brief description of this decoration method..."
                />
              </Box>
            </Box>

            {/* Size Constraints */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Default Size Constraints
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Min Width"
                  type="number"
                  value={formData.defaultMinWidth}
                  onChange={(e) => handleChange('defaultMinWidth', e.target.value)}
                  inputProps={{ min: 0, step: 0.1 }}
                  InputProps={{ endAdornment: <InputAdornment position="end">inches</InputAdornment> }}
                />

                <TextField
                  label="Max Width"
                  type="number"
                  value={formData.defaultMaxWidth}
                  onChange={(e) => handleChange('defaultMaxWidth', e.target.value)}
                  inputProps={{ min: 0, step: 0.1 }}
                  InputProps={{ endAdornment: <InputAdornment position="end">inches</InputAdornment> }}
                />

                <TextField
                  label="Min Height"
                  type="number"
                  value={formData.defaultMinHeight}
                  onChange={(e) => handleChange('defaultMinHeight', e.target.value)}
                  inputProps={{ min: 0, step: 0.1 }}
                  InputProps={{ endAdornment: <InputAdornment position="end">inches</InputAdornment> }}
                />

                <TextField
                  label="Max Height"
                  type="number"
                  value={formData.defaultMaxHeight}
                  onChange={(e) => handleChange('defaultMaxHeight', e.target.value)}
                  inputProps={{ min: 0, step: 0.1 }}
                  InputProps={{ endAdornment: <InputAdornment position="end">inches</InputAdornment> }}
                />
              </Box>
            </Box>

            {/* Color Options */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Color Options
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Autocomplete
                  multiple
                  options={commonColors}
                  freeSolo
                  value={formData.colorOptions}
                  onChange={(e, newValue) => handleChange('colorOptions', newValue)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={index}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Available Colors"
                      placeholder="Type or select colors..."
                      helperText="Leave empty if no color restrictions apply"
                    />
                  )}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.hasColorLimitations}
                        onChange={(e) => handleChange('hasColorLimitations', e.target.checked)}
                      />
                    }
                    label="Has Color Limitations"
                  />

                  {formData.hasColorLimitations && (
                    <TextField
                      label="Max Colors"
                      type="number"
                      value={formData.maxColors}
                      onChange={(e) => handleChange('maxColors', e.target.value)}
                      inputProps={{ min: 1 }}
                      sx={{ width: 120 }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Pricing */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Pricing & Turnaround
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                <TextField
                  label="Base Setup Cost"
                  type="number"
                  value={formData.baseSetupCost}
                  onChange={(e) => handleChange('baseSetupCost', e.target.value)}
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{ startAdornment: '$' }}
                />

                <TextField
                  label="Per Color Cost"
                  type="number"
                  value={formData.perColorCost}
                  onChange={(e) => handleChange('perColorCost', e.target.value)}
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{ startAdornment: '$' }}
                />

                <TextField
                  label="Per Unit Cost"
                  type="number"
                  value={formData.perUnitCost}
                  onChange={(e) => handleChange('perUnitCost', e.target.value)}
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{ startAdornment: '$' }}
                />

                <TextField
                  label="Turnaround"
                  type="number"
                  value={formData.estimatedTurnaround}
                  onChange={(e) => handleChange('estimatedTurnaround', e.target.value)}
                  inputProps={{ min: 1 }}
                  InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }}
                />
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                />
              }
              label="Active Decoration Method"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}