'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import AppHeader from './_components/AppHeader';
import Hero from './_components/Hero';
import Services from './_components/Services';
import PartnerDifference from './_components/PartnerDifference';
import CaseStudies from './_components/CaseStudies';
import ContactForm from './_components/ContactForm';
import AppFooter from './_components/AppFooter';
import Lightbox from './_components/Lightbox';
import { recentWork } from '@/lib/data';

export default function Home() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleWorkItemClick = (item: typeof recentWork[0]) => {
    setLightboxImages(item.images);
    setCurrentImageIndex(0);
    setLightboxOpen(true);
  };

  return (
    <Box>
      <AppHeader />

      <main>
        <Hero />
        <Services />
        <PartnerDifference />
        <CaseStudies onItemClick={handleWorkItemClick} />
        <ContactForm />
      </main>

      <AppFooter />

      <Lightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={currentImageIndex}
        onNavigate={(index: number) => setCurrentImageIndex(index)}
      />
    </Box>
  );
}
