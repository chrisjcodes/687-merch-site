'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import AppHeader from './_components/AppHeader';
import Hero from './_components/Hero';
import RecentWork from './_components/RecentWork';
import Partners from './_components/Partners';
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

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  const handleLightboxNavigate = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Box>
      <AppHeader />
      
      <main>
        <Hero />
        <RecentWork onItemClick={handleWorkItemClick} />
        <Partners />
        <ContactForm />
      </main>

      <AppFooter />

      <Lightbox
        open={lightboxOpen}
        onClose={handleLightboxClose}
        images={lightboxImages}
        currentIndex={currentImageIndex}
        onNavigate={handleLightboxNavigate}
      />
    </Box>
  );
}
