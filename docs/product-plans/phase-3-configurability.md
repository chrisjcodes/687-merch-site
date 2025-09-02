# Phase 3: Configurability Foundation (4-6 weeks)
*Priority: Build flexibility for future customers*

## Overview

Phase 3 transforms the working 687 Merch system into a configurable platform that can be easily customized for different custom merchandise businesses. This phase adds the configuration layer without disrupting the proven workflow from Phases 1 and 2.

## Objectives

### Primary Goals
1. **Configuration Layer**: Build settings system that controls business-specific features
2. **Template System**: Create reusable patterns for products, workflows, and UI elements
3. **White-Label Ready**: Enable easy rebranding and customization
4. **Export/Import**: Tools for setup replication and data portability

### Strategic Impact
- **Product Readiness**: Foundation for license model distribution
- **Customization Speed**: New customer setup in under 30 minutes
- **Brand Flexibility**: Each business can maintain their unique identity
- **Scalable Architecture**: Support for diverse business models and workflows

## Technical Implementation

### Week 1-2: Core Configuration System

#### 1. Business Settings Management
**Current State**: Hard-coded business information and workflow
**Enhancement**: Comprehensive configuration system

```prisma
model BusinessSettings {
  id              String @id @default(cuid())
  
  // Business Identity
  businessName    String
  legalName       String?
  logo            String? // URL to logo file
  favicon         String? // URL to favicon
  primaryColor    String @default("#2563eb")
  secondaryColor  String @default("#64748b")
  accentColor     String @default("#dc2626")
  
  // Contact Information
  email           String?
  phone           String?
  website         String?
  
  // Business Address
  address         Json? // Structured address object
  
  // Operational Settings
  defaultCurrency String @default("USD")
  timezone        String @default("America/New_York")
  businessHours   Json? // Operating hours by day
  
  // Financial Configuration
  defaultMarkup   Float @default(30.0)
  taxRate         Float?
  salesTaxEnabled Boolean @default(false)
  
  // Feature Configuration
  features        BusinessFeatures?
  
  // Workflow Configuration
  workflow        WorkflowSettings?
  
  // Notification Settings
  notifications   NotificationSettings?
  
  updatedAt       DateTime @updatedAt
  
  @@map("business_settings")
}

model BusinessFeatures {
  id              String @id @default(cuid())
  businessId      String @unique
  business        BusinessSettings @relation(fields: [businessId], references: [id])
  
  // Core Features
  customerPortal        Boolean @default(true)
  designApprovals       Boolean @default(true)
  employeeManagement    Boolean @default(true)
  materialTracking      Boolean @default(false)
  
  // Advanced Features
  productionScheduling  Boolean @default(false)
  timeTracking         Boolean @default(false)
  profitabilityReports Boolean @default(false)
  inventoryManagement  Boolean @default(false)
  
  // Integration Features
  emailIntegration     Boolean @default(true)
  calendarSync         Boolean @default(false)
  accountingSync       Boolean @default(false)
  
  // Limits
  maxEmployees         Int @default(10)
  maxCustomers         Int? // Unlimited if null
  maxJobsPerMonth      Int? // Unlimited if null
  storageLimit         Int? // MB, unlimited if null
  
  updatedAt           DateTime @updatedAt
  
  @@map("business_features")
}

model WorkflowSettings {
  id            String @id @default(cuid())
  businessId    String @unique
  business      BusinessSettings @relation(fields: [businessId], references: [id])
  
  // Job Status Configuration
  jobStatuses   Json // Array of status objects with colors, labels, order
  defaultStatus String @default("PENDING_DESIGN")
  
  // Priority Configuration
  priorityLevels Json // Array of priority levels with colors and labels
  
  // Employee Roles
  employeeRoles Json // Array of role objects with permissions
  
  // Production Stages
  productionStages Json // Array of production stages
  
  // Approval Workflow
  requiresDesignApproval Boolean @default(true)
  autoApprovalThreshold  Decimal? // Auto-approve jobs under this amount
  
  updatedAt     DateTime @updatedAt
  
  @@map("workflow_settings")
}

model NotificationSettings {
  id                    String @id @default(cuid())
  businessId            String @unique
  business              BusinessSettings @relation(fields: [businessId], references: [id])
  
  // Email Configuration
  fromEmail             String
  fromName              String
  replyToEmail          String?
  
  // SMTP Settings (encrypted)
  smtpHost              String?
  smtpPort              Int?
  smtpUsername          String?
  smtpPassword          String? // Encrypted
  
  // Notification Triggers
  statusChangeNotify    Boolean @default(true)
  designApprovalNotify  Boolean @default(true)
  jobCompletionNotify   Boolean @default(true)
  lowInventoryNotify    Boolean @default(true)
  
  // Template Customization
  emailTemplates        Json? // Custom email templates
  
  updatedAt             DateTime @updatedAt
  
  @@map("notification_settings")
}
```

#### 2. Product Template System
**Current State**: Fixed product catalog
**Enhancement**: Template-based product creation with customization

```prisma
model ProductTemplate {
  id              String @id @default(cuid())
  
  // Template Identity
  name            String // "Basic T-Shirt", "Trucker Hat", etc.
  category        ProductCategory
  description     String?
  
  // Default Configuration
  defaultPrice    Decimal
  priceRange      Json? // Min/max price suggestions
  
  // Size Configuration
  sizeSystem      SizeSystem
  defaultSizes    String[] // Available sizes
  customSizes     Boolean @default(false) // Allow custom size entry
  
  // Decoration Options
  decorationMethods String[] // Supported decoration methods
  placementOptions  Json // Available placement locations with defaults
  
  // Material Requirements (for auto-costing)
  materialSpecs   Json? // Material usage patterns
  
  // Template Metadata
  isActive        Boolean @default(true)
  sortOrder       Int @default(0)
  tags            String[] // For filtering/organization
  
  // Usage Tracking
  businesses      Product[] // Products created from this template
  usageCount      Int @default(0)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("product_templates")
}

// Enhanced Product model with template relationship
model Product {
  // ... existing fields ...
  
  // Template Configuration
  templateId      String?
  template        ProductTemplate? @relation(fields: [templateId], references: [id])
  customizations  Json? // How this product differs from template
  
  // Business-specific overrides
  businessPrice   Decimal? // Override template price
  businessSizes   String[]? // Override template sizes
  businessColors  String[]? // Available colors for this business
  
  // ... rest of existing model
}
```

### Week 3-4: UI Customization System

#### 3. Theme and Branding System
**Current State**: Fixed Material-UI theme
**Enhancement**: Dynamic theming based on business settings

```typescript
// Dynamic theme configuration
interface BusinessTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  branding: {
    logo: string;
    favicon: string;
    businessName: string;
    tagline?: string;
  };
  
  layout: {
    headerStyle: 'minimal' | 'full' | 'compact';
    sidebarStyle: 'hidden' | 'mini' | 'full';
    cardStyle: 'outlined' | 'elevated' | 'flat';
  };
  
  typography: {
    fontFamily: string;
    headingWeight: number;
    bodyWeight: number;
  };
}

// Theme provider component
export function BusinessThemeProvider({ children, businessId }: Props) {
  const theme = useBusinessTheme(businessId);
  
  const muiTheme = createMuiTheme({
    palette: {
      primary: { main: theme.colors.primary },
      secondary: { main: theme.colors.secondary },
      // ... dynamic color mapping
    },
    components: {
      // Dynamic component overrides based on theme
    }
  });
  
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

#### 4. Configurable Dashboard Layout
**Current State**: Fixed dashboard layout
**Enhancement**: Customizable widget system

```prisma
model DashboardLayout {
  id              String @id @default(cuid())
  businessId      String @unique
  business        BusinessSettings @relation(fields: [businessId], references: [id])
  
  // Layout Configuration
  layout          Json // Widget positions and sizes
  enabledWidgets  String[] // Which widgets to show
  
  // User-specific layouts (future)
  userLayouts     Json? // Per-user customizations
  
  updatedAt       DateTime @updatedAt
  
  @@map("dashboard_layouts")
}

// Widget configuration system
interface DashboardWidget {
  id: string;
  type: 'jobs' | 'metrics' | 'calendar' | 'materials' | 'employees';
  title: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  permissions: string[]; // Which roles can see this widget
}
```

### Week 5-6: Setup and Migration Tools

#### 5. Business Setup Wizard
**Current State**: Manual configuration through admin panels
**Enhancement**: Guided setup process for new businesses

```prisma
model SetupTemplate {
  id              String @id @default(cuid())
  
  // Template Metadata
  name            String // "Screen Print Shop", "Embroidery Business", etc.
  description     String
  businessType    String // "SCREEN_PRINT", "EMBROIDERY", "FULL_SERVICE", etc.
  
  // Default Configuration
  defaultSettings BusinessSettings // JSON of default settings
  defaultFeatures Json // Feature flags for this business type
  defaultWorkflow Json // Workflow configuration
  
  // Product Recommendations
  recommendedProducts String[] // Template IDs to include
  
  // Sample Data
  sampleCustomers Json? // Demo customers to create
  sampleJobs      Json? // Demo jobs to create
  
  // Usage and Analytics
  usageCount      Int @default(0)
  isActive        Boolean @default(true)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("setup_templates")
}

model SetupProgress {
  id              String @id @default(cuid())
  businessId      String @unique
  business        BusinessSettings @relation(fields: [businessId], references: [id])
  
  // Setup Steps
  currentStep     Int @default(0)
  completedSteps  Int[] // Array of completed step numbers
  totalSteps      Int @default(10)
  
  // Setup Data
  templateId      String?
  template        SetupTemplate? @relation(fields: [templateId], references: [id])
  setupData       Json? // Temporary data during setup
  
  // Status
  isCompleted     Boolean @default(false)
  completedAt     DateTime?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("setup_progress")
}
```

#### 6. Configuration Export/Import System
**Current State**: No data portability
**Enhancement**: Complete system backup and restoration

```typescript
interface BusinessExport {
  version: string;
  exportedAt: string;
  businessInfo: {
    settings: BusinessSettings;
    features: BusinessFeatures;
    workflow: WorkflowSettings;
    notifications: NotificationSettings;
  };
  
  productCatalog: {
    products: Product[];
    templates: ProductTemplate[];
    categories: any[];
  };
  
  employees: Employee[];
  materials: Material[];
  
  // Optional: Sample/demo data
  sampleData?: {
    customers: Customer[];
    jobs: Job[];
    designs: Design[];
  };
}

// Export functionality
export async function exportBusinessConfiguration(businessId: string): Promise<BusinessExport> {
  const settings = await getBusinessSettings(businessId);
  const products = await getBusinessProducts(businessId);
  // ... gather all configuration data
  
  return {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    businessInfo: settings,
    productCatalog: products,
    // ... rest of data
  };
}

// Import functionality with validation
export async function importBusinessConfiguration(
  businessId: string, 
  exportData: BusinessExport,
  options: ImportOptions
): Promise<ImportResult> {
  // Validate export format and version
  validateExportFormat(exportData);
  
  // Import with transaction safety
  return await prisma.$transaction(async (tx) => {
    if (options.includeSettings) {
      await updateBusinessSettings(tx, businessId, exportData.businessInfo);
    }
    
    if (options.includeProducts) {
      await importProductCatalog(tx, businessId, exportData.productCatalog);
    }
    
    // ... import other sections
    
    return { success: true, importedItems: itemCount };
  });
}
```

## User Interface Enhancements

### Business Settings Interface
- **Settings Dashboard**: Centralized configuration management
- **Theme Customizer**: Live preview of branding changes
- **Feature Toggle Panel**: Enable/disable features with usage limits
- **Workflow Designer**: Visual workflow configuration

### Setup Wizard Interface
- **Business Type Selection**: Choose from predefined templates
- **Branding Setup**: Logo upload, color picker, business info
- **Product Catalog Setup**: Select and customize product templates
- **Employee Setup**: Add team members and assign roles
- **Sample Data**: Option to create demo data for testing

### Configuration Management
- **Export Tool**: Download complete business configuration
- **Import Tool**: Upload and apply configuration from file
- **Template Manager**: Create and manage custom templates
- **Backup System**: Automated configuration backups

## Integration Architecture

### Configuration API
```typescript
// Configuration service API
interface ConfigurationAPI {
  // Business settings
  getBusinessSettings(businessId: string): Promise<BusinessSettings>;
  updateBusinessSettings(businessId: string, settings: Partial<BusinessSettings>): Promise<BusinessSettings>;
  
  // Feature management
  getFeatures(businessId: string): Promise<BusinessFeatures>;
  updateFeatures(businessId: string, features: Partial<BusinessFeatures>): Promise<BusinessFeatures>;
  hasFeature(businessId: string, feature: string): Promise<boolean>;
  
  // Theme and branding
  getTheme(businessId: string): Promise<BusinessTheme>;
  updateTheme(businessId: string, theme: Partial<BusinessTheme>): Promise<BusinessTheme>;
  
  // Workflow configuration
  getWorkflow(businessId: string): Promise<WorkflowSettings>;
  updateWorkflow(businessId: string, workflow: Partial<WorkflowSettings>): Promise<WorkflowSettings>;
  
  // Templates
  getTemplates(businessType?: string): Promise<SetupTemplate[]>;
  applyTemplate(businessId: string, templateId: string): Promise<void>;
}
```

### Configuration Hooks for React
```typescript
// Custom hooks for configuration access
export function useBusinessSettings(businessId: string) {
  return useQuery(['business-settings', businessId], () => 
    configAPI.getBusinessSettings(businessId)
  );
}

export function useFeatureFlag(feature: string) {
  const { data: features } = useBusinessFeatures();
  return features?.[feature] ?? false;
}

export function useBusinessTheme() {
  const { data: theme } = useQuery(['business-theme'], () => 
    configAPI.getTheme(getCurrentBusinessId())
  );
  return theme;
}

// HOC for feature-gated components
export function withFeature<P>(feature: string, Component: React.ComponentType<P>) {
  return function FeatureGatedComponent(props: P) {
    const hasFeature = useFeatureFlag(feature);
    
    if (!hasFeature) {
      return null; // or a disabled state
    }
    
    return <Component {...props} />;
  };
}
```

## Testing Strategy

### Configuration Testing
- [ ] Business settings update correctly across all interfaces
- [ ] Feature flags properly enable/disable functionality
- [ ] Theme changes apply immediately without page refresh
- [ ] Workflow configurations affect job processing correctly

### Template System Testing
- [ ] Product templates create products with correct defaults
- [ ] Setup templates provide complete business configuration
- [ ] Template customizations save and apply properly
- [ ] Template versioning maintains compatibility

### Import/Export Testing
- [ ] Configuration export includes all necessary data
- [ ] Import process validates data integrity
- [ ] Import/export cycle preserves all settings
- [ ] Large configurations export/import within reasonable time

### White-Label Testing
- [ ] Branding changes appear throughout entire application
- [ ] Custom colors apply to all UI components
- [ ] Logo displays correctly in all locations
- [ ] Email templates use business branding

## Success Metrics

### Configuration Flexibility
- [ ] Business setup time reduced to under 30 minutes
- [ ] Template system covers 80% of setup decisions automatically
- [ ] Theme customization provides professional appearance
- [ ] Export/import enables easy business replication

### System Performance
- [ ] Configuration changes apply without system restart
- [ ] Theme updates don't impact page load times
- [ ] Feature flags work reliably across user sessions
- [ ] Configuration API responds within 200ms

### User Experience
- [ ] Setup wizard completion rate above 90%
- [ ] Configuration interface is intuitive for non-technical users
- [ ] Branding options provide sufficient customization
- [ ] Help documentation covers all configuration options

## License Model Preparation

### Configuration as Product Features
- **Basic License**: Core configuration, limited themes
- **Professional License**: Advanced features, full customization
- **Enterprise License**: Custom templates, white-label options

### Business Type Templates
- **Screen Print Shop**: Optimized for screen printing workflow
- **Embroidery Business**: Thread management, digitizing workflow
- **Full Service**: All decoration methods, complex workflows
- **Small Operation**: Simplified interface, essential features only

### Scalability Considerations
- **Multi-Business Support**: Architecture ready for hosting multiple businesses
- **Configuration Isolation**: Complete data separation between businesses
- **Resource Limits**: Configurable limits based on license level
- **Performance Monitoring**: Track resource usage per business

## Risk Management

### Configuration Safety
- **Validation Layer**: Prevent invalid configurations that break functionality
- **Rollback Capability**: Ability to revert to previous configuration
- **Default Fallbacks**: Safe defaults when configuration is missing
- **Migration Scripts**: Handle configuration changes in updates

### Data Protection
- **Configuration Backup**: Automated backup of all settings
- **Export Validation**: Ensure exported data is complete and valid
- **Import Safety**: Validate imported data before applying
- **Audit Trail**: Track all configuration changes

### Performance Considerations
- **Configuration Caching**: Cache frequently accessed settings
- **Lazy Loading**: Load configuration only when needed
- **Database Optimization**: Efficient queries for configuration data
- **Memory Management**: Prevent configuration data from consuming excessive memory

Phase 3 establishes the complete foundation for transforming the 687 Merch system into a configurable product while maintaining all the business value built in previous phases.