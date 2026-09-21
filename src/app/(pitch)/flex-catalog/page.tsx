'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

// ─── Scenario constants ───────────────────────────────────────────────────────
const SHEETS_PER_RUN = 50;    // transfer sheets per ink color
const SHEET_COST     = 3.5;   // per sheet
const TRAD_SETUP     = 40;    // setup fee per traditional run
const TRAD_PRINT_PER = 5;     // per-garment print cost (traditional)
const BLANK_COST     = 10;    // wholesale blank, average across styles

const flexPrintTotal  = SHEETS_PER_RUN * 2 * SHEET_COST; // both runs
const tradSingleRun   = SHEETS_PER_RUN * (BLANK_COST + TRAD_PRINT_PER) + TRAD_SETUP;
const GARMENT_STYLES  = 8; // how many distinct SKU groups two prints unlock

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45 },
};

// ─── Garment catalog data ─────────────────────────────────────────────────────
const darkGarments = [
  { style: 'T-Shirt', examples: 'Black, charcoal, navy' },
  { style: 'Hoodie', examples: 'Black, forest, maroon' },
  { style: 'Long Sleeve', examples: 'Black, dark grey, navy' },
  { style: 'Tank Top', examples: 'Black, charcoal' },
];

const lightGarments = [
  { style: 'T-Shirt', examples: 'White, natural, light grey' },
  { style: 'Hoodie', examples: 'White, cream, light grey' },
  { style: 'Long Sleeve', examples: 'White, natural, sand' },
  { style: 'Tank Top', examples: 'White, natural' },
];

export default function FlexCatalogPage() {
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
              Two print runs.<br />
              <Box component="span" sx={{ color: '#f2bf00' }}>Your whole catalog.</Box>
            </Typography>

            <Typography variant="body1" sx={{ color: '#999', maxWidth: 540, lineHeight: 1.8, mb: 4, fontSize: '1rem', mx: 'auto' }}>
              With transfer sheet printing, your design and your garment are two separate decisions. Print a white ink version and a black ink version — then apply either one to any style, color, or cut whenever demand calls for it. One print job covers every dark garment. The other covers every light one.
            </Typography>

            {/* Applies to both models note */}
            <Box sx={{ display: 'inline-flex', gap: 2, mb: 6, px: 2.5, py: 1.5, border: '1px solid #222', borderRadius: 2, mx: 'auto' }}>
              <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', lineHeight: 1.5 }}>
                Applies to both{' '}
                <Box component="span" sx={{ color: '#f2bf00', fontWeight: 700 }}>Flexible Merch Production</Box>
                {' '}and{' '}
                <Box component="span" sx={{ color: '#f2bf00', fontWeight: 700 }}>Mobile Merch</Box>
                {' '}— any model that uses transfer sheets.
              </Typography>
            </Box>

            {/* Ink split visual */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                border: '1px solid #1e1e1e',
                borderRadius: 2,
                overflow: 'hidden',
                maxWidth: 480,
                mx: 'auto',
                textAlign: 'left',
              }}
            >
              <Box sx={{ flex: 1, px: 3, py: 2.5, borderRight: { sm: '1px solid #1e1e1e' }, borderBottom: { xs: '1px solid #1e1e1e', sm: 'none' }, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff', mb: 1.5, border: '1px solid #333' }} />
                <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                  White ink
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', lineHeight: 1.5, display: 'block' }}>
                  Applies to any dark garment — black, navy, charcoal, forest
                </Typography>
              </Box>
              <Box sx={{ flex: 1, px: 3, py: 2.5, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#1a1a1a', mb: 1.5, border: '1px solid #555' }} />
                <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                  Black ink
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', lineHeight: 1.5, display: 'block' }}>
                  Applies to any light garment — white, natural, cream, sand
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── Scenario callout ─────────────────────────────────────────────────── */}
      <Box sx={{ borderBottom: '1px solid #1a1a1a', backgroundColor: '#0a0a0a' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 3, md: 6 },
              py: { xs: 5, md: 6 },
              borderLeft: '3px solid #f2bf00',
              pl: { xs: 3, md: 4 },
            }}
          >
            <Box sx={{ display: 'flex', gap: { xs: 4, sm: 6 }, flexShrink: 0 }}>
              <Box>
                <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: { xs: '2.2rem', md: '2.8rem' }, lineHeight: 1, color: '#f2bf00' }}>
                  2
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mt: 0.5 }}>
                  Print runs
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: { xs: '2.2rem', md: '2.8rem' }, lineHeight: 1, color: '#f2bf00' }}>
                  {GARMENT_STYLES}+
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mt: 0.5 }}>
                  Garment options
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.9rem', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                This is an example scenario
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.75, fontSize: '0.88rem', maxWidth: 560 }}>
                Numbers below assume {SHEETS_PER_RUN} transfer sheets per ink color — {SHEETS_PER_RUN * 2} total sheets at {fmt(SHEET_COST)} each, for {fmt(flexPrintTotal)} in printing. The garment styles and colorways shown are illustrative. Your actual catalog depends on your design and what your audience wants.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Catalog grid ─────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              What two print runs unlock
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: { xs: 5, md: 7 }, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              One design. Every garment.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            {/* White ink column */}
            <motion.div {...fadeUp}>
              <Box sx={{ border: '1px solid #222', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 3, py: 2.5, backgroundColor: '#111', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #444', flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    White ink — dark garments
                  </Typography>
                </Box>
                {darkGarments.map((g, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 3,
                      py: 2,
                      borderBottom: i < darkGarments.length - 1 ? '1px solid #1a1a1a' : 'none',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#ccc', fontWeight: 600, fontSize: '0.88rem' }}>
                      {g.style}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem' }}>
                      {g.examples}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>

            {/* Black ink column */}
            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.08 }}>
              <Box sx={{ border: '1px solid #222', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 3, py: 2.5, backgroundColor: '#111', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#1a1a1a', border: '1px solid #555', flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Black ink — light garments
                  </Typography>
                </Box>
                {lightGarments.map((g, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 3,
                      py: 2,
                      borderBottom: i < lightGarments.length - 1 ? '1px solid #1a1a1a' : 'none',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#ccc', fontWeight: 600, fontSize: '0.88rem' }}>
                      {g.style}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem' }}>
                      {g.examples}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Box>

          <motion.div {...fadeUp}>
            <Box sx={{ mt: 4, p: { xs: 3, md: 4 }, border: '1px solid #1e1e1e', borderRadius: 2, backgroundColor: '#0a0a0a' }}>
              <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.75, fontSize: '0.88rem' }}>
                Every combination above comes from the same two print runs. You don&apos;t reorder the artwork — you just order the blank in whatever style or color someone asks for and apply the transfer. The only limit is what garments are available wholesale.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── Economics ────────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              The economics
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: { xs: 5, md: 7 }, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              Adding a new style costs the blank. That&apos;s it.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            <motion.div {...fadeUp}>
              <Box sx={{ p: { xs: 3, md: 4 }, border: '1px solid #2a1a1a', borderRadius: 2, backgroundColor: 'rgba(192,57,43,0.03)', height: '100%' }}>
                <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.74rem', display: 'block', mb: 3 }}>
                  Traditional — adding a new style
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: '2.5rem', lineHeight: 1, color: '#e74c3c', mb: 0.5 }}>
                  {fmt(tradSingleRun)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', display: 'block', mb: 3 }}>
                  To add {SHEETS_PER_RUN} hoodies in a new colorway
                </Typography>
                <Box sx={{ pt: 3, borderTop: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    `${SHEETS_PER_RUN} blanks × ~$10 avg`,
                    `${SHEETS_PER_RUN} prints × $${TRAD_PRINT_PER}/ea`,
                    `$${TRAD_SETUP} setup fee`,
                    'Repeat for every new style',
                  ].map((line, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#e74c3c', mt: 0.75, flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.5 }}>{line}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.08 }}>
              <Box sx={{ p: { xs: 3, md: 4 }, border: '1px solid #1e2a1a', borderRadius: 2, backgroundColor: 'rgba(242,191,0,0.03)', height: '100%' }}>
                <Typography variant="caption" sx={{ color: '#f2bf00', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.74rem', display: 'block', mb: 3 }}>
                  Flexible printing — adding a new style
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: '2.5rem', lineHeight: 1, color: '#f2bf00', mb: 0.5 }}>
                  {fmt(BLANK_COST)} ea.
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', display: 'block', mb: 3 }}>
                  Just the wholesale blank — transfers are already paid for
                </Typography>
                <Box sx={{ pt: 3, borderTop: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    'Order any blank in any quantity',
                    'Apply the transfer you already own',
                    'No setup fee, no minimum run',
                    'Add any style, any time',
                  ].map((line, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#f2bf00', mt: 0.75, flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.5 }}>{line}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* ── Grow on demand ───────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              Grow with demand
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: { xs: 5, md: 7 }, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              Start small. Add styles as people ask.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
            {[
              {
                when: 'Launch',
                action: 'Black tees + white tees',
                detail: 'Start with the basics. Low risk, high demand. See what your audience responds to.',
              },
              {
                when: 'Fall',
                action: 'Add hoodies',
                detail: 'Weather changes, demand shifts. Order the blanks, apply the transfers you already own.',
              },
              {
                when: 'Summer',
                action: 'Add tanks',
                detail: 'Same design, different cut. No new print run — just order the blank and apply.',
              },
              {
                when: 'Anytime',
                action: 'New colorway request',
                detail: 'Someone asks for navy. Order the blank, apply the white-ink transfer. Done same week.',
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.45, delay: i * 0.07 }}>
                <Box sx={{ p: { xs: 3, md: 3 }, border: '1px solid #1e1e1e', borderRadius: 2, height: '100%' }}>
                  <Typography variant="caption" sx={{ color: '#f2bf00', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, display: 'block', mb: 2 }}>
                    {item.when}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.88rem', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    {item.action}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.7, fontSize: '0.82rem' }}>
                    {item.detail}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Multi-event ──────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              Across multiple events
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              Same prints. Every show.
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', lineHeight: 1.8, mb: { xs: 5, md: 7 }, maxWidth: 560 }}>
              You pay for the screen printing once. Those transfer sheets work at every show, every market, every drop after that — whether you're applying them yourself or we&apos;re showing up as your merch booth.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 5 }}>
            {/* DIY across shows */}
            <motion.div {...fadeUp}>
              <Box sx={{ p: { xs: 3, md: 4 }, border: '1px solid #1e1e1e', borderRadius: 2, height: '100%' }}>
                <Typography variant="body2" sx={{ color: '#f2bf00', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 }}>
                  Flexible — you run the merch table
                </Typography>
                <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.75, fontSize: '0.85rem', mb: 3 }}>
                  Print your transfers once. Bring blank garments and a heat press to each show. Sell what you apply on the spot, or pre-apply a batch before each night. The print cost is already paid — each show costs only the blanks you bring.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    '4 shows = same $350 in printing spread across all of them',
                    'Bring more or fewer blanks based on each venue's expected crowd',
                    'Leftover transfers carry forward to the next show',
                  ].map((line, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#f2bf00', mt: 0.75, flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.5 }}>{line}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>

            {/* Mobile across shows */}
            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.08 }}>
              <Box sx={{ p: { xs: 3, md: 4 }, border: '1px solid #1e1e1e', borderRadius: 2, height: '100%' }}>
                <Typography variant="body2" sx={{ color: '#f2bf00', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 2 }}>
                  Mobile — we are your merch booth
                </Typography>
                <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.75, fontSize: '0.85rem', mb: 3 }}>
                  We show up to each show with the press, the blanks, and the staff. You promote, we sell. Each show has its own operational deposit that comes back from sales — the transfer sheets you already own travel with us from night to night.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    'Prints paid once — no per-show print cost',
                    'We restock blanks between shows as needed',
                    'Each show runs its own deposit-and-split model',
                  ].map((line, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#f2bf00', mt: 0.75, flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.5 }}>{line}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Box>

          <motion.div {...fadeUp}>
            <Box sx={{ p: { xs: 3, md: 4 }, border: '1px solid #222', borderLeft: '3px solid #f2bf00', borderRadius: 2, backgroundColor: '#080808' }}>
              <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.88rem', mb: 1 }}>
                Example: band with 4 shows
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.75, fontSize: '0.85rem' }}>
                Print 100 white-ink and 100 black-ink transfer sheets once — {fmt((SHEETS_PER_RUN * 2) * 2 * SHEET_COST)} in printing. Split them across 4 shows: ~50 sheets per night. Whether you run the table yourself or we show up with the van, your design cost is {fmt((SHEETS_PER_RUN * 2) * 2 * SHEET_COST / 4)} per show. Any unsold sheets move to the next date — nothing is wasted.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="md">
          <motion.div {...fadeUp}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ color: '#fff', mb: 3, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                Tell us your design.<br />We&apos;ll show you your catalog.
              </Typography>
              <Typography variant="body1" sx={{ color: '#888', mb: 6, maxWidth: 400, mx: 'auto', lineHeight: 1.75 }}>
                Bring us your artwork and we&apos;ll walk through which garment options make sense for your audience, pricing, and two print runs that cover them all.
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
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    textDecoration: 'none',
                    '&:hover': { backgroundColor: '#e0b000' },
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
                    border: '1px solid #2a2a2a',
                    color: '#888',
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    textDecoration: 'none',
                    '&:hover': { borderColor: '#444', color: '#ccc' },
                    transition: 'all 0.15s ease',
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
