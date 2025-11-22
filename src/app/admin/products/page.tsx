import {
  Box,
  Typography,
  Container,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Inventory as ProductsIcon,
  Brush as DecorationIcon,
} from '@mui/icons-material';
import { requireAdminSession } from '@/lib/auth-helpers';
import { ProductsTab } from './ProductsTab';
import { DecorationMethodsTab } from './DecorationMethodsTab';

interface ProductManagementPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ProductManagementPage({ searchParams }: ProductManagementPageProps) {
  await requireAdminSession();
  const { tab = 'products' } = await searchParams;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Materials Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage appliques, decoration methods, variants, and vendor pricing
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} variant="scrollable" scrollButtons="auto">
          <Tab 
            label="Appliques" 
            value="products" 
            icon={<ProductsIcon />} 
            iconPosition="start"
            href="?tab=products"
            component="a"
          />
          <Tab 
            label="Decoration Products" 
            value="decoration-methods" 
            icon={<DecorationIcon />} 
            iconPosition="start"
            href="?tab=decoration-methods"
            component="a"
          />
        </Tabs>
      </Box>

      {tab === 'products' && <ProductsTab />}
      {tab === 'decoration-methods' && <DecorationMethodsTab />}
    </Container>
  );
}