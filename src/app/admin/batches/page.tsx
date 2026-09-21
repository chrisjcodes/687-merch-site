'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material'
import InventoryIcon from '@mui/icons-material/Inventory'
import DownloadIcon from '@mui/icons-material/Download'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'

interface Collection {
  id: string
  title: string
  handle: string
}

interface Batch {
  id: string
  collectionHandle: string
  periodStart: string
  periodEnd: string
  closedAt: string
  orderCount: number
  totalItemsSold: number
  totalItemsRequired: number
  clientId: string | null
  clientSharePct: string | null
}

interface BatchSummary {
  id: string
  collectionHandle: string
  periodStart: string
  periodEnd: string
  closedAt: string
  orderCount: number
  totalItemsSold: number
  totalItemsRequired: number
  clientId: string | null
  clientSharePct: number | null
  garments: Array<{
    sku: string
    size: string
    soldQty: number
    requiredQty: number
  }>
  materials: Array<{
    sku: string
    productionType: string | null
    soldQty: number
    requiredQty: number
  }>
}

export default function BatchesPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedCollection, setSelectedCollection] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingCollections, setLoadingCollections] = useState(true)
  const [loadingBatches, setLoadingBatches] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Batch detail dialog
  const [selectedBatch, setSelectedBatch] = useState<BatchSummary | null>(null)
  const [loadingBatch, setLoadingBatch] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Load collections on mount
  useEffect(() => {
    async function loadCollections() {
      try {
        const res = await fetch('/api/admin/collections')
        if (!res.ok) throw new Error('Failed to load collections')
        const data = await res.json()
        setCollections(data)
      } catch (err) {
        setError('Failed to load collections')
        console.error(err)
      } finally {
        setLoadingCollections(false)
      }
    }
    loadCollections()
  }, [])

  // Load batches on mount
  useEffect(() => {
    async function loadBatches() {
      try {
        const res = await fetch('/api/admin/batches')
        if (!res.ok) throw new Error('Failed to load batches')
        const data = await res.json()
        setBatches(data)
      } catch (err) {
        setError('Failed to load batches')
        console.error(err)
      } finally {
        setLoadingBatches(false)
      }
    }
    loadBatches()
  }, [])

  const handleCloseBatch = async () => {
    if (!selectedCollection || !startDate || !endDate) {
      setError('Please select a collection and date range')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/admin/batches/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionHandle: selectedCollection,
          periodStart: startDate,
          periodEnd: endDate,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to close batch')
      }

      const newBatch = await res.json()
      setBatches([newBatch, ...batches])
      setSuccess(`Batch created successfully with ${newBatch.orderCount} orders`)

      // Reset form
      setSelectedCollection('')
      setStartDate('')
      setEndDate('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close batch')
    } finally {
      setLoading(false)
    }
  }

  const handleViewBatch = async (batchId: string) => {
    setLoadingBatch(true)
    setDialogOpen(true)
    setSelectedBatch(null)

    try {
      const res = await fetch(`/api/admin/batches/${batchId}`)
      if (!res.ok) throw new Error('Failed to load batch')
      const data = await res.json()
      setSelectedBatch(data)
    } catch (err) {
      console.error(err)
      setDialogOpen(false)
      setError('Failed to load batch details')
    } finally {
      setLoadingBatch(false)
    }
  }

  const handleExportCSV = () => {
    if (!selectedBatch) return

    const lines: string[] = []

    // Header
    lines.push(`Purchase Order: ${selectedBatch.collectionHandle}`)
    lines.push(`Period: ${new Date(selectedBatch.periodStart).toLocaleDateString()} - ${new Date(selectedBatch.periodEnd).toLocaleDateString()}`)
    lines.push(`Closed: ${new Date(selectedBatch.closedAt).toLocaleString()}`)
    lines.push(`Orders: ${selectedBatch.orderCount}, Sold: ${selectedBatch.totalItemsSold}, Required: ${selectedBatch.totalItemsRequired}`)
    if (selectedBatch.clientId) {
      lines.push(`Client: ${selectedBatch.clientId}, Share: ${selectedBatch.clientSharePct}%`)
    }
    lines.push('')

    // Garments section
    lines.push('GARMENTS')
    lines.push('SKU,Size,Sold,Required')
    for (const g of selectedBatch.garments) {
      lines.push(`${g.sku},${g.size},${g.soldQty},${g.requiredQty}`)
    }
    lines.push('')

    // Materials section
    lines.push('MATERIALS')
    lines.push('SKU,Production Type,Sold,Required')
    for (const m of selectedBatch.materials) {
      lines.push(`${m.sku},${m.productionType || ''},${m.soldQty},${m.requiredQty}`)
    }

    const csv = lines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `purchase-order-${selectedBatch.collectionHandle}-${new Date(selectedBatch.closedAt).toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getCollectionTitle = (handle: string) => {
    return collections.find((c) => c.handle === handle)?.title || handle
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
        <InventoryIcon /> Batches (Purchase Orders)
      </Typography>

      <Card sx={{ bgcolor: '#1a1a1a', color: '#fff', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Close Batch
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
            Create a purchase order by aggregating orders from a collection within a date range.
            Minimums will be applied to determine required quantities.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
            <FormControl fullWidth sx={{ flex: 2 }}>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Collection</InputLabel>
              <Select
                value={selectedCollection}
                label="Collection"
                onChange={(e) => setSelectedCollection(e.target.value)}
                disabled={loadingCollections}
                sx={{
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f2bf00' },
                }}
              >
                {collections.map((col) => (
                  <MenuItem key={col.id} value={col.handle}>
                    {col.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Period Start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                flex: 1,
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              }}
            />

            <TextField
              label="Period End"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                flex: 1,
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              }}
            />

            <Button
              variant="contained"
              onClick={handleCloseBatch}
              disabled={loading || !selectedCollection || !startDate || !endDate}
              sx={{
                bgcolor: '#f2bf00',
                color: '#000',
                '&:hover': { bgcolor: '#d4a800' },
                '&:disabled': { bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.3)' },
                height: 56,
                minWidth: 150,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Close Batch'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: '#1a1a1a', color: '#fff' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Batch History
          </Typography>

          {loadingBatches ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : batches.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', py: 4 }}>
              No batches yet. Close a batch above to create your first purchase order.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ bgcolor: '#2a2a2a' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Collection</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Period</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Closed</TableCell>
                    <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Orders</TableCell>
                    <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Sold</TableCell>
                    <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Required</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {getCollectionTitle(batch.collectionHandle)}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {new Date(batch.periodStart).toLocaleDateString()} - {new Date(batch.periodEnd).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {new Date(batch.closedAt).toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {batch.orderCount}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {batch.totalItemsSold}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={batch.totalItemsRequired}
                          size="small"
                          sx={{
                            bgcolor: batch.totalItemsRequired > batch.totalItemsSold ? 'rgba(242, 191, 0, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                            color: batch.totalItemsRequired > batch.totalItemsSold ? '#f2bf00' : '#4caf50',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewBatch(batch.id)}
                          sx={{ color: '#f2bf00' }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Batch Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { bgcolor: '#1a1a1a', color: '#fff' },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Purchase Order Details</span>
          <Box>
            {selectedBatch && (
              <Button
                startIcon={<DownloadIcon />}
                onClick={handleExportCSV}
                sx={{ color: '#f2bf00', mr: 1 }}
              >
                Export CSV
              </Button>
            )}
            <IconButton onClick={() => setDialogOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loadingBatch ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedBatch ? (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {getCollectionTitle(selectedBatch.collectionHandle)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Period: {new Date(selectedBatch.periodStart).toLocaleDateString()} - {new Date(selectedBatch.periodEnd).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Closed: {new Date(selectedBatch.closedAt).toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Chip label={`${selectedBatch.orderCount} orders`} size="small" />
                  <Chip label={`${selectedBatch.totalItemsSold} sold`} size="small" />
                  <Chip
                    label={`${selectedBatch.totalItemsRequired} required`}
                    size="small"
                    sx={{
                      bgcolor: selectedBatch.totalItemsRequired > selectedBatch.totalItemsSold ? 'rgba(242, 191, 0, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                      color: selectedBatch.totalItemsRequired > selectedBatch.totalItemsSold ? '#f2bf00' : '#4caf50',
                    }}
                  />
                </Box>
                {selectedBatch.clientId && (
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                    Client: {selectedBatch.clientId} ({selectedBatch.clientSharePct}% share)
                  </Typography>
                )}
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Garments
              </Typography>
              {selectedBatch.garments.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  No garments in this batch.
                </Typography>
              ) : (
                <TableContainer component={Paper} sx={{ bgcolor: '#2a2a2a', mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#fff', fontWeight: 600 }}>SKU</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Size</TableCell>
                        <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Sold</TableCell>
                        <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Required</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedBatch.garments.map((g, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{g.sku}</TableCell>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{g.size}</TableCell>
                          <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{g.soldQty}</TableCell>
                          <TableCell align="right" sx={{ color: g.requiredQty > g.soldQty ? '#f2bf00' : 'rgba(255, 255, 255, 0.9)' }}>
                            {g.requiredQty}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Materials
              </Typography>
              {selectedBatch.materials.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  No materials in this batch. Set up variant metafields to track materials.
                </Typography>
              ) : (
                <TableContainer component={Paper} sx={{ bgcolor: '#2a2a2a' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#fff', fontWeight: 600 }}>SKU</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Production Type</TableCell>
                        <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Sold</TableCell>
                        <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Required</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedBatch.materials.map((m, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{m.sku}</TableCell>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{m.productionType || '-'}</TableCell>
                          <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{m.soldQty}</TableCell>
                          <TableCell align="right" sx={{ color: m.requiredQty > m.soldQty ? '#f2bf00' : 'rgba(255, 255, 255, 0.9)' }}>
                            {m.requiredQty}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
