# Public Site Documentation

The public-facing website serves as the marketing front for 687 Merch, showcasing services, company information, and providing entry points to the customer portal and contact forms.

## Site Structure

### Main Pages

**Homepage** (`/`)
- Hero section with company branding
- Services overview
- Call-to-action buttons
- Customer testimonials/portfolio
- Contact information

**About Page** (`/about`)
- Company history and mission
- Team information
- Quality and process overview
- Certifications and partnerships

**Services Page** (`/services`)
- Detailed service offerings
- Custom merchandise categories
- Decoration method explanations
- Pricing information (if public)

**Contact Page** (`/contact`)
- Contact form with email integration
- Business hours and location
- Phone and email contact information
- Map integration (if applicable)

### Utility Pages

**Login/Authentication** (`/login`)
- Magic link authentication form
- Customer portal access
- Admin panel access
- Password-free authentication system

**Dashboard Redirect** (`/dashboard-redirect`)
- Handles role-based routing after authentication
- Redirects customers to customer portal
- Redirects admins to admin panel

## Technical Architecture

### Next.js App Router Structure

```
src/app/
├── page.tsx                 # Homepage
├── about/
│   └── page.tsx            # About page
├── services/
│   └── page.tsx            # Services page
├── contact/
│   └── page.tsx            # Contact page with form
├── login/
│   └── page.tsx            # Authentication page
├── dashboard-redirect/
│   └── page.tsx            # Role-based routing
└── globals.css             # Global styles
```

### Styling System

**Material-UI Integration**
- Consistent component library
- Theme customization for 687 Merch branding
- Responsive design system
- Professional color palette

**Custom Theming**
```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // 687 Merch blue
    },
    secondary: {
      main: '#dc004e', // Accent color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

### SEO Optimization

**Metadata Configuration**
```typescript
export const metadata: Metadata = {
  title: '687 Merch - Custom Merchandise Solutions',
  description: 'Professional custom merchandise and apparel decoration services.',
  keywords: 'custom merchandise, apparel decoration, screen printing, embroidery',
  openGraph: {
    title: '687 Merch',
    description: 'Professional custom merchandise solutions',
    images: ['/og-image.jpg'],
  },
};
```

**Search Engine Features**
- Proper heading hierarchy (H1, H2, H3)
- Semantic HTML structure
- Alt text for all images
- Meta descriptions for each page
- Schema.org structured data

## Content Management

### Static Content

**Homepage Content**
- Company value proposition
- Service highlights
- Portfolio showcase
- Customer testimonials
- Contact information

**About Page Content**
- Company story and mission
- Team member profiles
- Process and quality information
- Industry experience highlights

### Dynamic Content Integration

**Portfolio Items**
- Database integration for showcasing completed work
- Category filtering (apparel, accessories, promotional items)
- Image galleries with optimization
- Client testimonials and case studies

**Service Listings**
- Detailed service descriptions
- Pricing information (if applicable)
- Process explanations
- Decoration method details

## Contact System

### Contact Form Implementation

**Form Fields**
```typescript
interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  serviceInterest?: string;
  urgency?: 'normal' | 'urgent';
}
```

**Email Integration**
- SMTP integration via Nodemailer
- Automated response to form submissions
- Internal notification system
- Form validation and spam protection

### API Endpoint

**Contact Form Handler** (`/api/contact`)
```typescript
export async function POST(request: NextRequest) {
  const formData = await request.json();
  
  // Validate form data
  // Send email notifications
  // Store inquiry in database (optional)
  // Return success/error response
}
```

## Authentication Integration

### Magic Link System

**Login Process**
1. User enters email address
2. System generates secure magic link
3. Email sent with authentication link
4. User clicks link to authenticate
5. Role-based redirect to appropriate portal

**Security Features**
- Time-limited magic links (15 minutes)
- One-time use tokens
- Secure token generation
- Rate limiting on email sending

### Role-Based Routing

**Dashboard Redirect Logic**
```typescript
export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }
  
  // Route based on user role
  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}
```

## Performance Optimization

### Image Optimization

**Next.js Image Component**
- Automatic image optimization
- Responsive image delivery
- WebP format conversion
- Lazy loading implementation

**Image Assets**
```tsx
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="687 Merch custom merchandise"
  width={1200}
  height={600}
  priority={true}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Code Splitting

**Automatic Code Splitting**
- Page-level code splitting with App Router
- Component-level lazy loading
- Dynamic imports for heavy components
- Optimized bundle sizes

### Caching Strategy

**Static Asset Caching**
- Long-term caching for images and fonts
- Versioned asset URLs
- CDN integration via Vercel
- Browser caching optimization

## Mobile Experience

### Responsive Design

**Mobile-First Approach**
- Touch-friendly navigation
- Optimized form inputs
- Fast loading on mobile networks
- Thumb-friendly button sizes

**Breakpoint Strategy**
```css
/* Mobile First */
@media (min-width: 600px) { /* Tablet */ }
@media (min-width: 960px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large Desktop */ }
```

### Progressive Web App Features

**PWA Configuration**
- Service worker for offline functionality
- App manifest for installation
- Fast loading and caching
- Native app-like experience

## Analytics & Tracking

### Performance Monitoring

**Vercel Analytics Integration**
- Page view tracking
- Performance metrics
- Core Web Vitals monitoring
- User experience insights

**Vercel Speed Insights**
- Real user performance data
- Loading time analysis
- Performance optimization recommendations
- Geographic performance insights

### Conversion Tracking

**Goal Tracking**
- Contact form submissions
- Portal sign-up conversions
- Quote request tracking
- Customer journey analysis

## Content Strategy

### Brand Messaging

**Value Proposition**
- Professional custom merchandise solutions
- Quality craftsmanship and attention to detail
- Customer service excellence
- Competitive pricing and fast turnaround

**Service Differentiation**
- Advanced decoration techniques
- Custom design capabilities
- Small and large quantity orders
- Industry expertise and consultation

### Call-to-Action Strategy

**Primary CTAs**
- "Get a Quote" - Contact form
- "View Portfolio" - Work showcase
- "Customer Portal" - Account access
- "Contact Us" - Direct communication

**Secondary CTAs**
- Social media links
- Newsletter signup
- Phone contact
- Email contact

## SEO & Marketing

### Search Engine Optimization

**On-Page SEO**
- Optimized page titles and descriptions
- Header tag hierarchy
- Internal linking strategy
- Image alt text optimization

**Local SEO** (if applicable)
- Google My Business integration
- Local business schema markup
- Location-based keywords
- Customer review integration

### Content Marketing

**Blog/News Section** (Future Feature)
- Industry insights and trends
- Company news and updates
- Process explanations and tutorials
- Customer success stories

**Social Proof**
- Customer testimonials
- Portfolio showcase
- Industry certifications
- Award recognition

## Accessibility

### WCAG Compliance

**Accessibility Features**
- Keyboard navigation support
- Screen reader compatibility
- High contrast color ratios
- Alternative text for images

**Testing Tools**
- Automated accessibility testing
- Manual keyboard testing
- Screen reader testing
- Color contrast validation

## Maintenance & Updates

### Content Management

**Static Content Updates**
- Direct code updates for permanent content
- Version control for content changes
- Review process for content updates
- Staging environment for testing

**Dynamic Content** (Future)
- CMS integration for easy updates
- Content scheduling capabilities
- Multi-user content management
- Content approval workflows

### Performance Monitoring

**Site Health Checks**
- Uptime monitoring
- Performance regression detection
- Broken link checking
- Form submission testing

### Security Updates

**Regular Security Maintenance**
- Dependency updates
- Security patch applications
- SSL certificate management
- Security header configuration

## Future Enhancements

### Planned Features

**Enhanced Portfolio**
- Interactive galleries
- Project case studies
- Customer story videos
- Before/after showcases

**Quote System**
- Online quote calculator
- Instant pricing estimates
- Project specification forms
- Automated quote generation

**Content Management System**
- Admin interface for content updates
- Blog/news management
- Portfolio management
- Service page management

**E-commerce Integration** (Long-term)
- Online ordering system
- Product catalog
- Shopping cart functionality
- Payment processing

### Technical Improvements

**Advanced Analytics**
- Heat map tracking
- User behavior analysis
- A/B testing framework
- Conversion optimization

**Enhanced Performance**
- Advanced caching strategies
- Edge computing optimization
- Image optimization improvements
- Bundle size optimization

## Deployment & Hosting

### Vercel Platform

**Deployment Pipeline**
- Automatic deployments from Git
- Preview deployments for branches
- Production deployment protection
- Environment variable management

**Performance Benefits**
- Global CDN distribution
- Automatic HTTPS
- Edge functions support
- Image optimization

### Custom Domain

**Domain Configuration**
- Custom domain setup (if applicable)
- SSL certificate provisioning
- DNS configuration
- Redirect management

This public site serves as the professional face of 687 Merch, converting visitors into customers while providing seamless access to the customer portal system.