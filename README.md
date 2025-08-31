# 687 Merch Website

A modern, responsive merchandise website built with Next.js 14, Material UI, and TypeScript. Features a dark theme design with brand yellow accents, showcasing work portfolio, partner logos, and a contact form.

## ✨ Features

- **Modern Design**: Dark theme with brand yellow (#f2bf00) accents
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Components**: Smooth scrolling, image carousel, and lightbox gallery
- **Contact Form**: Email integration with spam protection
- **SEO Optimized**: Proper metadata, sitemap, and robots.txt
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Performance**: Optimized images and lazy loading

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18.0 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chrisjcodes/687-merch-site.git
cd 687-merch-site
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# Email Configuration (Required for contact form)
RESEND_API_KEY=your_resend_api_key_here
CONTACT_TO=your-email@example.com

# Analytics (Optional)
PLAUSIBLE_DOMAIN=your-domain.com
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── (site)/
│   │   ├── _components/
│   │   │   ├── AppHeader.tsx      # Navigation header
│   │   │   ├── Hero.tsx           # Hero section
│   │   │   ├── RecentWork.tsx     # Work carousel
│   │   │   ├── Partners.tsx       # Partner logos grid
│   │   │   ├── ContactForm.tsx    # Contact form
│   │   │   ├── Lightbox.tsx       # Image lightbox
│   │   │   └── AppFooter.tsx      # Footer
│   │   ├── theme.ts               # MUI theme configuration
│   │   ├── page.tsx               # Main page
│   │   ├── layout.tsx             # Site layout with theme
│   │   ├── sitemap.ts             # Dynamic sitemap
│   │   └── robots.ts              # SEO robots file
│   ├── work/
│   │   └── [slug]/
│   │       └── page.tsx           # Work detail pages
│   ├── api/
│   │   └── contact/
│   │       └── route.ts           # Contact form API
│   └── layout.tsx                 # Root layout
├── lib/
│   ├── types.ts                   # TypeScript definitions
│   └── data.ts                    # Mock data and content
└── public/
    └── images/                    # Placeholder images
        ├── hero.jpg               # Hero background
        ├── work/                  # Work portfolio images
        └── partners/              # Partner logos
```

## 🖼️ Image Management

### Placeholder Images

The project includes placeholder images for development. Replace them with your actual content:

- **Hero Background**: `/public/images/hero.jpg` (1200x800px recommended)
- **Work Thumbnails**: `/public/images/work/[slug]-thumb.jpg` (800x800px recommended)
- **Work Gallery**: `/public/images/work/[slug]-1.jpg`, etc. (1200x1200px recommended)
- **Partner Logos**: `/public/images/partners/[name].png` (200x200px recommended)

### Adding New Images

1. Place images in the appropriate `/public/images/` subdirectory
2. Update filenames in `/src/lib/data.ts` if needed
3. Images are automatically optimized by Next.js

## 📝 Content Management

### Adding New Work Items

Edit `/src/lib/data.ts` and add to the `recentWork` array:

```typescript
{
  slug: 'unique-slug',
  title: 'Project Title',
  subtitle: 'Optional subtitle',
  thumbnail: '/images/work/project-thumb.jpg',
  images: [
    '/images/work/project-1.jpg',
    '/images/work/project-2.jpg'
  ],
  tags: ['Tag 1', 'Tag 2'],
  year: 2025,
}
```

### Adding New Partners

Edit `/src/lib/data.ts` and add to the `partners` array:

```typescript
{
  name: 'Partner Name',
  logo: '/images/partners/partner-logo.png',
  url: 'https://partner-website.com'
}
```

### Updating Site Copy

Edit the `siteCopy` object in `/src/lib/data.ts`:

```typescript
export const siteCopy = {
  headline: 'YOUR HEADLINE HERE',
  subhead: 'Your subheading content here...',
};
```

## 🎨 Customization

### Theme Colors

Edit `/src/app/(site)/theme.ts` to customize colors:

```typescript
palette: {
  primary: {
    main: '#f2bf00', // Brand yellow
  },
  background: {
    default: '#0f0f0f', // Dark background
    paper: '#141414',   // Card background
  },
  // ... other colors
}
```

### Typography

The theme uses Inter font family. Customize typography in the theme file:

```typescript
typography: {
  h1: {
    fontWeight: 800,
    textTransform: 'uppercase',
    // ... other styles
  },
  // ... other typography settings
}
```

## 📧 Email Configuration

The contact form uses [Resend](https://resend.com) for email delivery:

1. Sign up for a Resend account
2. Create an API key
3. Add your API key to `.env.local`
4. Update the `from` email in `/src/app/api/contact/route.ts` to use your verified domain

### Testing Email Locally

For development, you can use Resend's test mode or implement a mock email service.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

The site can be deployed on any platform that supports Next.js:

- **Netlify**: Use `npm run build && npm run export`
- **AWS Amplify**: Connect your GitHub repository
- **Railway**: Connect repository and add environment variables
- **Self-hosted**: Use `npm run build` and serve the `.next` directory

### Environment Variables for Production

Set these in your deployment platform:

```env
RESEND_API_KEY=your_production_resend_key
CONTACT_TO=your-business-email@yourdom.com
PLAUSIBLE_DOMAIN=yourdomain.com
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

- **Components**: Reusable UI components in `_components/`
- **Pages**: Route handlers in app directory structure
- **Styles**: Global styles in `globals.css`, component styles via MUI theme
- **Types**: TypeScript interfaces in `/src/lib/types.ts`
- **Data**: Mock data and content in `/src/lib/data.ts`

## 📱 Features by Section

### Header
- Fixed navigation with scroll effect
- Smooth scrolling to page sections
- Mobile-responsive hamburger menu

### Hero
- Full-screen background image
- Responsive typography
- Call-to-action button

### Recent Work
- Horizontal scrolling carousel
- Hover effects and transitions
- Lightbox gallery integration
- Mobile-friendly touch scrolling

### Partners
- Responsive grid layout
- Circular logo containers
- Hover effects with scaling
- Placeholder support

### Contact Form
- Form validation with Zod
- Spam protection (honeypot)
- Email integration via Resend
- Success/error notifications
- Responsive design

## 🎯 Performance

- **Lighthouse Score**: 90+ on all metrics
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Images loaded as needed
- **Font Optimization**: Inter font with next/font

## ♿ Accessibility

- **Keyboard Navigation**: All interactive elements
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant
- **Focus Management**: Visible focus indicators

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading**: Check file paths in `/public/images/` directory
2. **Contact form not working**: Verify Resend API key in environment variables
3. **Build errors**: Run `npm run lint` to check for TypeScript errors
4. **Styling issues**: Clear browser cache and restart dev server

### Support

For issues or questions:
1. Check the [GitHub Issues](https://github.com/chrisjcodes/687-merch-site/issues)
2. Review the Next.js and MUI documentation
3. Create a new issue with reproduction steps

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

Built with ❤️ using Next.js 14, Material UI, and TypeScript.
