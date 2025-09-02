import {
  Box,
  Typography,
  Container,
} from '@mui/material';
import { requireAdminSession } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { NewJobForm } from './NewJobForm';

export default async function NewJobPage() {
  await requireAdminSession();
  
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Create New Job
        </Typography>
      </Box>

      <NewJobForm customers={customers} />
    </Container>
  );
}