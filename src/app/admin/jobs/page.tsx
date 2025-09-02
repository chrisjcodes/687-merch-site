import {
  Box,
  Typography,
  Container,
  Button,
} from '@mui/material';
import { 
  Add as AddIcon, 
} from '@mui/icons-material';
import Link from 'next/link';
import { requireAdminSession } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { JobsTable } from './JobsTable';

export default async function AdminJobsPage() {
  await requireAdminSession();
  
  const jobs = await prisma.job.findMany({
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        }
      },
      items: {
        select: {
          quantity: true,
          product: {
            select: {
              sku: true,
              name: true
            }
          },
          variant: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Job Management
        </Typography>
        <Link href="/admin/jobs/new" passHref>
          <Button variant="contained" startIcon={<AddIcon />}>
            New Job
          </Button>
        </Link>
      </Box>

      <JobsTable initialJobs={jobs} />
    </Container>
  );
}