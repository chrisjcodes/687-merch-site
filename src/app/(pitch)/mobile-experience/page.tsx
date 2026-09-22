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

const DEPOSIT = 540;
const DROP_UNITS = 50;
const DROP_PRICE = 45;
const dropRevenue = DROP_UNITS * DROP_PRICE;
const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

export default function MobileExperiencePage() {
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
              The merch table<br />
              <Box component="span" sx={{ color: '#f2bf00' }}>that draws a crowd.</Box>
            </Typography>

            <Typography variant="body1" sx={{ color: '#999', maxWidth: 560, lineHeight: 1.8, mb: 4, fontSize: '1rem', mx: 'auto' }}>
              Most merch setups are a folding table in a corner. We pull up an LED-lit production van, print live in front of your crowd, and give people something to watch — and when demand is high, you earn on it.
            </Typography>

            {/* Van glow visual */}
            <Box
              sx={{
                mx: 'auto',
                maxWidth: 420,
                border: '1px solid #2a2a2a',
                borderRadius: 3,
                p: { xs: 3, md: 4 },
                backgroundColor: '#080808',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at 50% 100%, rgba(242,191,0,0.10) 0%, transparent 70%)',
                  pointerEvents: 'none',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1.5, sm: 2 }, mb: 3, flexWrap: 'wrap' }}>
                {['LED lighting', 'Live printing', 'Your branding'].map((tag) => (
                  <Box
                    key={tag}
                    sx={{
                      px: 2,
                      py: 0.75,
                      border: '1px solid rgba(242,191,0,0.3)',
                      borderRadius: 5,
                      backgroundColor: 'rgba(242,191,0,0.06)',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#f2bf00', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {tag}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: '#777', fontSize: '0.82rem', lineHeight: 1.7, textAlign: 'center' }}>
                A production van that is itself part of the event — not just a table to walk past.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── The spectacle ───────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              The experience
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              People watch. People film. People buy.
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', maxWidth: 560, lineHeight: 1.8, mb: { xs: 5, md: 7 } }}>
              Live printing draws a crowd on its own. When people see a shirt being made in front of them — LEDs, heat press, the whole setup — they stop. That attention turns into sales, and those sales turn into content that outlasts the event.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {[
              {
                icon: '✦',
                title: 'LED production van',
                body: 'The van is fitted with an LED lighting system that makes the whole setup a visual centerpiece — day or night. People notice it before they see the merch.',
              },
              {
                icon: '✦',
                title: 'Live printing, visible to all',
                body: 'The heat press and printing process happen out in the open. Watching a blank shirt become a finished piece in under a minute is a moment people share.',
              },
              {
                icon: '✦',
                title: 'Built-in social content',
                body: "People film live printing. Every video of our setup at your event is organic reach for your brand — something a pre-printed merch table never gives you. We also create structured moments for live reactions, social reviews, and shareable content around your drop.",
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.45, delay: i * 0.08 }}>
                <Box sx={{ p: { xs: 3, md: 3.5 }, border: '1px solid #1e1e1e', borderRadius: 2, height: '100%' }}>
                  <Typography sx={{ color: '#f2bf00', fontSize: '1rem', mb: 2, lineHeight: 1 }}>
                    {item.icon}
                  </Typography>
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

      {/* ── App-driven ordering ─────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              No line. No wait. No guesswork.
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              Scan. Order. Pick up.
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', maxWidth: 560, lineHeight: 1.8, mb: { xs: 5, md: 7 } }}>
              We&apos;re building a fully app-driven ordering system. Scan a code at the event, browse what we&apos;re printing right now, build your cart, pay — and your order hits our van&apos;s display in real time. We fulfill it, you get notified, you pick it up. No line at the counter, no shouting over a crowd.
            </Typography>
          </motion.div>

          {/* Order flow steps */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: { xs: 2, md: 1.5 } }}>
            {[
              {
                step: '01',
                title: 'Scan',
                body: 'QR code anywhere at the venue — poster, table, van itself.',
              },
              {
                step: '02',
                title: 'Browse',
                body: "Live catalog showing what's available right now, with pricing.",
              },
              {
                step: '03',
                title: 'Order & pay',
                body: 'Build your cart and pay on your phone. No cash, no card swipes.',
              },
              {
                step: '04',
                title: 'We receive it',
                body: 'Order appears on our custom display inside the van — we get to work.',
              },
              {
                step: '05',
                title: 'Pickup notification',
                body: "We notify you when it's ready. No waiting around — enjoy the show.",
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.45, delay: i * 0.07 }}>
                <Box
                  sx={{
                    p: { xs: 3, md: 3 },
                    border: '1px solid #1e1e1e',
                    borderRadius: 2,
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-anton), "Anton", sans-serif',
                      fontSize: '1.6rem',
                      lineHeight: 1,
                      color: 'rgba(242,191,0,0.18)',
                      mb: 2,
                    }}
                  >
                    {item.step}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.7, fontSize: '0.82rem' }}>
                    {item.body}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          <motion.div {...fadeUp}>
            <Box sx={{ mt: 4, p: { xs: 3, md: 4 }, border: '1px solid #222', borderLeft: '3px solid #f2bf00', borderRadius: 2, backgroundColor: '#080808' }}>
              <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.88rem', mb: 1 }}>
                Coming soon — in development now
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.75, fontSize: '0.85rem' }}>
                The ordering system is being built. If you want to be one of the first events to run it, get in touch — we&apos;re working with early partners to shape how it works.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── White label ─────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 6, md: 10 }, alignItems: 'center' }}>
            <motion.div {...fadeUp}>
              <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
                White label — optional add-on
              </Typography>
              <Typography variant="h2" sx={{ color: '#fff', mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                It can look like your operation.
              </Typography>
              <Typography variant="body1" sx={{ color: '#888', lineHeight: 1.8, mb: 2 }}>
                If you want the booth fully branded to your event — your name, your logo, your colors — we can do that. To everyone at the venue, it looks like your operation. We&apos;re just the production behind it.
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.8, mb: 4, fontSize: '0.88rem' }}>
                These are optional add-ons, not included by default. Each one is scoped and priced as part of your operational deposit when you book.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'Custom van signage — your name, logo, and color scheme',
                  'Staff branded gear — tees or hats matching your event',
                  'Branded booth display — pricing boards, garment display',
                  'Receipts & packaging — your brand at every touchpoint',
                ].map((line, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#555', mt: 0.8, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: '#777', fontSize: '0.88rem', lineHeight: 1.6 }}>{line}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }}>
              <Box sx={{ p: { xs: 3, md: 4 }, border: '1px solid #222', borderRadius: 2, backgroundColor: '#080808' }}>
                <Typography variant="body2" sx={{ color: '#888', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                  Optional add-ons
                </Typography>
                <Typography variant="caption" sx={{ color: '#555', fontSize: '0.78rem', display: 'block', mb: 3 }}>
                  Priced individually as part of your deposit
                </Typography>
                {[
                  { label: 'Van signage', detail: 'Full swap — your name, logo, and color scheme' },
                  { label: 'Staff gear', detail: 'Branded tees or hats matching your event' },
                  { label: 'Booth display', detail: 'Garment display, pricing boards, all branded' },
                  { label: 'Receipts & packaging', detail: 'Your brand at every touchpoint' },
                ].map((row, i) => (
                  <Box
                    key={i}
                    sx={{
                      py: 2,
                      borderBottom: i < 3 ? '1px solid #1a1a1a' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#ccc', fontWeight: 600, fontSize: '0.88rem', flexShrink: 0 }}>
                      {row.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666', fontSize: '0.78rem', textAlign: 'right', lineHeight: 1.5 }}>
                      {row.detail}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* ── Revenue model vs. hired printer ─────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              How we&apos;re different
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              You&apos;re not hiring us. You&apos;re partnering with us.
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', maxWidth: 560, lineHeight: 1.8, mb: { xs: 5, md: 7 } }}>
              A hired live printer charges a large booking fee plus a per-item cost for materials. They keep every dollar of upside — the event pays to have them there, and that&apos;s where the relationship ends. Our model ties our outcome to yours. If it&apos;s slow, your deposit comes back from first sales. If it pops, you earn above that. The floor with us is better than the ceiling with anyone else.
            </Typography>
          </motion.div>

          {/* Break-even framing */}
          <motion.div {...fadeUp}>
            <Box
              sx={{
                mb: { xs: 5, md: 7 },
                p: { xs: 3, md: 4 },
                border: '1px solid #222',
                borderLeft: '3px solid #f2bf00',
                borderRadius: 2,
                backgroundColor: '#080808',
              }}
            >
              <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.92rem', mb: 1.5 }}>
                Even breaking even beats the alternative.
              </Typography>
              <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.8, fontSize: '0.88rem' }}>
                With a hired live printer, you pay a booking fee and per-item material costs — regardless of what sells — and there&apos;s no scenario where you see any of that back. With us, if the event is slow and sales only cover the deposit, you still walk away at zero. That&apos;s already better than writing a check with no upside. When demand is strong, everything above the deposit splits in your favor.
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            {/* Hired printer */}
            <motion.div {...fadeUp}>
              <Box sx={{ p: { xs: 3, md: 4 }, border: '1px solid #222', borderRadius: 2, height: '100%' }}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 3 }}>
                  Hired live printer
                </Typography>
                {[
                  { label: 'What you pay', value: 'Booking fee + per-item material cost' },
                  { label: 'Who keeps the sales', value: 'Printer keeps all of it' },
                  { label: 'Your upside', value: 'None — you paid to have them there' },
                  { label: 'If it\'s a slow night', value: 'You still owe the full booking fee' },
                  { label: 'The spectacle', value: 'A screen printing wheel' },
                ].map((row, i) => (
                  <Box key={i} sx={{ py: 1.75, borderBottom: i < 4 ? '1px solid #1a1a1a' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: '#555', fontSize: '0.8rem' }}>{row.label}</Typography>
                    <Typography variant="caption" sx={{ color: '#555', fontSize: '0.8rem', textAlign: 'right' }}>{row.value}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>

            {/* Mobile Merch */}
            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.08 }}>
              <Box sx={{ p: { xs: 3, md: 4 }, border: '1px solid rgba(242,191,0,0.25)', borderRadius: 2, height: '100%', backgroundColor: 'rgba(242,191,0,0.02)' }}>
                <Typography variant="body2" sx={{ color: '#f2bf00', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 3 }}>
                  Mobile Merch
                </Typography>
                {[
                  { label: 'What you pay', value: `Print cost + ${fmt(DEPOSIT)} deposit`, green: false },
                  { label: 'Who keeps the sales', value: 'Split — after deposit returns to you', green: true },
                  { label: 'Your upside', value: 'Everything above the deposit, split with you', green: true },
                  { label: 'If it\'s a slow night', value: 'Deposit returns from first sales', green: true },
                  { label: 'The spectacle', value: 'LED-lit production van', green: true },
                ].map((row, i) => (
                  <Box key={i} sx={{ py: 1.75, borderBottom: i < 4 ? '1px solid rgba(242,191,0,0.1)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: '#888', fontSize: '0.8rem' }}>{row.label}</Typography>
                    <Typography variant="caption" sx={{ color: row.green ? '#27ae60' : '#ccc', fontSize: '0.8rem', textAlign: 'right', fontWeight: row.green ? 600 : 400 }}>{row.value}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* ── Exclusive drops ──────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 6, md: 10 }, alignItems: 'center' }}>
            <motion.div {...fadeUp}>
              <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
                Exclusive drops
              </Typography>
              <Typography variant="h2" sx={{ color: '#fff', mb: 3, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                Limited. On-location. One shot.
              </Typography>
              <Typography variant="body1" sx={{ color: '#888', lineHeight: 1.8, mb: 4 }}>
                Want to do {DROP_UNITS} pieces and {DROP_UNITS} only — available for two hours at one location? We can run that. Exclusive drops with influencers, brands, or artists create real urgency without you having to pre-buy a single item.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  'Set a hard cap on units — we stop when you say stop',
                  'Tie to a specific time window to drive urgency',
                  'Influencer or brand collabs with no upfront inventory risk',
                  'Every item is made at the event — the scarcity is real',
                ].map((line, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#f2bf00', mt: 0.8, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: '#888', fontSize: '0.88rem', lineHeight: 1.6 }}>{line}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>

            {/* Drop scenario callout */}
            <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }}>
              <Box
                sx={{
                  border: '1px solid #222',
                  borderLeft: '3px solid #f2bf00',
                  borderRadius: 2,
                  backgroundColor: '#080808',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ px: { xs: 3, md: 4 }, pt: { xs: 3, md: 4 }, pb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#eaeaea', fontWeight: 700, fontSize: '0.9rem', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    This is an example scenario
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666', fontSize: '0.8rem' }}>
                    Numbers are illustrative — actual terms vary by event
                  </Typography>
                </Box>
                <Box sx={{ px: { xs: 3, md: 4 }, pb: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { label: 'Units available', value: `${DROP_UNITS} pieces`, sub: 'Hard cap — first come, first served' },
                    { label: 'Retail price', value: fmt(DROP_PRICE), sub: 'What fans pay at the event' },
                    { label: 'Max event revenue', value: fmt(dropRevenue), sub: 'If all 50 sell out' },
                    { label: 'Your deposit exposure', value: fmt(DEPOSIT), sub: 'Returns from first sales before split' },
                    { label: 'Inventory you pre-buy', value: '$0', sub: 'We handle all blanks' },
                  ].map((row, i) => (
                    <Box
                      key={i}
                      sx={{
                        py: 2,
                        borderTop: '1px solid #1a1a1a',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ color: '#555', fontSize: '0.76rem', display: 'block', mb: 0.25 }}>
                          {row.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', fontSize: '0.72rem', display: 'block', lineHeight: 1.4 }}>
                          {row.sub}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: row.label === 'Inventory you pre-buy' ? '#27ae60' : '#eaeaea',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          flexShrink: 0,
                        }}
                      >
                        {row.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* ── Use cases ───────────────────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="lg">
          <motion.div {...fadeUp}>
            <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.74rem', fontWeight: 700, display: 'block', mb: 2 }}>
              Who this is for
            </Typography>
            <Typography variant="h2" sx={{ color: '#fff', mb: { xs: 5, md: 7 }, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              Any event where the crowd is the market.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {[
              {
                type: 'Concerts & shows',
                desc: 'Live printing during a set. The van is part of the venue experience. Exclusive per-night designs if you want them.',
              },
              {
                type: 'Brand activations',
                desc: "White-labeled entirely. Your brand's merch operation — live, on-site, with zero logistics on your end.",
              },
              {
                type: 'Influencer drops',
                desc: 'Limited-edition collab with a creator. Set the cap, set the window, generate the urgency. No pre-buy required.',
              },
              {
                type: 'Festivals & markets',
                desc: "A booth that earns attention before it earns sales. LED setup and live printing draw foot traffic from across the venue.",
              },
              {
                type: 'Sports & tailgates',
                desc: 'Event-specific designs at the event. Fans buy something that only existed for that game — the scarcity is built in.',
              },
              {
                type: 'Pop-ups & launches',
                desc: "Product launch, store opening, new collection. We show up, print live, and the merch table becomes part of the story.",
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}>
                <Box sx={{ p: { xs: 3, md: 3 }, border: '1px solid #1e1e1e', borderRadius: 2, height: '100%' }}>
                  <Typography variant="body2" sx={{ color: '#f2bf00', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1.5 }}>
                    {item.type}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.75, fontSize: '0.84rem' }}>
                    {item.desc}
                  </Typography>
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
                Bring the show.<br />
                <Box component="span" sx={{ color: '#f2bf00' }}>Take home the check.</Box>
              </Typography>
              <Typography variant="body1" sx={{ color: '#888', mb: 6, maxWidth: 400, mx: 'auto', lineHeight: 1.75 }}>
                Tell us your event, your audience, and what you want to sell. We&apos;ll show you exactly how the setup works and what you walk away with.
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
