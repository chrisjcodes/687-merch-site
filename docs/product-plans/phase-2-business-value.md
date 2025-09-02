# Phase 2: Business Value Features (6-8 weeks)
*Priority: Advanced features that improve daily operations*

## Overview

Phase 2 builds on the solid foundation from Phase 1 to add advanced features that significantly improve daily operations for 687 Merch. These features focus on customer experience, production efficiency, and business insights.

## Objectives

### Primary Goals
1. **Enhance Customer Experience**: Improved portal with real-time updates and approval workflows
2. **Optimize Production**: Scheduling tools and workflow management
3. **Track Profitability**: Material costs, time tracking, and job profitability analysis
4. **Automate Processes**: Reduce manual work through smart automation

### Business Impact
- **Customer Inquiries**: Reduce by 30% through better self-service portal
- **Production Efficiency**: Improve throughput with better scheduling
- **Cost Visibility**: Accurate job costing for better pricing decisions
- **Data-Driven Decisions**: Reports and analytics for business optimization

## Technical Implementation

### Weeks 1-3: Customer Portal Enhancements

#### 1. Real-Time Job Status Updates
**Current State**: Static job information, manual customer communication
**Enhancement**: Live updates with notification system

```typescript
// Real-time status subscription
model JobStatusUpdate {
  id        String @id @default(cuid())
  jobId     String
  job       Job @relation(fields: [jobId], references: [id])
  oldStatus JobStatus
  newStatus JobStatus
  message   String? // Custom message for customer
  isCustomerVisible Boolean @default(true)
  notificationSent Boolean @default(false)
  createdAt DateTime @default(now())
  
  @@map("job_status_updates")
}

// Email notification queue
model NotificationQueue {
  id          String @id @default(cuid())
  type        NotificationType
  recipientEmail String
  subject     String
  content     String
  templateData Json?
  status      NotificationStatus @default(PENDING)
  sentAt      DateTime?
  error       String?
  createdAt   DateTime @default(now())
  
  @@map("notification_queue")
}

enum NotificationType {
  JOB_STATUS_UPDATE
  DESIGN_APPROVAL_REQUEST
  JOB_COMPLETED
  RUSH_JOB_ACCEPTED
}

enum NotificationStatus {
  PENDING
  SENT
  FAILED
  CANCELLED
}
```

#### 2. Design Approval Workflow
**Current State**: Email back-and-forth for design approvals
**Enhancement**: In-portal approval system with version control

```prisma
model DesignApprovalRequest {
  id          String @id @default(cuid())
  designId    String
  design      Design @relation(fields: [designId], references: [id])
  customerId  String
  customer    Customer @relation(fields: [customerId], references: [id])
  
  message     String? // Request message to customer
  dueDate     DateTime? // When approval is needed
  status      ApprovalStatus @default(PENDING)
  
  // Response from customer
  approvedAt  DateTime?
  rejectedAt  DateTime?
  feedback    String? // Customer comments
  requestedChanges String? // What changes they want
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("design_approval_requests")
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
  CHANGES_REQUESTED
  EXPIRED
}
```

#### 3. Enhanced File Management
**Current State**: Basic file download
**Enhancement**: Organized file library with categories

```prisma
model CustomerFile {
  id          String @id @default(cuid())
  customerId  String
  customer    Customer @relation(fields: [customerId], references: [id])
  jobId       String?
  job         Job? @relation(fields: [jobId], references: [id])
  
  name        String
  description String?
  category    FileCategory
  fileUrl     String
  fileName    String
  fileSize    Int
  mimeType    String
  
  // Access control
  isPublic    Boolean @default(false) // Visible to customer
  downloadCount Int @default(0)
  lastDownloaded DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("customer_files")
}

enum FileCategory {
  FINAL_DESIGN
  PROOF
  INVOICE
  QUOTE
  REFERENCE
  OTHER
}
```

### Weeks 4-6: Production Management

#### 4. Production Scheduling System
**Current State**: Manual scheduling and assignment tracking
**Enhancement**: Visual calendar with capacity planning

```prisma
model ProductionSchedule {
  id            String @id @default(cuid())
  jobId         String
  job           Job @relation(fields: [jobId], references: [id])
  employeeId    String?
  employee      Employee? @relation(fields: [employeeId], references: [id])
  
  // Scheduling details
  scheduledDate DateTime
  startTime     DateTime?
  endTime       DateTime?
  estimatedHours Float?
  actualHours   Float?
  
  // Production stage
  stage         ProductionStage
  priority      Int @default(0) // For ordering within day
  
  // Status tracking
  status        ScheduleStatus @default(SCHEDULED)
  notes         String?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("production_schedules")
}

enum ProductionStage {
  DESIGN_CREATION
  DESIGN_REVISION
  MATERIAL_PREP
  PRINTING
  QUALITY_CHECK
  PACKAGING
  SHIPPING
}

enum ScheduleStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  DELAYED
  CANCELLED
}

// Production capacity tracking
model DailyCapacity {
  id          String @id @default(cuid())
  date        DateTime @db.Date
  employeeId  String?
  employee    Employee? @relation(fields: [employeeId], references: [id])
  
  totalHours  Float // Available hours
  bookedHours Float @default(0) // Scheduled hours
  actualHours Float @default(0) // Time actually worked
  
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([date, employeeId])
  @@map("daily_capacity")
}
```

#### 5. Advanced Material Usage Tracking
**Current State**: Basic stock levels
**Enhancement**: Job-specific material consumption and cost tracking

```prisma
model MaterialUsage {
  id          String @id @default(cuid())
  jobId       String
  job         Job @relation(fields: [jobId], references: [id])
  materialId  String
  material    Material @relation(fields: [materialId], references: [id])
  
  quantityUsed Float
  unitCost    Decimal // Cost per unit at time of use
  totalCost   Decimal // Total cost for this usage
  
  // Usage details
  usedBy      String? // Employee who used it
  usedAt      DateTime @default(now())
  notes       String?
  
  // Link to specific job item if applicable
  jobItemId   String?
  jobItem     JobItem? @relation(fields: [jobItemId], references: [id])
  
  @@map("material_usage")
}

// Automatic material calculation
model MaterialRequirement {
  id            String @id @default(cuid())
  productId     String
  product       Product @relation(fields: [productId], references: [id])
  materialId    String
  material      Material @relation(fields: [materialId], references: [id])
  decorationMethod String // "HTV", "SCREEN_PRINT", etc.
  
  quantityPer   Float // Amount needed per item
  unit          String // "inches", "grams", etc.
  setupAmount   Float @default(0) // Base amount needed regardless of quantity
  
  isActive      Boolean @default(true)
  notes         String?
  
  @@unique([productId, materialId, decorationMethod])
  @@map("material_requirements")
}
```

### Weeks 7-8: Reporting & Analytics

#### 6. Job Profitability Analysis
**Current State**: Manual cost calculation
**Enhancement**: Automated cost tracking and margin analysis

```prisma
model JobCosting {
  id          String @id @default(cuid())
  jobId       String @unique
  job         Job @relation(fields: [jobId], references: [id])
  
  // Revenue
  quotedAmount    Decimal?
  actualRevenue   Decimal?
  
  // Material costs
  materialCost    Decimal @default(0)
  materialMargin  Float? // Percentage markup on materials
  
  // Labor costs
  laborCost       Decimal @default(0)
  laborHours      Float @default(0)
  avgHourlyRate   Decimal?
  
  // Other costs
  shippingCost    Decimal @default(0)
  otherCosts      Decimal @default(0)
  
  // Calculated fields
  totalCosts      Decimal @default(0)
  grossProfit     Decimal @default(0)
  profitMargin    Float? // Percentage
  
  // Analysis
  costPerItem     Decimal?
  revenuePerItem  Decimal?
  
  calculatedAt    DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("job_costing")
}

// Time tracking for accurate labor costs
model TimeEntry {
  id          String @id @default(cuid())
  employeeId  String
  employee    Employee @relation(fields: [employeeId], references: [id])
  jobId       String?
  job         Job? @relation(fields: [jobId], references: [id])
  
  startTime   DateTime
  endTime     DateTime?
  duration    Float? // Hours, calculated from start/end
  
  activity    String // "Design", "Printing", "Setup", etc.
  description String?
  
  // Billing information
  hourlyRate  Decimal? // Rate at time of entry
  billable    Boolean @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("time_entries")
}
```

#### 7. Business Analytics Dashboard
**Current State**: No business insights
**Enhancement**: KPI dashboard with trends and alerts

```prisma
model BusinessMetric {
  id        String @id @default(cuid())
  name      String // "monthly_revenue", "avg_job_value", etc.
  category  MetricCategory
  value     Decimal
  unit      String? // "dollars", "hours", "percentage"
  period    String // "2024-01", "2024-01-15", etc.
  
  // Comparative data
  previousValue Decimal?
  targetValue   Decimal?
  variance      Float? // Percentage change
  
  calculatedAt  DateTime @default(now())
  
  @@unique([name, period])
  @@map("business_metrics")
}

enum MetricCategory {
  REVENUE
  COSTS
  PRODUCTIVITY
  CUSTOMER
  INVENTORY
}

// Automated alerts for business issues
model BusinessAlert {
  id          String @id @default(cuid())
  type        AlertType
  severity    AlertSeverity
  title       String
  message     String
  
  // Alert data
  triggerData Json? // The data that triggered the alert
  threshold   Decimal? // The threshold that was crossed
  actualValue Decimal? // The actual value
  
  // Status
  isRead      Boolean @default(false)
  isResolved  Boolean @default(false)
  resolvedAt  DateTime?
  
  createdAt   DateTime @default(now())
  
  @@map("business_alerts")
}

enum AlertType {
  LOW_INVENTORY
  HIGH_COSTS
  OVERDUE_JOBS
  CAPACITY_EXCEEDED
  PROFIT_MARGIN_LOW
}

enum AlertSeverity {
  INFO
  WARNING
  CRITICAL
}
```

## User Interface Enhancements

### Customer Portal Updates
- **Dashboard Redesign**: Modern, mobile-friendly job status overview
- **Design Approval Interface**: Side-by-side view with approval buttons and comment system
- **File Library**: Organized access to all job-related files
- **Notification Preferences**: Control over email and in-app notifications

### Admin Dashboard Additions
- **Production Calendar**: Visual scheduling with drag-and-drop
- **Capacity Planning**: Daily/weekly capacity vs demand charts
- **Cost Analysis**: Job profitability reports and trends
- **Material Dashboard**: Usage patterns and reorder alerts

### New Mobile Features
- **Mobile Time Tracking**: Simple start/stop timer for employees
- **Production Updates**: Quick status updates from shop floor
- **Photo Documentation**: Capture and attach progress photos

## Integration Points

### Email Automation
```typescript
// Automated email triggers
const emailTriggers = {
  jobStatusChange: async (job: Job, oldStatus: JobStatus) => {
    if (shouldNotifyCustomer(oldStatus, job.status)) {
      await queueCustomerNotification(job);
    }
  },
  
  designApprovalRequest: async (design: Design) => {
    await queueDesignApprovalEmail(design);
  },
  
  jobCompletion: async (job: Job) => {
    await queueCompletionNotification(job);
  }
};
```

### Accounting System Integration
- **QuickBooks Sync**: Export job costs and invoices
- **Expense Tracking**: Material purchases and labor costs
- **Tax Reporting**: Properly categorized business expenses

### Calendar Integration
- **Google Calendar**: Sync production schedule
- **Outlook Integration**: Employee schedule management
- **iCal Export**: Customer delivery dates

## Testing Strategy

### Customer Experience Testing
- [ ] Job status updates display correctly across all platforms
- [ ] Design approval workflow functions smoothly
- [ ] File downloads work reliably
- [ ] Email notifications are timely and accurate

### Production Management Testing  
- [ ] Scheduling system prevents overbooking
- [ ] Material usage calculations are accurate
- [ ] Time tracking integrates properly with costing
- [ ] Reports reflect actual business performance

### Performance Testing
- [ ] Dashboard loads quickly with large datasets
- [ ] File uploads handle various sizes and formats
- [ ] Real-time updates don't impact system performance
- [ ] Mobile interfaces remain responsive

## Success Metrics

### Customer Experience Improvements
- [ ] Customer support inquiries reduced by 30%
- [ ] Design approval time reduced from 2-3 days to 4-6 hours
- [ ] Customer satisfaction scores improve (post-implementation survey)
- [ ] 90% of customers use self-service portal features

### Operational Efficiency Gains
- [ ] Production scheduling reduces job overlap conflicts
- [ ] Material waste reduced by 15% through better tracking
- [ ] Job costing accuracy within 5% of actual costs
- [ ] Employee utilization visibility improves capacity planning

### Business Intelligence Benefits
- [ ] Monthly profitability reports automated
- [ ] Material reorder alerts prevent stockouts
- [ ] Job profitability insights guide pricing decisions
- [ ] Trend analysis identifies growth opportunities

## Configuration Foundation for Future

### Configurable Elements Added
- **Notification Templates**: Email templates can be customized per business
- **Approval Workflows**: Different approval processes for different business types
- **Production Stages**: Customizable workflow stages based on shop capabilities
- **Reporting Metrics**: KPIs can be tailored to business priorities

### Template Opportunities
- **Customer Portal Themes**: White-label ready portal design
- **Email Branding**: Configurable email templates with business branding
- **Report Formats**: Business-specific report layouts and metrics
- **Workflow Automation**: Customizable triggers and actions

## Risk Management

### Data Migration Risks
- **Backup Strategy**: Comprehensive backup before each enhancement
- **Incremental Deployment**: Roll out features gradually
- **Rollback Procedures**: Ability to disable features if issues arise

### Performance Considerations
- **Database Optimization**: Proper indexing for new queries
- **Caching Strategy**: Redis cache for frequently accessed data
- **Background Processing**: Queue system for heavy operations

### Security Enhancements
- **File Access Control**: Proper permissions for customer files
- **Audit Logging**: Track all administrative actions
- **Data Encryption**: Sensitive business data protection

Phase 2 significantly enhances the business value while maintaining the configurability foundation needed for the future product offering.