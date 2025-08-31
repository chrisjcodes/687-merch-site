import React from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { recentWork } from '@/lib/data';
import AppHeader from '@/app/(site)/_components/AppHeader';
import AppFooter from '@/app/(site)/_components/AppFooter';

interface WorkDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return recentWork.map((work) => ({
    slug: work.slug,
  }));
}

export async function generateMetadata({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const work = recentWork.find((item) => item.slug === slug);
  
  if (!work) {
    return {
      title: 'Work Not Found | 687 Merch',
    };
  }

  return {
    title: `${work.title} | 687 Merch`,
    description: work.subtitle || `Check out our work on ${work.title}`,
    openGraph: {
      title: work.title,
      description: work.subtitle || `Check out our work on ${work.title}`,
      images: [work.thumbnail],
    },
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const work = recentWork.find((item) => item.slug === slug);

  if (!work) {
    notFound();
  }

  const scrollToContact = () => {
    // Scroll to contact section on main page
    window.location.href = '/#contact';
  };

  return (
    <>
      <AppHeader />
      
      <Box sx={{ pt: 8 }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            height: '60vh',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: '#0f0f0f',
          }}
        >
          <Image
            src={work.images[0] || work.thumbnail}
            alt={work.title}
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            priority
          />
          
          <Box className="hero-overlay" />
          
          <Container
            maxWidth="lg"
            sx={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                lineHeight: 1.1,
              }}
            >
              {work.title}
            </Typography>
            
            {work.subtitle && (
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1.2rem',
                  opacity: 0.9,
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                {work.subtitle}
              </Typography>
            )}
          </Container>
        </Box>

        {/* Content Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} md={8}>
              {/* Image Gallery */}
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    mb: 4,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  Gallery
                </Typography>
                
                <Grid container spacing={3}>
                  {work.images.map((image, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        sx={{
                          position: 'relative',
                          aspectRatio: '1/1',
                          borderRadius: 2,
                          overflow: 'hidden',
                          backgroundColor: '#1a1a1a',
                        }}
                      >
                        <Image
                          src={image}
                          alt={`${work.title} - Image ${index + 1}`}
                          fill
                          style={{
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              {/* Project Details */}
              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: 3,
                  p: 4,
                  mb: 4,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    mb: 3,
                  }}
                >
                  Project Details
                </Typography>
                
                {work.year && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Year
                    </Typography>
                    <Typography variant="body1">{work.year}</Typography>
                  </Box>
                )}
                
                {work.tags && work.tags.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle2" 
                      color="text.secondary" 
                      sx={{ mb: 1 }}
                    >
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {work.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: 'primary.main',
                            color: '#000',
                            fontWeight: 600,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* CTA Section */}
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  color: '#000',
                  borderRadius: 3,
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    mb: 2,
                  }}
                >
                  Like This Project?
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Request a similar project and let&apos;s bring your vision to life.
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  onClick={scrollToContact}
                  sx={{
                    backgroundColor: '#000',
                    color: 'primary.main',
                    px: 3,
                    py: 1.5,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Back to Work */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Link href="/#work" passHref>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  '&:hover': {
                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                Back to All Work
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      <AppFooter />
    </>
  );
}