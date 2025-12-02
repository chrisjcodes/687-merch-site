'use client'

import { useState } from 'react'
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
} from '@mui/material'
import AssessmentIcon from '@mui/icons-material/Assessment'
import DownloadIcon from '@mui/icons-material/Download'
import { useEffect } from 'react'

interface Collection {
  id: string
  title: string
  handle: string
}

interface GarmentCount {
  garmentSku: string
  size: string
  quantity: number
}

interface MaterialCount {
  materialSku: string
  quantity: number
  productionType?: string
}

interface ProductionReport {
  collectionHandle: string
  startDate: string
  endDate: string
  orderCount: number
  totalItems: number
  garments: GarmentCount[]
  materials: MaterialCount[]
}

export default function ReportsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingCollections, setLoadingCollections] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<ProductionReport | null>(null)

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

  const handleGenerateReport = async () => {
    if (!selectedCollection || !startDate || !endDate) {
      setError('Please select a collection and date range')
      return
    }

    setLoading(true)
    setError(null)
    setReport(null)

    try {
      const res = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectionHandle: selectedCollection,
          startDate,
          endDate,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to generate report')
      }

      const data = await res.json()
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    if (!report) return

    const lines: string[] = []

    // Header
    lines.push(`Production Report: ${report.collectionHandle}`)
    lines.push(`Date Range: ${report.startDate} to ${report.endDate}`)
    lines.push(`Orders: ${report.orderCount}, Total Items: ${report.totalItems}`)
    lines.push('')

    // Garments section
    lines.push('GARMENTS')
    lines.push('SKU,Size,Quantity')
    for (const garment of report.garments) {
      lines.push(`${garment.garmentSku},${garment.size},${garment.quantity}`)
    }
    lines.push('')

    // Materials section
    lines.push('MATERIALS')
    lines.push('SKU,Quantity,Production Type')
    for (const material of report.materials) {
      lines.push(`${material.materialSku},${material.quantity},${material.productionType || ''}`)
    }

    const csv = lines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `production-report-${report.collectionHandle}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
        <AssessmentIcon /> Production Reports
      </Typography>

      <Card sx={{ bgcolor: '#1a1a1a', color: '#fff', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Generate Production Report
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
              label="Start Date"
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
              label="End Date"
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
              onClick={handleGenerateReport}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {report && (
        <Card sx={{ bgcolor: '#1a1a1a', color: '#fff' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6">
                  Report: {collections.find((c) => c.handle === report.collectionHandle)?.title || report.collectionHandle}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {report.orderCount} orders, {report.totalItems} total items
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportCSV}
                sx={{
                  borderColor: '#f2bf00',
                  color: '#f2bf00',
                  '&:hover': { borderColor: '#d4a800', bgcolor: 'rgba(242, 191, 0, 0.1)' },
                }}
              >
                Export CSV
              </Button>
            </Box>

            {report.orderCount === 0 ? (
              <Alert severity="info">No orders found for this collection in the selected date range.</Alert>
            ) : (
              <>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Garments
                </Typography>
                <TableContainer component={Paper} sx={{ bgcolor: '#2a2a2a', mb: 4 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Garment SKU</TableCell>
                        <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Size</TableCell>
                        <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {report.garments.map((garment, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{garment.garmentSku}</TableCell>
                          <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{garment.size}</TableCell>
                          <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{garment.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Materials
                </Typography>
                {report.materials.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    No materials data available. Set up variant metafields to track materials.
                  </Typography>
                ) : (
                  <TableContainer component={Paper} sx={{ bgcolor: '#2a2a2a' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Material SKU</TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Production Type</TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {report.materials.map((material, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{material.materialSku}</TableCell>
                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{material.productionType || '-'}</TableCell>
                            <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{material.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
