import {
  Box,
  Typography,
  Container,
  TextField,
  Grid,
  Paper,
  Alert,
} from '@mui/material';
import { requireCustomerSession, getJobForCustomer } from '@/lib/auth-helpers';
import { ReorderForm } from './ReorderForm';

interface ReorderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReorderPage({ params }: ReorderPageProps) {
  const { id } = await params;
  const session = await requireCustomerSession();
  
  let job;
  try {
    job = await getJobForCustomer(id, session.user.customerId!);
  } catch (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Job not found or you don&apos;t have permission to access it.
        </Alert>
      </Container>
    );
  }

  // Extract size breakdown from the first item (assuming consistent sizing across items)
  const originalSizeBreakdown = job.items[0]?.sizeBreakdown || {};

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Reorder Job {job.id.slice(-8).toUpperCase()}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Original Order Details
            </Typography>
            {job.items.map((item, index) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  {item.productSku}{item.variant && ` (${item.variant})`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Quantity: {item.qty}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Original sizes: {JSON.stringify(item.sizeBreakdown)}
                </Typography>
              </Box>
            ))}
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Created: {new Date(job.createdAt).toLocaleDateString()}
            </Typography>
            {job.dueDate && (
              <Typography variant="body2" color="textSecondary">
                Due: {new Date(job.dueDate).toLocaleDateString()}
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              New Order Details
            </Typography>
            <ReorderForm 
              jobId={job.id}
              originalSizeBreakdown={originalSizeBreakdown}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}