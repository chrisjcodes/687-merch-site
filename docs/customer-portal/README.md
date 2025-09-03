# Customer Portal Documentation

The customer portal provides 687 Merch clients with a comprehensive self-service interface to manage their orders, track items, and handle reordering at both job and item levels.

## Access & Authentication

- **URL**: `/portal/orders` (redirects to login if not authenticated)
- **Authentication**: Magic link authentication via NextAuth.js
- **Customer Users**: Users with `role: CUSTOMER` and linked customer records
- **Demo Account**: Available through seed data
- **Portal Theme**: Black-themed navigation distinct from admin portal

## Main Features

### 1. Order Management

**Location**: `/portal/orders`

The orders dashboard provides:
- **Active Jobs Summary**: Current orders with status tracking
- **Status Indicators**: Color-coded job statuses with visual progression
- **Order History**: Complete history with searchable/filterable interface  
- **Quick Actions**: Direct access to reorder functionality

### 2. Item-Level Management

**Location**: `/portal/items`

**My Items View**
- **Item Templates**: Reusable item configurations (e.g., "Good People Coffee Co Staff Shirts")
- **Usage Statistics**: Times ordered, total quantities, last order date
- **Multi-Select**: Choose multiple items for bulk reordering
- **Search & Filter**: Find items by name, product, or description
- **Order History**: Per-item tracking across multiple jobs

**Key Features**:
- Paginated table with sortable columns
- Item-level statistics and metrics
- Recent order status tracking
- Bulk selection for multi-item reordering

### 3. Advanced Reordering System

**Location**: `/portal/reorder`

**Multi-Item Reorder Flow**
- **Item Selection**: Choose 1 to many items from library
- **Size Configuration**: Individual size breakdown per item
- **Quantity Management**: Flexible quantity entry with totals
- **Order Notes**: Item-specific and general order notes
- **Target Dates**: Optional dispatch date specification

**Reorder Capabilities**:
- Item-level reordering across jobs
- Standard size configurations as starting points
- Individual item customization
- Bulk order submission

### 3. Job Details

**Location**: `/dashboard/jobs/[id]`

#### Comprehensive Job Information

**Job Summary**
- Job ID and creation date
- Current status with visual indicator
- Due date and estimated completion
- Total item count and quantities

**Item Details**
- Product specifications
- Quantity breakdowns by size
- Decoration specifications
- Placement information

**Order Timeline**
- Status change history
- Key milestones and dates
- Production updates
- Shipping information

### 4. Account Management

**Profile Information**
- Customer contact details
- Company information
- Shipping addresses
- Communication preferences

**Order History**
- Complete history of all orders
- Searchable and filterable
- Download order summaries
- Reorder functionality (future feature)

## User Interface

### Design System

**Customer-Focused Design**
- Clean, intuitive interface
- Mobile-first responsive design
- Accessibility compliance
- Professional branding consistent with 687 Merch

**Status Visualization**
- Color-coded status indicators
- Progress bars for job stages
- Clear typography hierarchy
- Consistent iconography

### Responsive Design

**Mobile Optimization**
- Touch-friendly interface
- Optimized for phones and tablets
- Fast loading on mobile networks
- Thumb-friendly navigation

**Desktop Experience**
- Full-width layouts on large screens
- Enhanced data tables
- Keyboard navigation support
- Multi-column layouts

## Customer Experience Features

### 1. Simplified Job Tracking

**At-a-Glance Status**
```
🟡 QUEUED     - Your order is received and queued for review
🔵 APPROVED   - Your order has been approved and is ready for production
🟠 IN_PROD    - Your order is currently being produced
🟢 READY      - Your order is complete and ready for pickup/shipping
📦 SHIPPED    - Your order has been shipped
✅ DELIVERED  - Your order has been delivered
```

**Status Notifications**
- Email notifications for status changes
- In-app notification system
- SMS notifications (future feature)

### 2. Order Details

**Customer-Friendly Information**
- Plain language descriptions
- Visual representations of products
- Clear quantity and sizing information
- Estimated delivery dates

**Design File Access**
- View uploaded design files
- Download final artwork (when available)
- Proof review and approval (future feature)

### 3. Communication Tools

**Direct Messaging** (Future Feature)
- Chat with production team
- Ask questions about orders
- Request changes or updates
- File sharing capabilities

**Order Notes**
- View notes from production team
- Add customer comments
- Special instructions visibility

## Technical Implementation

### Authentication Flow

**Magic Link Process**
1. Customer enters email on login page
2. System sends magic link to email
3. Customer clicks link to authenticate
4. Redirected to dashboard with session

**Session Management**
- Secure session tokens
- Auto-renewal for active users
- Graceful session expiration
- Cross-device compatibility

### Data Access Control

**Customer Data Isolation**
```typescript
// Only jobs for authenticated customer
const jobs = await prisma.job.findMany({
  where: {
    customerId: session.user.customerId
  },
  include: {
    items: true,
    events: true
  }
});
```

**Role-Based Access**
- Customers see only their own data
- No admin functionality exposure
- Secure API endpoints
- Proper error handling for unauthorized access

### API Endpoints

**Customer-Specific Routes**
- `GET /api/customer/jobs` - List customer's jobs
- `GET /api/customer/jobs/[id]` - Get job details
- `GET /api/customer/profile` - Get customer profile
- `PATCH /api/customer/profile` - Update profile

## Dashboard Components

### 1. Job Status Cards

**Visual Design**
```tsx
<JobStatusCard
  jobId="JOB123456"
  status="IN_PROD"
  itemCount={3}
  totalQty={150}
  dueDate="2024-01-15"
  progress={60}
/>
```

**Information Hierarchy**
- Job identifier (last 8 characters)
- Current status with icon
- Progress indicator
- Key metrics (items, quantities)
- Important dates

### 2. Timeline Component

**Status History**
- Chronological list of status changes
- Date and time stamps
- Duration in each status
- Next expected status

**Visual Timeline**
- Connected dots for completed steps
- Current step highlighting
- Future step preview
- Estimated completion times

### 3. Order Summary

**Item Breakdown**
- Product images (when available)
- Specifications and details
- Quantity by size
- Decoration information

**Cost Information** (Future Feature)
- Item-level pricing
- Total order value
- Payment status
- Invoice access

## Customer Workflows

### 1. First-Time User Experience

**Account Setup**
1. Receive magic link invitation
2. Click link to access portal
3. Review profile information
4. Explore dashboard features
5. View existing orders

**Onboarding Tour**
- Feature highlights
- Navigation guidance
- Key action items
- Help resources

### 2. Regular Usage Patterns

**Daily Check-ins**
1. Login via magic link
2. Review dashboard for updates
3. Check job status changes
4. View any new communications

**Detailed Review**
1. Access specific job details
2. Review item specifications
3. Check timeline and progress
4. Download files if needed

### 3. Order Lifecycle Tracking

**New Order**
- Notification of order receipt
- Initial review and approval
- Production scheduling

**Production Phase**
- Status updates during production
- Quality checkpoints
- Completion notifications

**Delivery Phase**
- Shipping notifications
- Tracking information
- Delivery confirmation

## Mobile Experience

### Responsive Breakpoints

**Mobile (< 768px)**
- Single column layouts
- Stacked information cards
- Touch-optimized controls
- Simplified navigation

**Tablet (768px - 1024px)**
- Two-column layouts where appropriate
- Enhanced touch targets
- Optimized for landscape/portrait

**Desktop (> 1024px)**
- Multi-column layouts
- Enhanced data tables
- Hover interactions
- Keyboard shortcuts

### Progressive Web App Features

**App-like Experience**
- Installable on mobile devices
- Offline capability for cached data
- Push notifications
- Native app feel

## Security & Privacy

### Data Protection

**Customer Data Privacy**
- Customers see only their own data
- No cross-customer information leakage
- Secure data transmission
- Regular security audits

**Authentication Security**
- Time-limited magic links
- Secure session management
- Cross-site request forgery protection
- Content security policy enforcement

## Future Enhancements

### Planned Features

**Enhanced Communication**
- In-app messaging system
- File sharing capabilities
- Proof approval workflow
- Change request system

**Order Management**
- Reorder functionality
- Order modification requests
- Bulk order capabilities
- Template orders

**Reporting & Analytics**
- Order history reports
- Spending analytics
- Production time insights
- Custom reporting

**Mobile App**
- Native iOS/Android applications
- Push notifications
- Offline functionality
- Enhanced mobile experience

### Integration Opportunities

**Third-Party Services**
- Shipping carrier integration
- Payment processing
- Inventory management
- Customer relationship management

**Automation Features**
- Automated status notifications
- Predictive delivery dates
- Intelligent reorder suggestions
- Automated invoicing

## Troubleshooting

### Common Customer Issues

**Login Problems**
- Check email spam/junk folders for magic links
- Verify correct email address entry
- Clear browser cache and cookies
- Try incognito/private browsing mode

**Missing Orders**
- Verify customer account linkage in admin
- Check for multiple email addresses
- Confirm order assignment to correct customer

**Performance Issues**
- Check internet connection
- Try different browsers
- Clear browser cache
- Report persistent issues to support

### Support Resources

**Help Documentation**
- Getting started guide
- Feature explanations
- FAQ section
- Video tutorials

**Contact Methods**
- Email support
- Phone support during business hours
- Live chat (future feature)
- Help ticket system

## Analytics & Insights

### Customer Behavior Tracking

**Usage Metrics**
- Login frequency
- Feature utilization
- Time spent in portal
- Most viewed sections

**Order Patterns**
- Order frequency
- Seasonal trends
- Product preferences
- Size distributions

### Performance Monitoring

**Technical Metrics**
- Page load times
- Error rates
- API response times
- Mobile vs desktop usage

**User Experience Metrics**
- Task completion rates
- Feature adoption
- Customer satisfaction scores
- Support ticket volume

This customer portal provides a professional, user-friendly interface that enhances the customer experience while reducing administrative overhead for the 687 Merch team.