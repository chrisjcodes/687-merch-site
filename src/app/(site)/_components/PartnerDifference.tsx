'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion, type Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12 },
  }),
};

const steps = [
  {
    number: '01',
    label: 'You pay for your screen printing',
    detail: 'We screen print your artwork onto transfer sheets rather than directly onto garments—so the prints can be applied to any blank, at any time. You own them outright, leftovers and all.',
  },
  {
    number: '02',
    label: 'You put down an operational deposit',
    detail: 'Covers our labor hours, travel, and event overhead—gas, van costs, power. Not a cent goes toward blanks.',
  },
  {
    number: '03',
    label: 'We bring everything else',
    detail: 'Blank garments, equipment, van, and staff—entirely at our cost and risk. You pay nothing for inventory.',
  },
  {
    number: '04',
    label: 'We split what\'s left',
    detail: 'Event sales return your deposit first. Then we split remaining profits. We only win when you do.',
  },
];

export default function PartnerDifference() {
  return (
    <Box sx={{ py: { xs: 10, md: 14 }, backgroundColor: '#0f0f0f', color: '#eaeaea' }}>
      <Container maxWidth="lg">

        {/* Top statement */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          custom={0}
          variants={fadeUp}
        >
          <Box sx={{ maxWidth: 800, mb: { xs: 8, md: 12 } }}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', letterSpacing: '0.15em', fontSize: '0.75rem', display: 'block', mb: 2 }}
            >
              The 687 Difference
            </Typography>
            <Typography variant="h2" component="h2" sx={{ color: '#fff', mb: 3, lineHeight: 1.05 }}>
              We&apos;re your merch partner.<br />
              Not just your printer.
            </Typography>
            <Typography variant="body1" sx={{ color: '#777', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 640 }}>
              Most print shops take your order, hand it back, and move on. We work alongside you
              to figure out which production model actually fits your business—and with Mobile Merch,
              we put our own resources on the line to make it work. You shouldn&apos;t have to absorb
              all the risk of selling merch. We don&apos;t think that&apos;s a partnership.
            </Typography>
          </Box>
        </motion.div>

        {/* Mobile Merch profit-share breakdown */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          custom={0}
          variants={fadeUp}
        >
          <Typography
            variant="overline"
            sx={{ color: '#444', letterSpacing: '0.15em', fontSize: '0.7rem', display: 'block', mb: 4 }}
          >
            How Mobile Merch Works
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 0,
            mb: { xs: 6, md: 8 },
          }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={i * 0.5}
              variants={fadeUp}
            >
              <Box
                sx={{
                  position: 'relative',
                  p: { xs: 3, md: 4 },
                  borderLeft: { xs: '2px solid #1e1e1e', sm: i % 2 === 0 ? '2px solid #1e1e1e' : 'none' },
                  borderTop: { xs: i === 0 ? '2px solid #1e1e1e' : 'none', sm: '2px solid #1e1e1e' },
                  borderRight: { sm: '2px solid #1e1e1e' },
                  borderBottom: '2px solid #1e1e1e',
                  backgroundColor: i === 3 ? 'rgba(242,191,0,0.04)' : 'transparent',
                  height: '100%',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-anton), "Anton", sans-serif',
                    fontSize: '2.5rem',
                    lineHeight: 1,
                    color: i === 3 ? 'primary.main' : '#252525',
                    mb: 2,
                  }}
                >
                  {step.number}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: i === 3 ? 'primary.main' : '#eaeaea', mb: 1.5, fontSize: '0.95rem' }}
                >
                  {step.label}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.65, fontSize: '0.85rem' }}>
                  {step.detail}
                </Typography>

                {/* Connector arrow (desktop only, not last) */}
                {i < 3 && (
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      position: 'absolute',
                      right: -12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      width: 24,
                      height: 24,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#0f0f0f',
                      color: '#333',
                      fontSize: '1rem',
                    }}
                  >
                    →
                  </Box>
                )}
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Bottom kicker */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={0}
          variants={fadeUp}
        >
          <Box
            sx={{
              borderTop: '1px solid #1e1e1e',
              pt: 5,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              alignItems: { md: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body1" sx={{ color: '#555', maxWidth: 480, lineHeight: 1.75 }}>
              At the end of the event, we pack up and leave with our blank inventory—every unsold
              garment goes back in the van. You walk away with zero finished merchandise to store,
              manage, or mark down. Any unused screen printing is still yours—your transfer sheets
              can be applied to future orders or future events whenever you&apos;re ready.
            </Typography>
            <Box sx={{ flexShrink: 0, textAlign: { xs: 'left', md: 'right' } }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-anton), "Anton", sans-serif',
                  fontSize: { xs: '3.5rem', md: '5rem' },
                  lineHeight: 1,
                  color: '#fff',
                }}
              >
                $0
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}
              >
                Leftover inventory
              </Typography>
            </Box>
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
}
