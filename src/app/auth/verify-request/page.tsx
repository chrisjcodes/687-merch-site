import {
  Box,
  Typography,
  Container,
  Paper,
  Alert,
  Button,
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import Link from 'next/link';

export default function VerifyRequestPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Check Your Email
        </Typography>
        
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1">
            We&apos;ve sent you a sign-in link. Please check your email and click the link to access your account.
          </Typography>
        </Alert>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
          If you don&apos;t see the email in your inbox, please check your spam folder.
        </Typography>

        <Link href="/auth/signin" passHref>
          <Button variant="outlined" sx={{ mr: 2 }}>
            Try Again
          </Button>
        </Link>
        
        <Link href="/" passHref>
          <Button variant="text">
            Back to Home
          </Button>
        </Link>
      </Paper>
    </Container>
  );
}