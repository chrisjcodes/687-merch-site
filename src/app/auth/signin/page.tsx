import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import Link from 'next/link';
import { SignInForm } from './SignInForm';

export default function SignInPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Sign In to 687 Merch
          </Typography>
          <Typography color="textSecondary">
            Enter your email to receive a magic link for secure access to your account.
          </Typography>
        </Box>

        <SignInForm />

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Link href="/" passHref>
            <Button variant="text">
              ← Back to Home
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}