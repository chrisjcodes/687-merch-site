'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45 },
};

export default function MobileLogisticsPage() {
  return (
    <Box>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <Box sx={{ pt: { xs: 10, md: 14 }, pb: { xs: 8, md: 10 }, borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            <Typography
              variant="h1"
              sx={{ color: '#fff', mb: 4, lineHeight: { xs: 1.1, md: 1.05 }, fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4.5rem' } }}
            >
              You&apos;ve got 400 things to manage.<br />
              <Box component="span" sx={{ color: '#f2bf00' }}>Merch doesn&apos;t have to be one of them.</Box>
            </Typography>

            <Typography variant="body1" sx={{ color: '#999', maxWidth: 520, lineHeight: 1.8, mb: 5, fontSize: '1rem', mx: 'auto' }}>
              Merch isn&apos;t one of them. We show up with everything, run the whole operation, handle the money, and send you a check when it&apos;s over. Your job is to point us at the crowd.
            </Typography>

            {/* Stat strip */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
                gap: { xs: 0, sm: 0 },
                border: '1px solid #1e1e1e',
                borderRadius: 2,
                overflow: 'hidden',
                maxWidth: 520,
                mx: 'auto',
              }}
            >
              {[
                { stat: '0', label: 'Things you source' },
                { stat: '0', label: 'Staff you manage' },
                { stat: '0', label: 'Shirts left over' },
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    px: 3,
                    py: 2.5,
                    borderRight: { sm: i < 2 ? '1px solid #1e1e1e' : 'none' },
                    borderBottom: { xs: i < 2 ? '1px solid #1e1e1e' : 'none', sm: 'none' },
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-anton), "Anton", sans-serif',
                      fontSize: '2rem',
                      lineHeight: 1,
                      color: '#f2bf00',
                      mb: 0.5,
                    }}
                  >
                    {item.stat}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── What we bring ───────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              What we bring
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              Everything. We bring everything.
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', maxWidth: 520, lineHeight: 1.8, mb: { xs: 5, md: 7 } }}>
              The van, the press, the power, the staff, the blanks, the display, the payment system. There is no list of things you need to source or coordinate on your end.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {[
              {
                title: 'Production van',
                body: 'LED-lit, fully equipped, self-contained. Pulls up, sets up, and runs. No tent, no table, no booth kit required from you.',
              },
              {
                title: 'Heat press equipment',
                body: "We bring the press. We bring the transfers. We run every print. You don't touch any of it.",
              },
              {
                title: 'Blank garments',
                body: "We stock and manage inventory across events. You tell us what styles and sizes — we handle sourcing, transport, and everything left over after.",
              },
              {
                title: 'Staffing',
                body: "Our people run the booth from open to close. Sales, customer questions, order fulfillment — covered. You don't need to pull anyone from your team.",
              },
              {
                title: 'Payment processing',
                body: "We handle all transactions. At the end of the event, we reconcile and send you your cut. No cash drawers to count, no square terminals to set up.",
              },
              {
                title: 'Setup & teardown',
                body: 'We arrive before the event, set up without needing supervision, and break down after. Load-in and load-out are our problem.',
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}>
                <Box sx={{ p: { xs: 3, md: 3.5 }, border: '1px solid #1e1e1e', borderRadius: 2, height: '100%' }}>
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#f2bf00', mb: 2 }} />
                  <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.75, fontSize: '0.84rem' }}>
                    {item.body}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Power independence ───────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 6, md: 10 }, alignItems: 'center' }}>
            <motion.div {...fadeUp}>
              <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
                Power
              </Typography>
              <Typography variant="h2" sx={{ color: '#fff', mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                Don&apos;t find us a power drop.
              </Typography>
              <Typography variant="body1" sx={{ color: '#888', lineHeight: 1.8, mb: 4 }}>
                The van runs on its own integrated battery system — 4 to 6 hours of operation with no external power input at all, depending on press volume. We don&apos;t need to be near an outlet. We don&apos;t need you to coordinate with the venue on power access.
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.8, mb: 3, fontSize: '0.9rem' }}>
                If we&apos;re there for a long stretch or doing high volume, we have options:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  'Shore power — standard outlet if one happens to be nearby',
                  "Van engine — we can recharge off our own vehicle",
                  'Generator — we can run independently if needed',
                  'EV charger — compatible with available charging infrastructure',
                ].map((line, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#f2bf00', mt: 0.8, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: '#888', fontSize: '0.88rem', lineHeight: 1.6 }}>{line}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  border: '1px solid #222',
                  borderRadius: 2,
                  backgroundColor: '#080808',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'radial-gradient(ellipse at 50% 100%, rgba(242,191,0,0.07) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-anton), "Anton", sans-serif',
                    fontSize: { xs: '4rem', md: '5rem' },
                    lineHeight: 1,
                    color: '#f2bf00',
                    mb: 1,
                  }}
                >
                  4–6hrs
                </Typography>
                <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1 }}>
                  Battery runtime
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.82rem', lineHeight: 1.6, mb: 4 }}>
                  On integrated battery alone — no venue power, no generator, nothing from you.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Shore power', 'Engine recharge', 'Generator', 'EV charger'].map((src) => (
                    <Box
                      key={src}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 1,
                        borderTop: '1px solid #1a1a1a',
                      }}
                    >
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#27ae60', flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ color: '#888', fontSize: '0.8rem' }}>
                        {src}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* ── What you don't have to do ────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              Off your list
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: { xs: 5, md: 7 }, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              What you don&apos;t have to think about.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {[
              { item: 'Sourcing blank garments', detail: "We own inventory across events. You don't order a single shirt." },
              { item: 'Finding a power source', detail: 'We run on battery. Four hours, no input from the venue required.' },
              { item: 'Hiring or managing booth staff', detail: 'Our team runs the operation start to finish.' },
              { item: 'Setting up or breaking down', detail: 'We arrive early and leave clean. No supervision needed.' },
              { item: 'Handling cash or payments', detail: 'We process everything and send you a reconciliation after.' },
              { item: 'Dealing with leftover inventory', detail: "We take blanks back. Nothing to store, sell off, or write off." },
              { item: 'Coordinating with the venue on logistics', detail: 'We just need to know where to park. That&apos;s the whole ask.' },
              { item: 'Following up on orders or complaints', detail: 'We fulfill on-site and handle it. It never hits your inbox.' },
            ].map((row, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    p: { xs: 2.5, md: 3 },
                    border: '1px solid #1a1a1a',
                    borderRadius: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '1.5px solid #27ae60',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.1,
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#27ae60' }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#ccc', fontWeight: 600, fontSize: '0.88rem', mb: 0.5 }}>
                      {row.item}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      {row.detail}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── The money ───────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 4fr' }, gap: { xs: 6, md: 10 }, alignItems: 'start' }}>
            <motion.div {...fadeUp}>
              <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
                The economics
              </Typography>
              <Typography variant="h2" sx={{ color: '#fff', mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                A revenue share, not a line item.
              </Typography>
              <Typography variant="body1" sx={{ color: '#888', lineHeight: 1.8, mb: 3 }}>
                You pay for the printing and an operational deposit — that&apos;s it. Sales pay back your deposit first. Everything above that splits between us. You never write a check and walk away with nothing to show for it.
              </Typography>
              <Typography variant="body1" sx={{ color: '#888', lineHeight: 1.8 }}>
                Slow night? Break even on the deposit and move on. Strong night? Your cut goes up with every shirt sold. Either way, you spent zero hours managing a merch operation.
              </Typography>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }}>
              <Box sx={{ p: { xs: 3, md: 4 }, border: '1px solid #222', borderLeft: '3px solid #f2bf00', borderRadius: 2, backgroundColor: '#080808' }}>
                <Typography variant="body2" sx={{ color: '#f2bf00', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 3 }}>
                  How it works
                </Typography>
                {[
                  { step: '1', label: 'Print cost', detail: 'Paid upfront — your design, your transfers' },
                  { step: '2', label: 'Operational deposit', detail: 'Covers our labor, travel, and event overhead' },
                  { step: '3', label: 'Sales return deposit first', detail: 'You get whole before we get anything' },
                  { step: '4', label: '50/50 split on the rest', detail: 'Everything above deposit, split evenly' },
                  { step: '5', label: 'We send you a check', detail: "Reconciled after the event — you don't chase us" },
                ].map((row, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      gap: 2.5,
                      py: 2,
                      borderTop: '1px solid #1a1a1a',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-anton), "Anton", sans-serif',
                        fontSize: '1.1rem',
                        lineHeight: 1,
                        color: 'rgba(242,191,0,0.3)',
                        flexShrink: 0,
                        pt: 0.1,
                        minWidth: 16,
                      }}
                    >
                      {row.step}
                    </Typography>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#ccc', fontWeight: 600, fontSize: '0.85rem', mb: 0.25 }}>
                        {row.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#555', fontSize: '0.78rem', lineHeight: 1.4 }}>
                        {row.detail}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* ── What you actually have to do ────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="md">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              Your to-do list
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: { xs: 5, md: 7 }, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              Seriously, this is it.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: { xs: 5, md: 7 } }}>
            {[
              { num: '01', task: 'Tell us the event details', sub: 'Date, venue, expected headcount, and what you want to sell.' },
              { num: '02', task: 'Tell us where to park', sub: 'Load-in access and where the van should be positioned.' },
              { num: '03', task: 'Go run your event', sub: "Seriously. We have it. You don't need to check on us." },
              { num: '04', task: 'Get the check', sub: "We reconcile after and send your cut. That's the follow-up." },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 3, md: 4 },
                    p: { xs: 3, md: 3.5 },
                    border: '1px solid #1e1e1e',
                    borderRadius: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-anton), "Anton", sans-serif',
                      fontSize: { xs: '1.6rem', md: '2rem' },
                      lineHeight: 1,
                      color: 'rgba(242,191,0,0.2)',
                      flexShrink: 0,
                      pt: 0.2,
                    }}
                  >
                    {item.num}
                  </Typography>
                  <Box>
                    <Typography variant="body1" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: { xs: '0.95rem', md: '1rem' }, mb: 0.5 }}>
                      {item.task}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.6 }}>
                      {item.sub}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="md">
          <motion.div {...fadeUp}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ color: '#fff', mb: 3, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                One conversation.<br />
                <Box component="span" sx={{ color: '#f2bf00' }}>We handle the rest.</Box>
              </Typography>
              <Typography variant="body1" sx={{ color: '#888', mb: 6, maxWidth: 380, mx: 'auto', lineHeight: 1.75 }}>
                Tell us your event. We&apos;ll tell you exactly what to expect, what it costs, and what you walk away with.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Typography
                  component="a"
                  href="tel:+14242603076"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 4,
                    py: 1.75,
                    backgroundColor: '#f2bf00',
                    color: '#0f0f0f',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    letterSpacing: '0.04em',
                    borderRadius: 1.5,
                    '&:hover': { backgroundColor: '#e0af00' },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  (424) 260-3076
                </Typography>
                <Typography
                  component="a"
                  href="mailto:info@687merch.com"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 4,
                    py: 1.75,
                    border: '1px solid #333',
                    color: '#ccc',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    borderRadius: 1.5,
                    '&:hover': { borderColor: '#555', color: '#fff' },
                    transition: 'border-color 0.15s ease, color 0.15s ease',
                  }}
                >
                  info@687merch.com
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

    </Box>
  );
}
