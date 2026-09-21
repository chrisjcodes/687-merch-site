'use client';

import React, { useState, useMemo } from 'react';
import { Box, Typography, Container, InputBase } from '@mui/material';
import { motion } from 'framer-motion';

// ─── FAQ data ────────────────────────────────────────────────────────────────

interface FaqItem {
  q: string;
  a: string;
  bullets?: string[];
}

interface FaqSection {
  category: string;
  items: FaqItem[];
}

const FAQ_DATA: FaqSection[] = [
  {
    category: 'Our production models',
    items: [
      {
        q: 'What are the three production models you offer?',
        a: 'We offer three models built for different situations. Traditional Production is the model most people know — you pick your garments, quantities, and design, we print and deliver everything. Flexible Merch Production prints your design to transfer sheets instead of garments, so the same artwork can be applied to any blank on your schedule. Mobile Merch means we show up to your event with a production van, print live on-site, and split revenue after your deposit returns. Each one is a different answer to the question of who carries the inventory risk.',
      },
      {
        q: 'How does Flexible Merch Production work?',
        a: 'We run your design through the same screen printing process as traditional printing — but instead of applying ink directly to a garment, we print onto transfer sheets. You pay for the print run upfront, and then those transfers can be applied to blank garments using a heat press whenever you need them. This decouples the design cost from the garment order, so you can print 100 transfer sheets now and apply them to tees, hoodies, or a new colorway over time — without paying for a new print run each time.',
      },
      {
        q: 'How does the Mobile Merch deposit and revenue split work?',
        a: 'You pay for the screen printing upfront plus an operational deposit that covers our labor, travel, and event overhead. At the event, sales return your deposit first — before we take anything. Everything above the deposit splits 50/50. If it\'s a slow night and sales only cover the deposit, you walk away at zero. That\'s still better than paying a hired live printer a flat booking fee with no upside at all.',
      },
      {
        q: 'What happens to unsold inventory after a Mobile Merch event?',
        a: "We take the blank garments back. You don't store anything, sell off leftovers, or write anything off. Your exposure is the print cost you've already committed to, and the operational deposit — which sales pay back first.",
      },
      {
        q: 'Can Mobile Merch do exclusive or limited-edition drops?',
        a: 'Yes. You can set a hard cap on units, tie the drop to a specific time window, or run it as an influencer or brand collab. Since we print on-site as items are ordered, the scarcity is real — we stop when you say stop, and no one can buy one before the event.',
      },
      {
        q: 'How is Mobile Merch different from hiring a live printer?',
        a: 'A hired live printer charges a large booking fee plus per-item material costs. They keep all the sales revenue — the event pays to have them there, and that\'s where the relationship ends. With Mobile Merch, our outcome is tied to yours. Your deposit comes back from sales before we earn anything, and you share in the upside when demand is strong. The spectacle is also different: a production van with an LED lighting system versus a standard screen printing table.',
      },
    ],
  },
  {
    category: 'Screen print transfers',
    items: [
      {
        q: 'What is a screen print transfer?',
        a: 'A screen print transfer is your design printed onto a special release paper using the same inks and screens used in traditional screen printing. The ink sits on the paper until it\'s transferred to a blank using a heat press. The end result is visually and texturally identical to a traditional screen print — same ink, same feel, same durability. The difference is that application happens separately from printing, which gives you flexibility on timing and garment choice.',
      },
      {
        q: 'How does a screen print transfer compare to traditional screen printing?',
        a: 'Quality-wise, they\'re the same. Same inks, same vibrancy, same hand feel on the fabric. The operational difference is that traditional screen printing applies the design directly to a specific garment during a single production run. Transfers decouple the printing from the garment, so you can print in quantity now and apply on demand. This means you can offer multiple garment styles and colorways from one print run, restock without reordering artwork, and carry transfers across multiple events.',
      },
      {
        q: 'Do you do digital printing (DTG or DTF)?',
        a: 'We primarily work with screen print transfers — including full-color process printing — because of the quality, durability, and per-unit cost advantages at volume. We do use DTF (direct-to-film) in specific situations, and we\'ll tell you honestly when it\'s the right call.',
        bullets: [
          'Finite small quantities — if you truly won\'t need more of a design and screen setup costs aren\'t justified',
          'Certain items like hats, where DTF can produce a better result depending on the specific design',
        ],
      },
      {
        q: 'When would you recommend DTF over screen print transfers?',
        a: 'DTF makes the most sense for finite, small-quantity runs where you\'re confident you won\'t need more of that design — typically under 24 pieces — and where paying for screen setup doesn\'t make economic sense. It\'s also worth considering for certain items like hats, where the design and application constraints sometimes favor DTF over screen print. For ongoing or repeatable merch needs, screen print transfers are almost always the better choice — lower per-unit cost at quantity, same or better durability, and the flexibility to reorder without new setup costs.',
      },
      {
        q: 'Can you do full-color and photographic designs on screen print transfers?',
        a: 'Yes — we can do full-color process screen printing to transfer, which handles photographic detail, gradients, and complex imagery the same way a traditional process screen print would. Having a photographic design doesn\'t automatically move you to digital. We\'ll assess the design and recommend the right approach based on your quantity, the specific artwork, and the item you\'re printing on.',
      },
      {
        q: 'How durable are screen print transfers compared to direct screen prints?',
        a: 'When properly applied, screen print transfers have the same wash durability as a traditional direct screen print. Correct heat and pressure during application is critical — improperly applied transfers can crack or peel early. That\'s one reason we control the application process rather than shipping transfers for someone else to press without guidance.',
      },
    ],
  },
  {
    category: 'Garments & products',
    items: [
      {
        q: 'What garment and product types can you print on?',
        a: 'Most apparel and soft goods that can take heat press application and handle the transfer process. Common items we work with:',
        bullets: [
          'T-shirts (all weights and fits)',
          'Hoodies and crewnecks',
          'Long sleeves and henleys',
          'Tank tops',
          'Tote bags',
          'Hats (structured front panels work best)',
          'Patches and cut-and-sew pieces',
        ],
      },
      {
        q: 'Are there fabrics or items that don\'t work with heat transfers?',
        a: 'A few. Very high-stretch fabrics like spandex-heavy athletic wear can cause transfers to crack over time as the fabric moves. Some nylons and synthetic blends may not bond properly or can be damaged by the heat required. Items with thick structural seams or hardware that prevent a flat press are also difficult. We\'ll flag these before you commit to a garment.',
      },
      {
        q: 'Do you supply blanks or can I bring my own?',
        a: 'We source blanks for all our production models. For Traditional and Flexible production, we work with wholesale suppliers and pass quantity savings along. For Mobile Merch, we own and manage blank inventory across events. If you have a specific blank you want to use, bring it up — the main requirement is that it\'s compatible with heat transfer application and fits the print.',
      },
      {
        q: 'Can you print on hats and accessories?',
        a: 'Yes. Structured snapbacks, dad hats, and caps with a flat front panel work well with screen print transfers. Curved-brim finished hats require a specialty press that we have. That said, for hats specifically, DTF can produce a better result depending on the design — particularly for designs with fine detail or certain color combinations. We\'ll tell you which approach makes more sense for your specific hat and artwork. Tote bags and flat accessories are generally straightforward.',
      },
    ],
  },
  {
    category: 'Pricing & costs',
    items: [
      {
        q: 'What are the main cost levers on a project?',
        a: 'Four things drive the most variation in cost:',
        bullets: [
          'Quantity — more units spreads setup costs across more pieces, lowering the per-unit price',
          'Number of colors — each ink color requires its own screen and increases setup cost',
          'Print size and locations — larger prints cost more; front and back count as two locations',
          'Garment choice — blank costs vary significantly between a basic tee and a premium heavyweight hoodie',
        ],
      },
      {
        q: 'What is the minimum order quantity?',
        a: 'For screen print transfers and Traditional Production, the minimum is typically 24 pieces per design to make setup costs economical. For Flexible Merch Production, the minimum is 24 transfer sheets per print run — but you apply them over time in any quantity. Mobile Merch has no minimum on units; we print what sells at the event.',
      },
      {
        q: 'How does quantity affect pricing?',
        a: 'Screen printing is setup-heavy — screens, inks, and time are largely fixed costs regardless of run size. The more units you spread those across, the lower the per-unit price. Common price breaks are at 24, 48, 72, and 100+ units. For Flexible Merch Production, ordering more transfer sheets upfront gets you a lower per-sheet cost, even if you don\'t apply them all at once.',
      },
      {
        q: 'Are there setup fees?',
        a: 'Yes, for screen printing and screen print transfers there are screen setup fees — one per ink color per design. These are a one-time cost. For Flexible Merch Production, once screens are made, reorders of the same design don\'t require paying setup again. Digital printing has no screen fees but typically costs more per unit at volume.',
      },
      {
        q: 'What does the Mobile Merch operational deposit cover?',
        a: 'The deposit covers our staffing, travel to your event, equipment use, setup, teardown, and booth overhead. It\'s not a fee you lose — it\'s recovered from the first sales before we take anything. Think of it as a guarantee that covers our floor costs if the event underperforms. If sales don\'t reach the deposit amount, that gap is the only thing you\'re out.',
      },
      {
        q: 'Are white-label and custom branding add-ons included in the Mobile Merch deposit?',
        a: 'No — custom van signage, branded staff gear, and other white-label options are optional add-ons scoped and priced separately as part of your deposit when you book. The standard deposit covers operations. Branding customization is available but not included by default.',
      },
    ],
  },
  {
    category: 'Design & artwork',
    items: [
      {
        q: 'What file formats do you need for artwork?',
        a: 'Vector files are preferred — AI, EPS, or SVG with all fonts outlined. High-resolution rasterized files (300 DPI minimum at final print size) in PNG or PSD are also accepted. We review all artwork before going to print and will flag any issues. If you don\'t have print-ready files, we can help prepare them.',
      },
      {
        q: 'What is the maximum print size?',
        a: 'For garments, standard full-front prints go up to 12" × 16". Oversized prints up to 14" × 18" are possible on larger garments. For hats, the printable area depends on the panel — typically around 4" × 2.5" on a standard structured front. Tote bags and flat items have more flexibility. We\'ll confirm dimensions based on the specific garment.',
      },
      {
        q: 'Can you help with design?',
        a: 'We can help with artwork preparation — setting files up for print, adjusting colors to spot-color equivalents, and separating layers. For full design work (creating from scratch or major revisions), we work with designers and can connect you if needed. Get in touch and we\'ll figure out what level of help makes sense.',
      },
      {
        q: 'Can you match exact brand colors?',
        a: 'For screen print transfers, we mix inks to Pantone standards and send a color confirmation before going to print. Exact Pantone matching has a small upcharge for custom ink mixing. Digital printing uses CMYK and cannot guarantee exact Pantone matches — if color accuracy is critical, screen print transfers are the right choice.',
      },
    ],
  },
  {
    category: 'Turnaround & logistics',
    items: [
      {
        q: 'How long does a typical order take?',
        a: 'Standard turnaround for Traditional Production and Flexible Merch Production (transfer sheets) is 10–14 business days from artwork approval. This covers production time, not shipping. Rush options are available. For Mobile Merch, once printing is complete we coordinate timing directly around your event date.',
      },
      {
        q: 'Can you rush an order?',
        a: 'Yes, with availability. Rush turnaround (5–7 business days) carries an upcharge. Contact us as early as possible — production slots fill up and last-minute rushes aren\'t always possible depending on current load. The earlier you reach out, the more options we have.',
      },
      {
        q: 'Do you ship finished goods?',
        a: 'Yes. We ship domestically via standard carriers. Large orders can be quoted for freight. Local pickup is available if you\'re in the area. For Mobile Merch, we bring everything to the event — there\'s nothing to ship.',
      },
      {
        q: 'What do I need to provide for a Mobile Merch event?',
        a: 'Primarily: the event date, location, and expected attendance so we can plan inventory, and your approved artwork so we can get printing done in advance. We handle everything else — blanks, equipment, staffing, setup, and teardown.',
        bullets: [
          'Where to park or load in at the venue',
          'Any venue-specific access requirements or timing windows',
          'Whether you want any optional white-label branding elements',
        ],
      },
      {
        q: 'Do you work outside the local area?',
        a: 'Yes. Mobile Merch events have travel as part of the operational deposit calculation — longer distances are factored into your deposit. For Traditional and Flexible Production, we ship anywhere domestically. Get in touch with your location and we\'ll tell you what makes sense.',
      },
    ],
  },
];

const ALL_CATEGORIES = ['All', ...FAQ_DATA.map((s) => s.category)];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.4 },
};

function highlight(text: string, term: string) {
  if (!term.trim()) return <>{text}</>;
  const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <Box key={i} component="mark" sx={{ backgroundColor: 'rgba(242,191,0,0.3)', color: 'inherit', borderRadius: '2px', px: '1px' }}>
            {part}
          </Box>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const term = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    return FAQ_DATA.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const matchesCategory = activeCategory === 'All' || section.category === activeCategory;
        if (!matchesCategory) return false;
        if (!term) return true;
        const searchable = [item.q, item.a, ...(item.bullets ?? [])].join(' ').toLowerCase();
        return searchable.includes(term);
      }),
    })).filter((s) => s.items.length > 0);
  }, [term, activeCategory]);

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalResults = filtered.reduce((n, s) => n + s.items.length, 0);

  return (
    <Box sx={{ backgroundColor: '#0f0f0f', minHeight: '100vh' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <Box sx={{ pt: { xs: 10, md: 14 }, pb: { xs: 6, md: 8 }, borderBottom: '1px solid #1a1a1a' }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <Typography
              variant="h1"
              sx={{ color: '#fff', mb: 3, lineHeight: 1.05, fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4.5rem' }, textAlign: 'center' }}
            >
              Any question.<br />
              <Box component="span" sx={{ color: '#f2bf00' }}>Answered.</Box>
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', maxWidth: 480, mx: 'auto', lineHeight: 1.8, textAlign: 'center', mb: 6 }}>
              Everything you need to know about how we work, what we print on, what drives cost, and how each production model functions.
            </Typography>

            {/* Search */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #2a2a2a',
                borderRadius: 2,
                backgroundColor: '#111',
                px: 2.5,
                py: 1.5,
                gap: 1.5,
                maxWidth: 560,
                mx: 'auto',
                '&:focus-within': { borderColor: '#f2bf00' },
                transition: 'border-color 0.15s ease',
              }}
            >
              <Typography sx={{ color: '#555', fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>⌕</Typography>
              <InputBase
                placeholder="Search questions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                sx={{ color: '#eaeaea', fontSize: '0.95rem', '& input::placeholder': { color: '#555' } }}
              />
              {search && (
                <Box
                  onClick={() => setSearch('')}
                  sx={{ color: '#555', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0, '&:hover': { color: '#888' } }}
                >
                  ✕
                </Box>
              )}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ── Category chips + results ──────────────────────────────────────────── */}
      <Box sx={{ borderBottom: '1px solid #1a1a1a', position: 'sticky', top: { xs: 56, md: 64 }, zIndex: 10, backgroundColor: 'rgba(15,15,15,0.97)', backdropFilter: 'blur(10px)' }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 2, display: 'flex', gap: 1.5, overflowX: 'auto', alignItems: 'center', pb: 2, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
            {ALL_CATEGORIES.map((cat) => (
              <Box
                key={cat}
                onClick={() => setActiveCategory(cat)}
                sx={{
                  px: 2.5,
                  py: 0.75,
                  borderRadius: 5,
                  border: '1px solid',
                  borderColor: activeCategory === cat ? '#f2bf00' : '#252525',
                  backgroundColor: activeCategory === cat ? 'rgba(242,191,0,0.08)' : 'transparent',
                  color: activeCategory === cat ? '#f2bf00' : '#666',
                  fontSize: '0.78rem',
                  fontWeight: activeCategory === cat ? 700 : 400,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: '#444', color: '#aaa' },
                  flexShrink: 0,
                }}
              >
                {cat}
              </Box>
            ))}
            {term && (
              <Typography variant="caption" sx={{ color: '#555', fontSize: '0.76rem', ml: 'auto', flexShrink: 0, whiteSpace: 'nowrap' }}>
                {totalResults} result{totalResults !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        </Container>
      </Box>

      {/* ── FAQ sections ─────────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
            <Typography variant="h3" sx={{ color: '#333', mb: 2, fontSize: '1.4rem' }}>No results for &ldquo;{search}&rdquo;</Typography>
            <Typography variant="body2" sx={{ color: '#555', mb: 4 }}>Try different keywords, or browse by category above.</Typography>
            <Box
              onClick={() => { setSearch(''); setActiveCategory('All'); }}
              sx={{ display: 'inline-block', color: '#f2bf00', fontSize: '0.88rem', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
            >
              Clear search →
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 6, md: 8 } }}>
            {filtered.map((section) => (
              <motion.div key={section.category} {...fadeUp}>
                <Box>
                  {/* Section header */}
                  <Typography
                    variant="caption"
                    sx={{ color: '#f2bf00', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.72rem', fontWeight: 700, display: 'block', mb: 3 }}
                  >
                    {section.category}
                  </Typography>

                  {/* Accordion items */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid #1e1e1e', borderRadius: 2, overflow: 'hidden' }}>
                    {section.items.map((item, i) => {
                      const id = `${section.category}-${i}`;
                      const isOpen = openIds.has(id);
                      return (
                        <Box
                          key={id}
                          sx={{ borderBottom: i < section.items.length - 1 ? '1px solid #1a1a1a' : 'none' }}
                        >
                          {/* Question row */}
                          <Box
                            onClick={() => toggleOpen(id)}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              gap: 3,
                              px: { xs: 3, md: 4 },
                              py: { xs: 2.5, md: 3 },
                              cursor: 'pointer',
                              backgroundColor: isOpen ? 'rgba(255,255,255,0.015)' : 'transparent',
                              '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' },
                              transition: 'background-color 0.15s ease',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: isOpen ? '#eaeaea' : '#ccc', fontWeight: isOpen ? 600 : 400, fontSize: { xs: '0.9rem', md: '0.95rem' }, lineHeight: 1.5, flex: 1 }}
                            >
                              {highlight(item.q, search)}
                            </Typography>
                            <Box
                              sx={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                border: '1px solid',
                                borderColor: isOpen ? '#f2bf00' : '#333',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                mt: 0.2,
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <Typography sx={{ color: isOpen ? '#f2bf00' : '#555', fontSize: '0.75rem', lineHeight: 1, fontWeight: 700 }}>
                                {isOpen ? '−' : '+'}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Answer */}
                          {isOpen && (
                            <Box sx={{ px: { xs: 3, md: 4 }, pb: { xs: 3, md: 3.5 }, pt: 0 }}>
                              <Box sx={{ borderLeft: '2px solid #222', pl: { xs: 2.5, md: 3 } }}>
                                <Typography variant="body2" sx={{ color: '#888', lineHeight: 1.85, fontSize: '0.9rem', mb: item.bullets ? 2 : 0 }}>
                                  {highlight(item.a, search)}
                                </Typography>
                                {item.bullets && (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                                    {item.bullets.map((b, bi) => (
                                      <Box key={bi} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#444', mt: 0.75, flexShrink: 0 }} />
                                        <Typography variant="body2" sx={{ color: '#777', fontSize: '0.88rem', lineHeight: 1.7 }}>
                                          {highlight(b, search)}
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        )}
      </Container>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <Box sx={{ borderTop: '1px solid #1a1a1a', py: { xs: 10, md: 14 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ color: '#fff', mb: 3, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
              Still have questions?
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', mb: 5, maxWidth: 400, mx: 'auto', lineHeight: 1.75 }}>
              Every project is different. If you don&apos;t see your question here, reach out and we&apos;ll give you a straight answer.
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
        </Container>
      </Box>

    </Box>
  );
}
