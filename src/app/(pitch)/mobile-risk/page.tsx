'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

// ─── Same constants as CostComparison ────────────────────────────────────────
const UNITS       = 100;
const BLANK_COST  = 5;
const TRAD_PRINT  = 5;
const TRAD_SETUP  = 40;
const TRAD_STAFF  = 320;
const TRAD_STORAGE = 75;
const MOB_PRINT   = 3.5;
const MOB_DEPOSIT = 540;
const UNSOLD_RATE = 0.3;
const SALE_PRICE  = 35;

const tradTotal   = UNITS * BLANK_COST + UNITS * TRAD_PRINT + TRAD_SETUP + TRAD_STAFF + TRAD_STORAGE;
const mobPrint    = UNITS * MOB_PRINT;
const mobTotal    = mobPrint + MOB_DEPOSIT;
const unsoldUnits = Math.round(UNITS * UNSOLD_RATE);
const soldUnits   = UNITS - unsoldUnits;
const grossSales  = soldUnits * SALE_PRICE;
const tradNet     = grossSales - tradTotal;
const mobPrintRefund   = soldUnits * MOB_PRINT;
const mobBlankCost     = soldUnits * BLANK_COST;
const netToSplit       = grossSales - MOB_DEPOSIT - mobPrintRefund - mobBlankCost;
const clientSplit      = netToSplit * 0.5;
const clientTotalBack  = MOB_DEPOSIT + mobPrintRefund + clientSplit;
const mobNet           = clientTotalBack - mobTotal;

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45 },
};

// ─── Risk comparison rows ─────────────────────────────────────────────────────
interface RiskRow {
  label: string;
  tradVal: string;
  mobVal: string;
  tradNote?: string;
  mobNote?: string;
  tradBad?: boolean;
  mobGood?: boolean;
}

const riskRows: RiskRow[] = [
  {
    label: 'Upfront cash out',
    tradVal: fmt(tradTotal),
    mobVal: `${fmt(mobTotal)}*`,
    tradNote: 'Blanks, printing, setup, staff, storage',
    mobNote: `${fmt(MOB_DEPOSIT)} of this is your deposit — returned from sales`,
    tradBad: true,
  },
  {
    label: 'If zero items sell',
    tradVal: fmt(tradTotal),
    mobVal: `${fmt(mobPrint)}†`,
    tradNote: 'Everything you spent — zero back',
    mobNote: 'Transfer sheets you own and can reuse at any future event',
    tradBad: true,
    mobGood: true,
  },
  {
    label: 'Unsold inventory',
    tradVal: `${unsoldUnits} shirts avg.`,
    mobVal: '$0',
    tradNote: `~${fmt(unsoldUnits * (BLANK_COST + TRAD_PRINT))} in product you need to sell or store`,
    mobNote: 'We take the blanks back — your liability ends at the event',
    tradBad: true,
    mobGood: true,
  },
  {
    label: 'Booth staffing',
    tradVal: fmt(TRAD_STAFF),
    mobVal: '$0',
    tradNote: '2 people × 8 hrs × $20/hr — your responsibility',
    mobNote: 'We run the booth — staff, equipment, and setup included',
    tradBad: true,
    mobGood: true,
  },
];

function RiskRow({ label, tradVal, mobVal, tradNote, mobNote, tradBad, mobGood }: RiskRow) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
        borderBottom: '1px solid #1a1a1a',
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2, borderRight: { sm: '1px solid #1a1a1a' }, borderBottom: { xs: '1px solid #161616', sm: 'none' } }}>
        <Typography variant="body2" sx={{ color: '#888', fontSize: '0.8rem', fontWeight: 500 }}>
          {label}
        </Typography>
      </Box>
      <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2, borderRight: { sm: '1px solid #1a1a1a' }, backgroundColor: tradBad ? 'rgba(192,57,43,0.04)' : undefined }}>
        <Typography variant="body2" sx={{ color: tradBad ? '#e74c3c' : '#ccc', fontWeight: 700, fontSize: '0.9rem' }}>
          {tradVal}
        </Typography>
        {tradNote && (
          <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', display: 'block', mt: 0.5, lineHeight: 1.4 }}>
            {tradNote}
          </Typography>
        )}
      </Box>
      <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2, backgroundColor: mobGood ? 'rgba(242,191,0,0.04)' : undefined }}>
        <Typography variant="body2" sx={{ color: mobGood ? '#f2bf00' : '#ccc', fontWeight: 700, fontSize: '0.9rem' }}>
          {mobVal}
        </Typography>
        {mobNote && (
          <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', display: 'block', mt: 0.5, lineHeight: 1.4 }}>
            {mobNote}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function MobileRiskPage() {
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
              You&apos;re betting on<br />
              a crowd you<br />
              haven&apos;t seen yet.
            </Typography>

            <Typography variant="body1" sx={{ color: '#999', maxWidth: 540, lineHeight: 1.8, mb: 7, fontSize: '1rem', mx: 'auto' }}>
              Traditional merch asks you to commit before the event — sizes, quantities, designs — all locked in before a single person walks through the door. How many will show? What sizes will they need? Which design moves? You don&apos;t know. Neither does anyone else. Mobile Merch turns your event into a live shop. We print on-site as demand shows itself, so you&apos;re never stuck holding product that didn&apos;t move.
            </Typography>

            {/* Approach contrast */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                border: '1px solid #1e1e1e',
                borderRadius: 2,
                overflow: 'hidden',
                maxWidth: 560,
                mx: 'auto',
                textAlign: 'left',
              }}
            >
              <Box sx={{ flex: 1, px: 3, py: 2.5, borderRight: { sm: '1px solid #1e1e1e' }, borderBottom: { xs: '1px solid #1e1e1e', sm: 'none' } }}>
                <Typography variant="body2" sx={{ color: '#e74c3c', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.75 }}>
                  Pre-order model
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.6, display: 'block' }}>
                  Sizes, quantities, and designs locked in weeks before anyone shows up
                </Typography>
              </Box>
              <Box sx={{ flex: 1, px: 3, py: 2.5 }}>
                <Typography variant="body2" sx={{ color: '#f2bf00', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.75 }}>
                  On-site shop model
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.6, display: 'block' }}>
                  Print what&apos;s actually selling, in real time, to a crowd you can see
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── Scenario callout ─────────────────────────────────────────────────── */}
      <Box sx={{ borderBottom: '1px solid #1a1a1a', borderTop: '1px solid #1a1a1a', backgroundColor: '#0a0a0a' }}>
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
            {/* Left: key numbers */}
            <Box sx={{ display: 'flex', gap: { xs: 4, sm: 6 }, flexShrink: 0 }}>
              <Box>
                <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: { xs: '2.2rem', md: '2.8rem' }, lineHeight: 1, color: '#f2bf00' }}>
                  {UNITS}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mt: 0.5 }}>
                  Items
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: { xs: '2.2rem', md: '2.8rem' }, lineHeight: 1, color: '#f2bf00' }}>
                  ${SALE_PRICE}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mt: 0.5 }}>
                  Retail price
                </Typography>
              </Box>
            </Box>

            {/* Right: explanation */}
            <Box>
              <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.9rem', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                This is an example scenario
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.75, fontSize: '0.88rem', maxWidth: 560 }}>
                Every number on this page assumes a 100-item event merch run with shirts retailing at ${SALE_PRICE} each — a common starting point for bars, fan clubs, and community events. Your actual costs will vary by garment, location, and event size. Use this as a reference frame for how the two models compare, not a fixed estimate for your event.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── The risk gap ─────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 6 }}>
              What you're actually risking
            </Typography>
          </motion.div>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: { xs: 3, md: 4 } }}>
            {[
              {
                stat: `${Math.round(tradTotal / mobPrint)}×`,
                color: '#e74c3c',
                label: 'More exposure their way',
                sub: `${fmt(tradTotal)} traditional vs ${fmt(mobPrint)} yours if zero items sell`,
              },
              {
                stat: '$0',
                color: '#f2bf00',
                label: 'Unsold inventory with you',
                sub: 'We stock the blanks and take them back — every time',
              },
              {
                stat: '100%',
                color: '#f2bf00',
                label: 'Deposit returned before we split',
                sub: 'First dollars from sales go back to you, then we divide the rest',
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.45, delay: i * 0.08 }}>
                <Box sx={{ p: { xs: 3, md: 3.5 }, border: '1px solid #1e1e1e', borderRadius: 2, height: '100%' }}>
                  <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: { xs: '2.8rem', md: '3.2rem' }, lineHeight: 1, color: item.color, mb: 1.5 }}>
                    {item.stat}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.88rem', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.6, display: 'block' }}>
                    {item.sub}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Side-by-side risk table ───────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              The downside comparison
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: { xs: 5, md: 7 }, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              {UNITS}-item event. What can go wrong?
            </Typography>
          </motion.div>

          <motion.div {...fadeUp}>
            <Box sx={{ border: '1px solid #1e1e1e', borderRadius: 2, overflow: 'hidden' }}>
              {/* Column headers */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                  backgroundColor: '#0a0a0a',
                  borderBottom: '2px solid #1e1e1e',
                }}
              >
                <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2, borderRight: { sm: '1px solid #1e1e1e' }, display: { xs: 'none', sm: 'block' } }} />
                <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2, borderRight: { sm: '1px solid #1e1e1e' } }}>
                  <Typography variant="caption" sx={{ color: '#888', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 0.25 }}>
                    Their model
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#777', fontWeight: 700, fontSize: '0.82rem' }}>
                    Traditional
                  </Typography>
                </Box>
                <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2 }}>
                  <Typography variant="caption" sx={{ color: '#f2bf00', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 0.25 }}>
                    Our model
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#f2bf00', fontWeight: 700, fontSize: '0.82rem' }}>
                    687 Mobile Merch
                  </Typography>
                </Box>
              </Box>

              {riskRows.map((row, i) => (
                <RiskRow key={i} {...row} />
              ))}
            </Box>

            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem' }}>
                * {fmt(MOB_DEPOSIT)} of this is your operational deposit, returned to you once event sales cover it.
              </Typography>
              <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem' }}>
                † Your worst-case is the screen printing cost — transfer sheets you own outright and can use at any future event.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              How the model works
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: { xs: 5, md: 7 }, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              Three numbers. Clean structure.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 0, border: '1px solid #1e1e1e', borderRadius: 2, overflow: 'hidden' }}>
            {[
              {
                step: '01',
                amount: fmt(mobPrint),
                label: 'Screen printing',
                body: `You pay ${fmt(mobPrint)} for ${UNITS} transfer sheets — artwork printed to reusable sheets, not garments. These are yours permanently. Apply them to any blank, at any event, on any schedule.`,
                note: 'The only cost you can\'t recover',
              },
              {
                step: '02',
                amount: fmt(MOB_DEPOSIT),
                label: 'Operational deposit',
                body: `You put up ${fmt(MOB_DEPOSIT)} to cover our staff, equipment, and travel costs. We bring everything to your event — the booth, the press, the blanks, and the people to run it.`,
                note: 'Returned before we split a penny',
              },
              {
                step: '03',
                amount: '50 / 50',
                label: 'Profit split',
                body: `Sales return your deposit first. Then we cover the blank cost per shirt sold. What\'s left we split down the middle — you get your money back plus a share of every sale.`,
                note: 'After you\'re whole, we split what\'s left',
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.45, delay: i * 0.08 }}>
                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRight: { md: i < 2 ? '1px solid #1e1e1e' : 'none' },
                    borderBottom: { xs: i < 2 ? '1px solid #1e1e1e' : 'none', md: 'none' },
                    height: '100%',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#2a2a2a', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, display: 'block', mb: 2 }}>
                    Step {item.step}
                  </Typography>
                  <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: '2rem', lineHeight: 1, color: '#f2bf00', mb: 1.5 }}>
                    {item.amount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.88rem', mb: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.7, fontSize: '0.82rem', mb: 2.5 }}>
                    {item.body}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#2e2e2e', fontSize: '0.78rem', fontStyle: 'italic' }}>
                    {item.note}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Profit scenario ──────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              When it works
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: 1.5, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              {soldUnits} of {UNITS} sell at ${SALE_PRICE}.
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', mb: { xs: 5, md: 7 }, maxWidth: 480 }}>
              {fmt(grossSales)} gross. Both models make money. Only one exits clean.
            </Typography>
          </motion.div>

          <motion.div {...fadeUp}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              {/* Traditional */}
              <Box sx={{ p: { xs: 3, md: 4 }, border: '1px solid #2a1a1a', borderRadius: 2, backgroundColor: 'rgba(192,57,43,0.03)' }}>
                <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.74rem', display: 'block', mb: 3 }}>
                  Traditional
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: '2.5rem', lineHeight: 1, color: '#eaeaea', mb: 0.5 }}>
                  {fmt(tradNet)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', display: 'block', mb: 3 }}>
                  Net profit from event
                </Typography>
                <Box sx={{ pt: 3, borderTop: '1px solid #1e1e1e' }}>
                  <Typography variant="body2" sx={{ color: '#e74c3c', fontWeight: 700, fontSize: '0.82rem', mb: 0.75 }}>
                    + {unsoldUnits} shirts still in your hands
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.6, display: 'block' }}>
                    That&apos;s storage, listing time, discount sales, or a closet full of shirts.
                    The profit gap from selling them all covers the hassle — if you sell them.
                  </Typography>
                </Box>
              </Box>

              {/* Mobile */}
              <Box sx={{ p: { xs: 3, md: 4 }, border: '1px solid #1e2a1a', borderRadius: 2, backgroundColor: 'rgba(242,191,0,0.03)' }}>
                <Typography variant="caption" sx={{ color: '#f2bf00', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.74rem', display: 'block', mb: 3 }}>
                  687 Mobile Merch
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: '2.5rem', lineHeight: 1, color: '#f2bf00', mb: 0.5 }}>
                  {fmt(mobNet)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888', fontSize: '0.78rem', display: 'block', mb: 3 }}>
                  Net profit from event
                </Typography>
                <Box sx={{ pt: 3, borderTop: '1px solid #1e1e1e' }}>
                  <Typography variant="body2" sx={{ color: '#f2bf00', fontWeight: 700, fontSize: '0.82rem', mb: 0.75 }}>
                    Zero inventory remaining
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.6, display: 'block' }}>
                    You walk away from the event with your money and nothing left to figure out.
                    The profit difference is the cost of a clean exit.
                  </Typography>
                </Box>
              </Box>
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
                Every event has<br />different numbers.
              </Typography>
              <Typography variant="body1" sx={{ color: '#888', mb: 6, maxWidth: 400, mx: 'auto', lineHeight: 1.75 }}>
                Tell us about your event and we&apos;ll run the math for your specific headcount, venue, and goals.
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
