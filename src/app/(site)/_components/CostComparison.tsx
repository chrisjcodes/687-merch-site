'use client';

import React, { useState } from 'react';
import { Box, Typography, Container, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Illustrative pricing model ────────────────────────────────────────────
const BLANK_COST = 5;           // wholesale blank t-shirt (Bella Canvas, etc.)
const TRAD_PRINT_PER = 5;       // traditional screen printing per garment (total $10/shirt out the door)
const TRANSFER_PRINT_PER = 3.5; // 687 screen printing to transfer sheet (quantity pricing)
const TRAD_STAFF_TOTAL = 240;   // 2 staff × 8 hrs × $15
const TRAD_STORAGE = 75;        // storage before + after (conservative)
const MOBILE_DEPOSIT = 375;     // operational deposit: labor + travel + overhead
const UNSOLD_RATE = 0.3;        // 30% unsold scenario

const UNIT_OPTIONS = [50, 100, 250, 500];

function calc(units: number) {
  // Traditional
  const tradBlanks = units * BLANK_COST;
  const tradPrint = units * TRAD_PRINT_PER;
  const tradStaff = TRAD_STAFF_TOTAL;
  const tradStorage = TRAD_STORAGE;
  const tradTotal = tradBlanks + tradPrint + tradStaff + tradStorage;
  const tradUnsoldUnits = Math.round(units * UNSOLD_RATE);
  const tradUnsoldValue = tradUnsoldUnits * (BLANK_COST + TRAD_PRINT_PER);

  // 687 Mobile
  const mobilePrint = units * TRANSFER_PRINT_PER;   // client pays this — they own it forever
  const mobileDeposit = MOBILE_DEPOSIT;             // returned from sales
  const mobileBlanks = 0;
  const mobileTotal = mobilePrint + mobileDeposit;
  const mobileUnsoldValue = 0;                      // 687 takes blanks back

  return {
    trad: {
      blanks: tradBlanks,
      print: tradPrint,
      staff: tradStaff,
      storage: tradStorage,
      total: tradTotal,
      unsoldUnits: tradUnsoldUnits,
      unsoldValue: tradUnsoldValue,
      exposure: tradTotal + tradUnsoldValue,
    },
    mobile: {
      print: mobilePrint,
      blanks: mobileBlanks,
      deposit: mobileDeposit,
      total: mobileTotal,
      unsoldValue: mobileUnsoldValue,
      // After deposit returns from sales, permanent spend = just the screen printing
      permanentSpend: mobilePrint,
      exposure: mobilePrint, // worst case: deposit returns, printing you own
    },
  };
}

const fmt = (n: number) =>
  '$' + Math.round(n).toLocaleString('en-US');

interface LineItemProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  muted?: boolean;
  dark?: boolean;
}

function LineItem({ label, value, sub, accent, muted, dark }: LineItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        py: 1.25,
        borderBottom: `1px solid ${dark ? '#1e1e1e' : '#ebebeb'}`,
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Box>
        <Typography
          variant="body2"
          sx={{
            color: muted ? (dark ? '#444' : '#aaa') : (dark ? '#bbb' : '#444'),
            fontSize: '0.85rem',
            lineHeight: 1.4,
          }}
        >
          {label}
        </Typography>
        {sub && (
          <Typography variant="caption" sx={{ color: dark ? '#444' : '#bbb', fontSize: '0.72rem' }}>
            {sub}
          </Typography>
        )}
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          color: accent ? '#f2bf00' : muted ? (dark ? '#333' : '#ccc') : (dark ? '#eaeaea' : '#111'),
          fontSize: '0.9rem',
          ml: 2,
          flexShrink: 0,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function CostComparison() {
  const [units, setUnits] = useState(100);
  const d = calc(units);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#0f0f0f' }}>
      <Container maxWidth="lg">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: 'center' }}>
            <Typography
              variant="overline"
              sx={{ color: '#444', letterSpacing: '0.15em', fontSize: '0.7rem', display: 'block', mb: 2 }}
            >
              Run the Numbers
            </Typography>
            <Typography variant="h2" component="h2" sx={{ color: '#fff', mb: 3 }}>
              What Does 100 Items Actually Cost?
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', maxWidth: 560, mx: 'auto', lineHeight: 1.75 }}>
              Traditional merch means paying for everything upfront—and carrying the loss on
              whatever doesn&apos;t sell. See how the two models compare.
            </Typography>
          </Box>
        </motion.div>

        {/* Unit toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <ToggleButtonGroup
              value={units}
              exclusive
              onChange={(_, v) => { if (v !== null) setUnits(v); }}
              size="small"
              sx={{
                backgroundColor: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: 2,
                '& .MuiToggleButton-root': {
                  color: '#555',
                  border: 'none',
                  borderRadius: 1,
                  px: 3,
                  py: 1,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    backgroundColor: '#f2bf00',
                    color: '#000',
                    '&:hover': { backgroundColor: '#e0b000' },
                  },
                  '&:hover': { backgroundColor: '#1a1a1a' },
                },
              }}
            >
              {UNIT_OPTIONS.map((u) => (
                <ToggleButton key={u} value={u}>
                  {u} items
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </motion.div>

        {/* Side-by-side cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={units}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
                alignItems: 'start',
              }}
            >
              {/* ── Traditional column ── */}
              <Box
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '2px solid #e0e0e0',
                }}
              >
                <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: '1px solid #ebebeb' }}>
                  <Typography
                    variant="caption"
                    sx={{ color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}
                  >
                    Traditional
                  </Typography>
                  <Typography variant="h5" component="h3" sx={{ color: '#111', mt: 0.5 }}>
                    Buying Merch Upfront
                  </Typography>
                </Box>

                <Box sx={{ px: 3, py: 2 }}>
                  <LineItem label={`${units} blank garments`} sub={`${fmt(BLANK_COST)} ea.`} value={fmt(d.trad.blanks)} />
                  <LineItem label="Screen printing" sub={`${fmt(TRAD_PRINT_PER)} ea. — $10 total per shirt`} value={fmt(d.trad.print)} />
                  <LineItem label="Booth staff" sub="2 people × 8 hrs × $15/hr" value={fmt(d.trad.staff)} />
                  <LineItem label="Storage" sub="Before + after event" value={fmt(d.trad.storage)} />
                </Box>

                <Box sx={{ px: 3, py: 2, backgroundColor: '#f9f9f9', borderTop: '1px solid #ebebeb' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#111', fontSize: '0.85rem' }}>
                      Total upfront spend
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#111', fontSize: '0.95rem' }}>
                      {fmt(d.trad.total)}
                    </Typography>
                  </Box>
                </Box>

                {/* Unsold scenario */}
                <Box
                  sx={{
                    px: 3,
                    py: 2.5,
                    backgroundColor: '#fff3f3',
                    borderTop: '2px solid #ffd0d0',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#e05555',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontSize: '0.68rem',
                      display: 'block',
                      mb: 1.5,
                    }}
                  >
                    If 30% doesn&apos;t sell ({d.trad.unsoldUnits} items)
                  </Typography>
                  <LineItem
                    label="Dead inventory value"
                    sub="Cost of goods that didn't move"
                    value={fmt(d.trad.unsoldValue)}
                    muted
                  />
                  <LineItem
                    label="Ongoing storage cost"
                    sub="Until you sell or discard"
                    value="+ ongoing"
                    muted
                  />
                  <LineItem
                    label="Time liquidating"
                    sub="Discount sales, giveaways, etc."
                    value="+ effort"
                    muted
                  />
                </Box>

                <Box sx={{ px: 3, py: 2.5, backgroundColor: '#ffeaea', borderTop: '1px solid #ffd0d0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#c0392b', fontSize: '0.85rem' }}>
                      Worst-case exposure
                    </Typography>
                    <Typography sx={{ fontWeight: 800, color: '#c0392b', fontSize: '1.25rem' }}>
                      {fmt(d.trad.exposure)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* ── 687 Mobile Merch column ── */}
              <Box
                sx={{
                  backgroundColor: '#0a0a0a',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '2px solid #f2bf00',
                }}
              >
                <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: '1px solid #1e1e1e' }}>
                  <Typography
                    variant="caption"
                    sx={{ color: '#f2bf00', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}
                  >
                    687 Mobile Merch
                  </Typography>
                  <Typography variant="h5" component="h3" sx={{ color: '#fff', mt: 0.5 }}>
                    Our Model
                  </Typography>
                </Box>

                <Box sx={{ px: 3, py: 2 }}>
                  <LineItem
                    label={`Screen printing (${units} transfers)`}
                    sub={`${fmt(TRANSFER_PRINT_PER)} ea. — you own these`}
                    value={fmt(d.mobile.print)}
                    dark
                  />
                  <LineItem
                    label="Blank garments"
                    sub="We bring these. You pay nothing."
                    value="$0"
                    dark
                    accent
                  />
                  <LineItem
                    label="Operational deposit"
                    sub="Labor, travel, overhead — returned from sales"
                    value={fmt(d.mobile.deposit)}
                    dark
                  />
                  <LineItem
                    label="Booth staff"
                    sub="Included. We run the booth."
                    value="$0"
                    dark
                    accent
                  />
                  <LineItem
                    label="Storage"
                    sub="We take the blanks back."
                    value="$0"
                    dark
                    accent
                  />
                </Box>

                <Box sx={{ px: 3, py: 2, backgroundColor: '#111', borderTop: '1px solid #1e1e1e' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#eaeaea', fontSize: '0.85rem' }}>
                      Total upfront spend
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#eaeaea', fontSize: '0.95rem' }}>
                      {fmt(d.mobile.total)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#444', fontSize: '0.72rem' }}>
                    {fmt(d.mobile.deposit)} of this returns from event sales
                  </Typography>
                </Box>

                {/* No-unsold scenario */}
                <Box
                  sx={{
                    px: 3,
                    py: 2.5,
                    backgroundColor: 'rgba(242,191,0,0.05)',
                    borderTop: '2px solid rgba(242,191,0,0.2)',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#f2bf00',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontSize: '0.68rem',
                      display: 'block',
                      mb: 1.5,
                    }}
                  >
                    If 30% doesn&apos;t sell
                  </Typography>
                  <LineItem label="Dead inventory" sub="We take the blanks back." value="$0" dark accent />
                  <LineItem label="Ongoing storage" sub="No finished goods to store." value="$0" dark accent />
                  <LineItem label="Time liquidating" sub="Nothing to liquidate." value="$0" dark accent />
                </Box>

                <Box sx={{ px: 3, py: 2.5, backgroundColor: 'rgba(242,191,0,0.08)', borderTop: '1px solid rgba(242,191,0,0.15)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#f2bf00', fontSize: '0.85rem' }}>
                        Worst-case exposure
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#555', fontSize: '0.7rem' }}>
                        Your screen printing. You own it. Use it anytime.
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 800, color: '#f2bf00', fontSize: '1.25rem' }}>
                      {fmt(d.mobile.exposure)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>

        {/* Summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box
            sx={{
              mt: 4,
              p: { xs: 3, md: 4 },
              backgroundColor: '#111',
              borderRadius: 3,
              border: '1px solid #1e1e1e',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 4,
              alignItems: { sm: 'center' },
              justifyContent: 'space-around',
              textAlign: 'center',
            }}
          >
            <Box>
              <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1, color: '#c0392b' }}>
                {fmt(d.trad.exposure)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}>
                Traditional worst-case exposure
              </Typography>
            </Box>

            <Box sx={{ color: '#2a2a2a', fontSize: '2rem', display: { xs: 'none', sm: 'block' } }}>vs</Box>

            <Box>
              <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1, color: '#f2bf00' }}>
                {fmt(d.mobile.exposure)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}>
                687 worst-case exposure
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'block' }, borderLeft: '1px solid #1e1e1e', pl: 4 }}>
              <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1, color: '#fff' }}>
                {Math.round(d.trad.exposure / d.mobile.exposure)}×
              </Typography>
              <Typography variant="caption" sx={{ color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}>
                More risk, traditional model
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <Typography
            variant="caption"
            sx={{ display: 'block', textAlign: 'center', color: '#333', mt: 3, fontSize: '0.72rem' }}
          >
            Figures are illustrative estimates. Actual costs vary by order size, garment selection, event location, and duration.
          </Typography>
        </motion.div>

      </Container>
    </Box>
  );
}
