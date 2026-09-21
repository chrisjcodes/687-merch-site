'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import WaveDivider from './WaveDivider';
import Link from 'next/link';

const problems = [
  {
    who: 'Artists & bands',
    body: 'You\'re not a merch company. You\'re an artist. We figure out how to get quality merch in front of your audience without making it your second job — whether that\'s transfer sheets you apply tour by tour, or a van that shows up and handles everything the night of.',
  },
  {
    who: 'Businesses & brands',
    body: 'Brand merch is only worth something if people actually wear it. We help you get the right items, in the right quantities, without ending up with a closet full of shirts nobody wanted. We also work with corporate accounts, licensed properties, and brand guidelines.',
  },
  {
    who: 'Events & activations',
    body: 'Event merch is a completely different problem than standard merch. One window, unpredictable demand, zero room for leftover inventory. That applies whether you\'re a promoter running a concert or a small business with a grand opening — if you\'re tying merch to a moment, our mobile model is built for exactly that. We put our own resources on the line so you don\'t have to.',
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function MerchPartner() {
  return (
    <>
      <WaveDivider fromColor="#0f0f0f" toColor="#fff" height={80} sx={{ mt: '-2px' }} />

      <Box sx={{ py: { xs: 10, md: 14 }, backgroundColor: '#fff', color: '#000' }}>
        <Container maxWidth="lg">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mb: { xs: 8, md: 12 } }}>
              <Typography
                variant="overline"
                sx={{ color: '#bbb', letterSpacing: '0.15em', fontSize: '0.72rem', fontWeight: 700, display: 'block', mb: 2 }}
              >
                The 687 Difference
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{ color: '#000', mb: 3, lineHeight: 1.05, maxWidth: 680 }}
              >
                Anyone can print a T-shirt.{' '}
                <Box component="span" sx={{ color: '#bbb' }}>
                  We help you solve the actual problem.
                </Box>
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#666', maxWidth: 600, lineHeight: 1.8, fontSize: '1.05rem' }}
              >
                Merch looks simple until it isn&apos;t. Inventory risk, uncertain demand, design
                prep, licensing, event logistics — there&apos;s a lot that can go sideways between
                &ldquo;I want merch&rdquo; and &ldquo;people are wearing it.&rdquo; We work through
                that with you. Artists, businesses, event organizers — the situation is always
                different and we adapt to it.
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              {problems.map((p) => (
                <motion.div key={p.who} variants={cardVariant}>
                  <Box
                    sx={{
                      height: '100%',
                      p: { xs: 4, md: 5 },
                      borderRadius: 3,
                      border: '1px solid #e8e8e8',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#000',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        display: 'block',
                        mb: 2,
                      }}
                    >
                      {p.who}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#555', lineHeight: 1.8, fontSize: '0.92rem' }}
                    >
                      {p.body}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box sx={{ mt: 8, pt: 6, borderTop: '1px solid #eee' }}>
              <Typography
                variant="body1"
                sx={{ color: '#999', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 600 }}
              >
                We also offer{' '}
                <Box component="span" sx={{ fontWeight: 700, color: '#000' }}>
                  design services
                </Box>{' '}
                with any approach — including designing for other printers on items we don&apos;t provide.
                If you have a licensed property, we&apos;re experienced with brand guidelines, artwork
                approvals, and royalty handling. Bring us the problem first. We&apos;ll tell you honestly
                whether we&apos;re the right fit.{' '}
                <Link href="/faq" style={{ textDecoration: 'none' }}>
                  <Box component="span" sx={{ fontWeight: 700, color: '#000', '&:hover': { opacity: 0.55 }, transition: 'opacity 0.15s' }}>
                    Have more questions? See our FAQ →
                  </Box>
                </Link>
              </Typography>
            </Box>
          </motion.div>

        </Container>
      </Box>

      <WaveDivider fromColor="#fff" toColor="#0f0f0f" height={80} />
    </>
  );
}
