'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

// ─── Illustrative pricing (100 items) ───────────────────────────────────────
const UNITS = 100;
const BLANK_COST = 5;           // wholesale blank (Bella Canvas, etc.)
const TRAD_PRINT_PER = 5;       // traditional screen print per garment ($4–7 depending on colors)
const TRAD_SETUP = 40;          // one-time setup fee per design ($35–50 typical)
const TRANSFER_PRINT_PER = 3.5; // 687 screen printing to transfer sheets
const TRAD_STAFF = 320;         // 2 staff × 8 hrs × $20
const TRAD_STORAGE = 75;        // storage before + after
const MOBILE_DEPOSIT = 375;     // operational deposit — returned from sales
const UNSOLD_RATE = 0.3;

function calc(units: number) {
  const tradTotal = units * BLANK_COST + units * TRAD_PRINT_PER + TRAD_SETUP + TRAD_STAFF + TRAD_STORAGE;
  const tradUnsoldUnits = Math.round(units * UNSOLD_RATE);
  const tradUnsoldValue = tradUnsoldUnits * (BLANK_COST + TRAD_PRINT_PER);

  const mobilePrint = units * TRANSFER_PRINT_PER;
  const mobileTotal = mobilePrint + MOBILE_DEPOSIT;

  return {
    units,
    unsoldUnits: tradUnsoldUnits,
    rows: {
      blanks:    { trad: units * BLANK_COST,     mobile: 0 },
      setup:     { trad: TRAD_SETUP,             mobile: 0 },
      printing:  { trad: units * TRAD_PRINT_PER, mobile: mobilePrint },
      staff:     { trad: TRAD_STAFF,             mobile: 0 },
      storage:   { trad: TRAD_STORAGE,           mobile: 0 },
      deposit:   { trad: null,                   mobile: MOBILE_DEPOSIT },
    },
    totals: { trad: tradTotal, mobile: mobileTotal },
    unsold: {
      inventory: { trad: tradUnsoldValue, mobile: 0 },
    },
    exposure: { trad: tradTotal + tradUnsoldValue, mobile: mobilePrint },
  };
}

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const ZERO = <span style={{ color: '#f2bf00', fontWeight: 700 }}>$0</span>;

// ─── Shared cell styles ─────────────────────────────────────────────────────
const LABEL_COL = { xs: '38%', md: '34%' };
const VAL_COL   = '1fr';

interface RowProps {
  label: string;
  tradSub?: string;
  mobileSub?: string;
  tradVal: React.ReactNode;
  mobileVal: React.ReactNode;
  sectionBg?: string;
  highlight?: 'red' | 'yellow';
  bold?: boolean;
}

function CompareRow({ label, tradSub, mobileSub, tradVal, mobileVal, sectionBg, highlight, bold }: RowProps) {
  const isRed    = highlight === 'red';
  const isYellow = highlight === 'yellow';

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `${LABEL_COL.xs} ${VAL_COL} ${VAL_COL}`,
        '@media (min-width: 600px)': {
          gridTemplateColumns: `${LABEL_COL.md} ${VAL_COL} ${VAL_COL}`,
        },
        backgroundColor: sectionBg ?? 'transparent',
        borderBottom: '1px solid #1e1e1e',
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      {/* Label */}
      <Box sx={{ px: { xs: 2, md: 3 }, py: 1.75, borderRight: '1px solid #1e1e1e' }}>
        <Typography
          variant="body2"
          sx={{ color: bold ? '#eaeaea' : '#999', fontWeight: bold ? 700 : 400, fontSize: '0.82rem', lineHeight: 1.35 }}
        >
          {label}
        </Typography>
      </Box>

      {/* Traditional value */}
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 1.75,
          borderRight: '1px solid #1e1e1e',
          backgroundColor: isRed ? 'rgba(192,57,43,0.06)' : undefined,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: bold ? 800 : 600,
            color: isRed ? '#e74c3c' : bold ? '#eaeaea' : '#ccc',
            fontSize: bold ? '0.95rem' : '0.88rem',
          }}
        >
          {tradVal}
        </Typography>
        {tradSub && (
          <Typography variant="caption" sx={{ color: '#666', fontSize: '0.68rem', display: { xs: 'none', sm: 'block' }, mt: 0.3 }}>
            {tradSub}
          </Typography>
        )}
      </Box>

      {/* 687 value */}
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 1.75,
          backgroundColor: isYellow ? 'rgba(242,191,0,0.07)' : undefined,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: bold ? 800 : 600,
            color: isYellow ? '#f2bf00' : bold ? '#f2bf00' : undefined,
            fontSize: bold ? '0.95rem' : '0.88rem',
          }}
        >
          {mobileVal}
        </Typography>
        {mobileSub && (
          <Typography variant="caption" sx={{ color: '#666', fontSize: '0.68rem', display: { xs: 'none', sm: 'block' }, mt: 0.3 }}>
            {mobileSub}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function SectionHeader({ label, danger }: { label: string; danger?: boolean }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `${LABEL_COL.xs} 1fr`,
        '@media (min-width: 600px)': { gridTemplateColumns: `${LABEL_COL.md} 1fr` },
        borderBottom: '1px solid #1e1e1e',
        backgroundColor: danger ? 'rgba(192,57,43,0.04)' : '#111',
      }}
    >
      <Box sx={{ gridColumn: '1 / -1', px: { xs: 2, md: 3 }, py: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: danger ? '#c0392b' : '#3a3a3a',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontSize: '0.68rem',
            fontWeight: 700,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

const d = calc(UNITS);

export default function CostComparison() {
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
            <Typography variant="h2" component="h2" sx={{ color: '#fff', mb: 3 }}>
              Their Model vs. Ours
            </Typography>
            <Typography variant="body1" sx={{ color: '#555', maxWidth: 520, mx: 'auto', lineHeight: 1.75 }}>
              What does a 100-item event merch run actually cost—and what happens if 30% doesn&apos;t sell?
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
        >
            {/* Table */}
            <Box
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid #1e1e1e',
              }}
            >

              {/* Column headers */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `${LABEL_COL.xs} ${VAL_COL} ${VAL_COL}`,
                  '@media (min-width: 600px)': {
                    gridTemplateColumns: `${LABEL_COL.md} ${VAL_COL} ${VAL_COL}`,
                  },
                  backgroundColor: '#0a0a0a',
                  borderBottom: '2px solid #1e1e1e',
                }}
              >
                <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderRight: '1px solid #1e1e1e' }} />
                <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderRight: '1px solid #1e1e1e' }}>
                  <Typography variant="caption" sx={{ color: '#555', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 0.25 }}>
                    Their model
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888', fontWeight: 700, fontSize: '0.82rem' }}>
                    Traditional
                  </Typography>
                </Box>
                <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
                  <Typography variant="caption" sx={{ color: '#f2bf00', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 0.25 }}>
                    Our model
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#f2bf00', fontWeight: 700, fontSize: '0.82rem' }}>
                    687 Mobile Merch
                  </Typography>
                </Box>
              </Box>

              {/* ── Upfront costs ── */}
              <SectionHeader label="Upfront costs" />

              <CompareRow
                label="Blank garments"
                tradSub={`${UNITS} × $5 ea.`}
                mobileSub="We bring these at our cost"
                tradVal={fmt(d.rows.blanks.trad)}
                mobileVal={ZERO}
              />
              <CompareRow
                label="Setup fee"
                tradSub="Per design, per run ($35–50)"
                mobileSub="Included in transfer rate"
                tradVal={fmt(d.rows.setup.trad)}
                mobileVal={ZERO}
              />
              <CompareRow
                label="Screen printing"
                tradSub={`${UNITS} × $5 ea. ($4–7 by color count)`}
                mobileSub="To transfer sheets you own"
                tradVal={fmt(d.rows.printing.trad)}
                mobileVal={fmt(d.rows.printing.mobile)}
              />
              <CompareRow
                label="Booth staff"
                tradSub="2 people × 8 hrs × $20/hr"
                mobileSub="Included — we run the booth"
                tradVal={fmt(d.rows.staff.trad)}
                mobileVal={ZERO}
              />
              <CompareRow
                label="Storage"
                tradSub="Before + after event"
                mobileSub="We take the blanks back"
                tradVal={fmt(d.rows.storage.trad)}
                mobileVal={ZERO}
              />
              <CompareRow
                label="Operational deposit"
                tradSub="They drop off the order. The event is yours."
                mobileSub="Labor, travel, overhead — returned from sales"
                tradVal="—"
                mobileVal={fmt(MOBILE_DEPOSIT)}
              />

              {/* ── Totals ── */}
              <CompareRow
                label="Total upfront spend"
                tradVal={fmt(d.totals.trad)}
                mobileVal={`${fmt(d.totals.mobile)}*`}
                bold
                sectionBg="#0a0a0a"
              />

              {/* ── Unsold scenario ── */}
              <SectionHeader label={`If 30% doesn't sell — ${d.unsoldUnits} items`} danger />

              <CompareRow
                label="Dead inventory"
                tradSub={`${d.unsoldUnits} items × $10 cost`}
                mobileSub="We take the blanks back"
                tradVal={fmt(d.unsold.inventory.trad)}
                mobileVal={ZERO}
              />
              <CompareRow
                label="Ongoing storage"
                tradSub="Until you sell or discard"
                mobileSub="No finished goods to store"
                tradVal="+ ongoing"
                mobileVal={ZERO}
              />
              <CompareRow
                label="Time liquidating"
                tradSub="Discount sales, giveaways, etc."
                mobileSub="Nothing to liquidate"
                tradVal="+ effort"
                mobileVal={ZERO}
              />

              {/* ── Worst-case exposure ── */}
              <CompareRow
                label="Worst-case exposure"
                tradVal={fmt(d.exposure.trad)}
                mobileVal={`${fmt(d.exposure.mobile)}†`}
                bold
                highlight="red"
                sectionBg="#0a0a0a"
              />
            </Box>

            {/* Footnotes */}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                * {fmt(MOBILE_DEPOSIT)} of this is your operational deposit, returned to you once event sales cover it.
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                † Your worst-case is the screen printing cost—prints you own outright and can use on any future order or event.
              </Typography>
              <Typography variant="caption" sx={{ color: '#555', fontSize: '0.7rem' }}>
                Figures are illustrative. Actual costs vary by garment selection, event size, location, and duration.
              </Typography>
            </Box>

            {/* Summary bar */}
            <Box
              sx={{
                mt: 4,
                p: { xs: 3, md: 4 },
                backgroundColor: '#0a0a0a',
                borderRadius: 3,
                border: '1px solid #1e1e1e',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 3, sm: 0 },
                alignItems: 'center',
                justifyContent: 'space-around',
                textAlign: 'center',
              }}
            >
              <Box>
                <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: { xs: '2.8rem', md: '3.8rem' }, lineHeight: 1, color: '#e74c3c' }}>
                  {fmt(d.exposure.trad)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}>
                  Traditional worst-case
                </Typography>
              </Box>

              <Typography sx={{ color: '#666', fontSize: '1.5rem', display: { xs: 'none', sm: 'block' } }}>vs</Typography>

              <Box>
                <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: { xs: '2.8rem', md: '3.8rem' }, lineHeight: 1, color: '#f2bf00' }}>
                  {fmt(d.exposure.mobile)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}>
                  687 worst-case
                </Typography>
              </Box>

              <Box sx={{ display: { xs: 'none', lg: 'block' }, borderLeft: '1px solid #1e1e1e', pl: 4 }}>
                <Typography sx={{ fontFamily: 'var(--font-anton), "Anton", sans-serif', fontSize: { xs: '2.8rem', md: '3.8rem' }, lineHeight: 1, color: '#fff' }}>
                  {Math.round(d.exposure.trad / d.exposure.mobile)}×
                </Typography>
                <Typography variant="caption" sx={{ color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.68rem' }}>
                  More risk, their model
                </Typography>
              </Box>
            </Box>
        </motion.div>

      </Container>
    </Box>
  );
}
