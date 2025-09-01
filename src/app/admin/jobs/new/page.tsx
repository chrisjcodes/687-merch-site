import {
  Box,
  Typography,
  Container,
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Link from 'next/link';
import { requireAdminSession } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { NewJobForm } from './NewJobForm';

export default async function NewJobPage() {
  await requireAdminSession();
  
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Link href="/admin/jobs" passHref>
          <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
            Back to Jobs
          </Button>
        </Link>
        <Typography variant="h4" component="h1">
          Create New Job
        </Typography>
      </Box>

      <NewJobForm customers={customers} />
    </Container>
  );
}