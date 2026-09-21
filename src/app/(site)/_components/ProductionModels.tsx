'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Model {
  label: string;
  headline: string;
  sub: string;
  benefits: string[];
  forList: string[];
  notFor: string[];
  pitchHref?: string;
  pitchLabel?: string;
  accent: boolean;
}

const MODELS: Model[] = [
  {
    label: 'Traditional Production',
    headline: 'You order. We print. You own it.',
    sub: 'The model most people know. Pick your garments and quantities upfront, we print and deliver everything. Lowest per-unit cost at volume.',
    benefits: [
      'Best per-unit cost when you know your quantities',
      'Full ownership — sell however, wherever, whenever you want',
      'Reorder the same design without new setup fees',
    ],
    forList: [
      'Established brands with consistent, predictable demand',
      'Retail or online stores with ongoing inventory',
      'Bulk runs where you\'re confident in what will move',
    ],
    notFor: [
      'First-time runs where you\'re not sure how much will sell',
      'Event-specific merch where unsold stock becomes your problem',
    ],
    accent: false,
  },
  {
    label: 'Flexible Merch Production',
    headline: 'Print once. Apply when you\'re ready.',
    sub: 'We print your design to transfer sheets using the same screen printing process. You get finished transfers you can apply to any blank, on your timeline.',
    benefits: [
      'One print run — multiple garment styles, sizes, and colorways',
      'Apply transfers as you need them, not all at once',
      'Reorder garments without reordering artwork or screens',
    ],
    forList: [
      'Bands, artists, and brands running multiple events per season',
      'Anyone testing a new design before committing to finished goods',
      'Ongoing programs where you want to rotate styles over time',
    ],
    notFor: [
      'Situations where you need finished garments delivered immediately',
      'One-time runs with no plans to reuse the design',
    ],
    pitchHref: '/flex-catalog',
    pitchLabel: 'See how the numbers work →',
    accent: false,
  },
  {
    label: 'Mobile Merch',
    headline: 'We show up. You earn.',
    sub: 'We bring the van, the press, the staff, and the blanks. We print live at your event, return your deposit from sales, and split the upside with you.',
    benefits: [
      'Zero inventory risk — we take unsold blanks back',
      'You earn on high demand instead of just paying for a printer',
      'Live production creates an experience, not just a merch table',
    ],
    forList: [
      'Event organizers and promoters who want merch without the headache',
      'Exclusive drops and limited-edition runs tied to a specific moment',
      'Venues, festivals, and brand activations with strong foot traffic',
    ],
    notFor: [
      'Events where you want to control 100% of the sales operation yourself',
      'Situations where items need to be available before or long after the event',
    ],
    pitchHref: '/mobile-experience',
    pitchLabel: 'See how Mobile Merch works →',
    accent: true,
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProductionModels() {
  return (
    <Box sx={{ py: { xs: 10, md: 14 }, backgroundColor: '#0f0f0f' }}>
      <Container maxWidth="lg">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: { xs: 8, md: 10 }, textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{ color: '#f2bf00', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.72rem', fontWeight: 700, display: 'block', mb: 2 }}
            >
              Three models. One right fit.
            </Typography>
            <Typography variant="h2" component="h2" sx={{ color: '#fff', mb: 3 }}>
              Find yours.
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', maxWidth: 480, mx: 'auto', lineHeight: 1.75 }}>
              Each model is built for a different situation. Here&apos;s what makes them different — and who each one is actually for.
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {MODELS.map((model) => (
              <motion.div key={model.label} variants={cardVariant}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: model.accent ? '#f2bf00' : '#1e1e1e',
                  }}
                >
                  {/* Left: overview */}
                  <Box
                    sx={{
                      p: { xs: 4, md: 5 },
                      backgroundColor: model.accent ? '#111' : '#0a0a0a',
                      borderRight: { md: '1px solid #1e1e1e' },
                      borderBottom: { xs: '1px solid #1e1e1e', md: 'none' },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: model.accent ? '#f2bf00' : '#555', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.7rem', fontWeight: 700, display: 'block', mb: 1.5 }}
                    >
                      {model.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-anton), "Anton", sans-serif',
                        fontSize: { xs: '1.6rem', md: '1.75rem' },
                        lineHeight: 1.1,
                        color: '#fff',
                        mb: 2.5,
                      }}
                    >
                      {model.headline}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#777', lineHeight: 1.8, fontSize: '0.88rem' }}>
                      {model.sub}
                    </Typography>
                    {model.pitchHref && (
                      <Box sx={{ mt: 3 }}>
                        <Link href={model.pitchHref} style={{ textDecoration: 'none' }}>
                          <Typography
                            sx={{
                              color: '#f2bf00',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              '&:hover': { opacity: 0.75 },
                              transition: 'opacity 0.15s ease',
                            }}
                          >
                            {model.pitchLabel}
                          </Typography>
                        </Link>
                      </Box>
                    )}
                  </Box>

                  {/* Middle: good for */}
                  <Box
                    sx={{
                      p: { xs: 4, md: 5 },
                      backgroundColor: model.accent ? 'rgba(242,191,0,0.03)' : '#0f0f0f',
                      borderRight: { md: '1px solid #1e1e1e' },
                      borderBottom: { xs: '1px solid #1e1e1e', md: 'none' },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.68rem', fontWeight: 700, display: 'block', mb: 2.5 }}
                    >
                      Good fit if you—
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {model.forList.map((item, i) => (
                        <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Typography sx={{ color: '#4caf50', fontSize: '0.8rem', lineHeight: 1, mt: '3px', flexShrink: 0 }}>✓</Typography>
                          <Typography variant="body2" sx={{ color: '#bbb', lineHeight: 1.65, fontSize: '0.88rem' }}>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Right: not for */}
                  <Box
                    sx={{
                      p: { xs: 4, md: 5 },
                      backgroundColor: '#0a0a0a',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.68rem', fontWeight: 700, display: 'block', mb: 2.5 }}
                    >
                      Probably not if you—
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {model.notFor.map((item, i) => (
                        <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Typography sx={{ color: '#555', fontSize: '0.8rem', lineHeight: 1, mt: '3px', flexShrink: 0 }}>—</Typography>
                          <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.65, fontSize: '0.88rem' }}>
                            {item}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Benefits tucked here */}
                    <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #1a1a1a' }}>
                      <Typography
                        variant="caption"
                        sx={{ color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.68rem', fontWeight: 700, display: 'block', mb: 2 }}
                      >
                        What you get
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {model.benefits.map((b, i) => (
                          <Typography key={i} variant="body2" sx={{ color: '#555', lineHeight: 1.6, fontSize: '0.85rem' }}>
                            {b}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
}
