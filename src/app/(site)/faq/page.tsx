'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Box, Typography, Container, InputBase } from '@mui/material';
import { motion } from 'framer-motion';
import { track } from '@vercel/analytics/react';
import AppHeader from '../_components/AppHeader';
import AppFooter from '../_components/AppFooter';

// ─── FAQ data ────────────────────────────────────────────────────────────────

interface FaqItem {
  q: string;
  a: string;
  bullets?: string[];
  tags: string[];
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
        tags: ['getting-started'],
      },
      {
        q: 'How does Flexible Merch Production work?',
        a: 'We run your design through the same screen printing process as traditional printing — but instead of applying ink directly to a garment, we print onto transfer sheets. You pay for the print run upfront, and then those transfers can be applied to blank garments using a heat press whenever you need them. This decouples the design cost from the garment order, so you can print 100 transfer sheets now and apply them to tees, hoodies, or a new colorway over time — without paying for a new print run each time.',
        tags: ['getting-started'],
      },
      {
        q: 'How does the Mobile Merch deposit and revenue split work?',
        a: 'You pay for the screen printing upfront plus an operational deposit that covers our labor, travel, and event overhead. At the event, sales return your deposit first — before we take anything. Everything above the deposit we split with you. If it\'s a slow night and sales only cover the deposit, you walk away at zero. That\'s still better than paying a hired live printer a flat booking fee with no upside at all.',
        tags: ['live-events', 'pricing'],
      },
      {
        q: 'What happens to unsold inventory after a Mobile Merch event?',
        a: "We take the blank garments back. You don't store anything, sell off leftovers, or write anything off. Your exposure is the print cost you've already committed to, and the operational deposit — which sales pay back first.",
        tags: ['live-events'],
      },
      {
        q: 'Can Mobile Merch do exclusive or limited-edition drops?',
        a: 'Yes. You can set a hard cap on units, tie the drop to a specific time window, or run it as an influencer or brand collab. Since we print on-site as items are ordered, the scarcity is real — we stop when you say stop, and no one can buy one before the event.',
        tags: ['live-events'],
      },
      {
        q: 'Why not just use a print-on-demand service instead?',
        a: 'If print-on-demand fits your business model better, we\'re genuinely fine with that — it\'s the right answer for some situations. But here\'s what\'s different about us.\n\nWe can create items on demand in person. Customers walk away with their item the same day. They can see it, touch it, and feel the quality before they commit to buying — which is a fundamentally different experience than ordering something online and hoping it shows up the way you imagined.\n\nYou also get a dedicated team that is actually invested in your outcome. Most print-on-demand platforms route your job to whichever vendor in their network has capacity — vendors whose primary concern is throughput, not your specific project. We\'re not trying to process the highest volume of orders we can. We\'re trying to make your thing right.',
        tags: ['about-us', 'getting-started'],
      },
      {
        q: 'Can the production models be customized to fit how I actually want to work?',
        a: 'Yes — and that\'s something we actively look for with every client. The three models are frameworks, not rigid contracts. Some clients use the Mobile Merch model not primarily to sell at the event, but because they want the printed inventory regardless of what moves on the night. They print continuously, knowing the deposit clock is running, and walk away with a full run of finished goods. Anything that sells at the event is upside. It\'s a creative way to use the time and cost structure to your advantage.\n\nIf you have a specific situation or a use case that doesn\'t map cleanly to one model, bring it up. We\'d rather find the right angle than fit you into a box.',
        tags: ['live-events', 'getting-started'],
      },
      {
        q: 'Is anyone else doing this? Why hasn\'t this been done before?',
        a: 'There are businesses that offer live printing services — we\'re not claiming to have invented the concept. What we haven\'t seen much of is the partnership model: a live printing operation where the event actually shares in the upside rather than just paying to have a printer present.\n\nThere\'s also a speed difference that matters. Traditional live screen printing is slow. It involves multiple passes on the same garment, and sometimes requires curing the ink between passes to get the right look. That limits how many items you can produce in a live event window. Because we use screen print transfers applied with a heat press, we can finish a shirt in about 30 seconds. That changes what\'s possible in a two- or three-hour window — both in terms of volume and the experience for the person waiting for their item.',
        tags: ['about-us', 'live-events'],
      },
      {
        q: 'How is Mobile Merch different from hiring a live printer?',
        a: 'A hired live printer charges a large booking fee plus per-item material costs. They keep all the sales revenue — the event pays to have them there, and that\'s where the relationship ends. With Mobile Merch, our outcome is tied to yours. Your deposit comes back from sales before we earn anything, and you share in the upside when demand is strong. The spectacle is also different: a production van with an LED lighting system versus a standard screen printing table.',
        tags: ['live-events', 'about-us'],
      },
    ],
  },
  {
    category: 'Screen print transfers',
    items: [
      {
        q: 'What is a screen print transfer?',
        a: 'A screen print transfer is your design printed onto a special release paper using the same inks and screens used in traditional screen printing. The ink sits on the paper until it\'s transferred to a blank using a heat press. The end result is visually and texturally identical to a traditional screen print — same ink, same feel, same durability. The difference is that application happens separately from printing, which gives you flexibility on timing and garment choice.',
        tags: ['getting-started', 'print-quality'],
      },
      {
        q: 'How does a screen print transfer compare to traditional screen printing?',
        a: 'Quality-wise, they\'re the same. Same inks, same vibrancy, same hand feel on the fabric. The operational difference is that traditional screen printing applies the design directly to a specific garment during a single production run. Transfers decouple the printing from the garment, so you can print in quantity now and apply on demand. This means you can offer multiple garment styles and colorways from one print run, restock without reordering artwork, and carry transfers across multiple events.',
        tags: ['print-quality'],
      },
      {
        q: 'Do you do digital printing (DTG or DTF)?',
        a: 'We primarily work with screen print transfers — including full-color process printing — because of the quality, durability, and per-unit cost advantages at volume. We do use DTF (direct-to-film) in specific situations, and we\'ll tell you honestly when it\'s the right call.',
        bullets: [
          'Finite small quantities — if you truly won\'t need more of a design and screen setup costs aren\'t justified',
          'Certain items like hats, where DTF can produce a better result depending on the specific design',
        ],
        tags: ['print-quality'],
      },
      {
        q: 'When would you recommend DTF over screen print transfers?',
        a: 'DTF makes the most sense for finite, small-quantity runs where you\'re confident you won\'t need more of that design — typically under 24 pieces — and where paying for screen setup doesn\'t make economic sense. It\'s also worth considering for certain items like hats, where the design and application constraints sometimes favor DTF over screen print. For ongoing or repeatable merch needs, screen print transfers are almost always the better choice — lower per-unit cost at quantity, same or better durability, and the flexibility to reorder without new setup costs.',
        tags: ['print-quality', 'pricing'],
      },
      {
        q: 'Can you do full-color and photographic designs on screen print transfers?',
        a: 'Yes — we can do full-color process screen printing to transfer, which handles photographic detail, gradients, and complex imagery the same way a traditional process screen print would. Having a photographic design doesn\'t automatically move you to digital. We\'ll assess the design and recommend the right approach based on your quantity, the specific artwork, and the item you\'re printing on.',
        tags: ['print-quality'],
      },
      {
        q: 'How durable are screen print transfers compared to direct screen prints?',
        a: 'When properly applied, screen print transfers have the same wash durability as a traditional direct screen print. Correct heat and pressure during application is critical — improperly applied transfers can crack or peel early. That\'s one reason we control the application process rather than shipping transfers for someone else to press without guidance.',
        tags: ['print-quality'],
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
        tags: ['getting-started'],
      },
      {
        q: 'Are there fabrics or garments that don\'t work with screen print transfers?',
        a: 'The main factor is heat sensitivity. Screen print transfers require a heat press to apply, so garments that are particularly sensitive to heat — certain nylons, some technical synthetics, or materials that warp or melt under pressure — may not be a good fit. We have transfer products specifically formulated for stretch fabrics, so high-stretch materials like athletic wear aren\'t automatically ruled out. Items with thick structural seams or hardware that prevent a flat press can also be difficult.\n\nOne thing we don\'t do at all is print products — posters, paper goods, flat printed materials. We\'re strictly apparel and soft goods. If it\'s a wearable or a bag, we can likely work with it; if it\'s a print-on-paper product, that\'s outside what we do.',
        tags: ['getting-started', 'print-quality'],
      },
      {
        q: 'Do you supply blanks or can I bring my own?',
        a: 'Both. You can absolutely bring your own blanks — there\'s no requirement to source through us. If you do want us to source them, we buy at wholesale and pass that cost directly to you with no markup. Our service fees cover what we do, not the materials. You\'ll always see exactly what the blanks cost, separate from what we charge for printing and production.\n\nFor common blanks — black, white, gray tees and similar high-turnover items — we carry our own inventory and can pull from that directly. For less common requests like unusual colorways or specialty styles we wouldn\'t normally stock, there may be a restocking fee included as part of the deposit to account for any unsold blanks we\'re left holding. We\'ll always flag that upfront if it applies.',
        tags: ['getting-started', 'pricing'],
      },
      {
        q: 'Can you print on hats and accessories?',
        a: 'Yes. Structured snapbacks, dad hats, and caps with a flat front panel work well with screen print transfers. Curved-brim finished hats require a specialty press that we have. That said, for hats specifically, DTF can produce a better result depending on the design — particularly for designs with fine detail or certain color combinations. We\'ll tell you which approach makes more sense for your specific hat and artwork. Tote bags and flat accessories are generally straightforward.',
        tags: ['getting-started', 'print-quality'],
      },
    ],
  },
  {
    category: 'Pricing & costs',
    items: [
      {
        q: 'How much does it cost to print a shirt — or a hoodie, or a hat?',
        a: 'It genuinely depends, and that\'s not a dodge — it\'s just the honest answer. The cost of a printed item is a function of too many variables to quote off the top of our heads: what you\'re printing on, how many colors are in the design, how many print locations, what size the print is, and how many units you\'re ordering. Shift any one of those and the number changes.\n\nThat said, if your goal is to get the lowest possible cost per item, here\'s exactly how to do it:\n',
        bullets: [
          'Reduce ink colors — every color is a screen, and every screen adds to setup cost. One or two colors is significantly cheaper than four.',
          'Reduce print locations — front only is cheaper than front and back. One placement is always the floor.',
          'Go with the smallest print size you can be happy with — a left-chest print costs less than a full front.',
          'Choose the most inexpensive blank you\'re comfortable with — the garment is often a larger cost driver than people expect.',
          'Order as many units as you possibly can — the more you order, the lower your per-unit cost across the board.',
        ],
        tags: ['pricing'],
      },
      {
        q: 'What are the main cost levers on a project?',
        a: 'Four things drive the most variation in cost:',
        bullets: [
          'Quantity — more units spreads setup costs across more pieces, lowering the per-unit price',
          'Number of colors — each ink color requires its own screen and increases setup cost',
          'Print size and locations — larger prints cost more; front and back count as two locations',
          'Garment choice — blank costs vary significantly between a basic tee and a premium heavyweight hoodie',
        ],
        tags: ['pricing'],
      },
      {
        q: 'Can you print just one item?',
        a: 'Technically, yes. But we\'re probably not the right fit for it. There are a lot of print-on-demand services — online platforms and marketplaces built specifically for single one-off items — that are better suited to that need and will give you a better result at a better price point than we can on a single unit.\n\nThere\'s also a principle we hold: if someone else — an Etsy seller, a small independent vendor — is already making the thing you\'re asking us to print, and they\'re offering it at a reasonable price, we\'d rather you buy it from them. Even if printing it ourselves wouldn\'t technically violate any IP, we don\'t want to take business from small creators. We\'d suggest supporting the person who made it.',
        tags: ['pricing', 'about-us'],
      },
      {
        q: 'What is the minimum order quantity?',
        a: 'For screen print transfers and Traditional Production, the hard minimum is 8 pieces per design — but at that quantity, per-unit cost is very high, close to retail pricing for the item itself. The first real price break is at 24 pieces, and we almost always recommend starting there. Even if you only sell a portion of a 24-piece run, you\'ll likely cover the print cost for all of them. For Flexible Merch Production, the minimum is 24 transfer sheets per print run — but you apply them over time in any quantity. Mobile Merch has no minimum on units; we print what sells at the event.',
        tags: ['pricing'],
      },
      {
        q: 'How does quantity affect pricing?',
        a: 'Screen printing is setup-heavy — screens, inks, and time are largely fixed costs regardless of run size. The more units you spread those across, the lower the per-unit price. The first meaningful price break is at 24 units, and that\'s where we recommend most customers start. Pricing continues to improve at 48, 72, and 100+ units. At the 8-piece minimum, setup cost is spread across very few items, so per-unit cost is high enough that you should go in knowing that. For Flexible Merch Production, ordering more transfer sheets upfront gets you a lower per-sheet cost, even if you don\'t apply them all at once.',
        tags: ['pricing'],
      },
      {
        q: 'Are there setup fees?',
        a: 'For screen printing and screen print transfers, yes — screen setup fees apply, one per ink color per design. These are a one-time cost per design. Once screens are made, reorders of the same design don\'t require paying setup again. Digital printing has no screen fees but typically costs more per unit at volume.\n\nFor most products we print on, there are no additional setup fees. Some specialty items — like heat-applied patch applications — do carry a setup fee as part of getting samples made and configuring our vendor\'s engraver. We\'ll always break that out clearly before you commit.',
        tags: ['pricing'],
      },
      {
        q: 'What does the Mobile Merch operational deposit cover?',
        a: 'The deposit covers our staffing, travel to your event, equipment use, setup, teardown, and booth overhead. It\'s not a fee you lose — it\'s recovered from the first sales before we take anything. Think of it as a guarantee that covers our floor costs if the event underperforms. If sales don\'t reach the deposit amount, that gap is the only thing you\'re out.',
        tags: ['live-events', 'pricing'],
      },
      {
        q: 'Are white-label and custom branding add-ons included in the Mobile Merch deposit?',
        a: 'No — custom van signage, branded staff gear, and other white-label options are optional add-ons scoped and priced separately as part of your deposit when you book. The standard deposit covers operations. Branding customization is available but not included by default.',
        tags: ['live-events', 'pricing'],
      },
    ],
  },
  {
    category: 'Design & artwork',
    items: [
      {
        q: 'What file formats do you need for artwork?',
        a: 'We prefer files that are either fully vectorized (AI, EPS, or SVG with fonts outlined) or rasterized at real-world print size and 300 DPI minimum (PNG or PSD). The key is that the file should reflect what you actually want to print — not a small web export that gets scaled up. That said, we can help get your artwork up to standard before we go to print. If you\'re not sure whether your files are ready, send them over and we\'ll take a look.',
        tags: ['getting-started'],
      },
      {
        q: 'What is the maximum print size?',
        a: 'A single screen print transfer can go up to 12.75" × 19.75". If you need something larger, we can string together multiple transfers to create the illusion of a bigger print — but each additional transfer adds to the cost. For hats, the printable area depends on the panel — typically around 4" × 2.5" on a standard structured front. Tote bags and flat items generally have more flexibility. We\'ll confirm dimensions based on the specific garment and design.',
        tags: ['getting-started', 'print-quality'],
      },
      {
        q: 'Can you help with design?',
        a: 'Yes — we offer design services at an hourly rate, and we\'re also happy to work with your own designer or an outside creative. For smaller tasks like bringing an asset up to print-ready spec, as long as it\'s not a full redo we typically don\'t charge for that — it\'s part of getting the job done right. If you need a full design built from scratch or a significant revision, that falls under our design services and we\'ll scope it with you before starting.',
        tags: ['getting-started'],
      },
      {
        q: 'Do you have experience working with licensed or trademarked intellectual property?',
        a: 'Yes. We are licensed to print for Florida State University — our owner\'s alma mater — which means we operate under strict brand guidelines, submit artwork for approval through the FSU branding department, and handle royalty reporting as part of every licensed order. We work with FSU clubs and organizations regularly through that relationship.\n\nIf you\'re bringing a licensed property to us, we know what that process looks like and we won\'t cut corners on it. If you\'re not sure whether your project involves IP that requires licensing, we\'re happy to talk through it.',
        tags: ['about-us'],
      },
      {
        q: 'Do you use AI in your design work?',
        a: 'No — we do not use AI for end-to-end design work. Every finished design is built by hand in a design program by a person. That\'s not a caveat, it\'s the baseline.\n\nWhere we do use AI is in early-stage work — fast prototyping and sourcing reference assets. Think of it the way a designer might reach for a stock asset: when there\'s no off-the-shelf option that makes sense, we\'ll use AI to generate something that helps us hone the direction more quickly. It\'s a starting point, not a deliverable. It is never the output you receive.\n\nOur view is that AI can exist ethically in creative fields as a tool that helps skilled artists work better — not as a replacement for them. We also believe the equity AI generates belongs with the people using it, not with large technology companies. That\'s how we think about where it belongs in our process and where it doesn\'t.',
        tags: ['about-us'],
      },
      {
        q: 'I made something with AI — can I send it to you and have it put on a shirt?',
        a: 'Yes — and we work with AI-generated art regularly. The main thing to know is that what AI outputs is rarely print-ready. It almost always needs treatment before it can go on press: cleaning up edges, separating colors, rebuilding detail that doesn\'t hold at print size, or converting the image into a format our process can actually work with. That\'s not a dealbreaker, just a reality of the format.\n\nWe\'d also encourage you to stay open to a different starting point. If you show us what you generated and tell us what you\'re going for, we can often build something from scratch — or build on what you made — that\'s stronger as a garment design and easier to execute at print. AI art and apparel design are two different disciplines, and what reads well on a screen doesn\'t always translate to a shirt. We\'re happy to work with what you have, but we\'ll always tell you honestly if we think we can do better.',
        tags: ['getting-started', 'about-us'],
      },
      {
        q: 'Can you match exact brand colors?',
        a: 'Yes — we offer PMS (Pantone Matching System) color matching for an additional fee. We mix inks to your specified Pantone and send a color confirmation before going to print. Digital printing uses CMYK and cannot guarantee exact Pantone matches — if color accuracy is critical, screen print transfers are the right choice.',
        tags: ['print-quality', 'pricing'],
      },
    ],
  },
  {
    category: 'Turnaround & logistics',
    items: [
      {
        q: 'Do you offer samples?',
        a: 'Yes. We can send you samples of our work — most likely 687-branded items from our own catalog. Keep them, wear them, and tell everyone how cool you think we are.\n\nIf you have an active order with us, we\'ll typically do samples pro bono. If you\'re just curious and not yet in a project, we ask that you cover the wholesale cost of the materials — we\'re not going to charge you for our time, just what the blank and transfer actually cost us.',
        tags: ['getting-started'],
      },
      {
        q: 'How long does a typical order take?',
        a: 'Standard turnaround for Traditional Production and Flexible Merch Production (transfer sheets) is 10–14 business days from artwork approval. This covers production time, not shipping. Rush options are available. For Mobile Merch, once printing is complete we coordinate timing directly around your event date.',
        tags: ['getting-started'],
      },
      {
        q: 'Can you rush an order?',
        a: 'Yes, with availability. Rush turnaround (5–7 business days) carries an upcharge. Contact us as early as possible — production slots fill up and last-minute rushes aren\'t always possible depending on current load. The earlier you reach out, the more options we have.',
        tags: ['getting-started', 'pricing'],
      },
      {
        q: 'Do you ship finished goods?',
        a: 'Yes. We ship domestically via standard carriers. Large orders can be quoted for freight. Local pickup is available if you\'re in the area. For Mobile Merch, we bring everything to the event — there\'s nothing to ship.',
        tags: ['getting-started'],
      },
      {
        q: 'What do I need to provide for a Mobile Merch event?',
        a: 'Primarily: the event date, location, and expected attendance so we can plan inventory, and your approved artwork so we can get printing done in advance. We handle everything else — blanks, equipment, staffing, setup, and teardown.',
        bullets: [
          'Where to park or load in at the venue',
          'Any venue-specific access requirements or timing windows',
          'Whether you want any optional white-label branding elements',
        ],
        tags: ['live-events', 'getting-started'],
      },
      {
        q: 'Do you work outside the local area?',
        a: 'Yes. Mobile Merch events have travel as part of the operational deposit calculation — longer distances are factored into your deposit. For Traditional and Flexible Production, we ship anywhere domestically. Get in touch with your location and we\'ll tell you what makes sense.',
        tags: ['getting-started', 'live-events'],
      },
      {
        q: 'How far in advance do I need to book Mobile Merch?',
        a: 'We ask for a minimum of 15 business days — about three weeks — to confirm a date and get everything ready. That covers artwork approval, the print run, and logistics prep. In practice, the earlier you reach out the better: dates fill up, and more lead time means more room to develop design if you need it. If you\'re inside that window, reach out anyway — we\'ll tell you honestly whether we can make it work.',
        tags: ['live-events', 'getting-started'],
      },
      {
        q: 'What does your setup require at the venue?',
        a: 'We run out of a 2020 Ford Transit — the van is the booth. All you need to carve out is roughly a 10×20\' footprint for us to operate out of. Load-in is fast: we drive up, stage the presses, set up the workflow, and we\'re operational in under 30 minutes.\n\nIf your event is indoors, we can eject from the van — move the press equipment inside and live print on the floor of your venue. That setup requires you to provide adequate space and access to power; we\'ll work through the specifics with you during booking.\n\nFor outdoor events: we run on battery and are fully self-sufficient for most event windows. For longer events, access to shore power is helpful — we\'ll flag it if it applies.',
        tags: ['live-events', 'getting-started'],
      },
      {
        q: 'Can you run multiple designs at the same event?',
        a: 'Yes. The most practical approach is to pick a lane on garment color — all light shirts or all dark shirts — so we\'re working from one consistent blank inventory and can run all your designs in a matching ink without juggling two separate catalogs. We can mix and match light and dark blanks, but it adds complexity.\n\nOne thing to think through on busier events: design complexity affects throughput. A simple front-chest print takes about 30 seconds per item. A design that hits the front, back, and both sleeves takes significantly longer — and at a high-traffic event, that one design can create a bottleneck at the booth. If you\'re planning multiple designs for a large crowd, we\'ll talk through which ones make sense to run live and how to sequence them.',
        tags: ['live-events', 'getting-started'],
      },
      {
        q: 'How does sizing work at a live event?',
        a: 'We stock what we expect to be a solid size distribution for your event and crowd. If someone asks for a size we\'ve sold through or didn\'t bring, they can still purchase — we take the order, set aside a transfer in a backlog print bin, and order the missing sizes the following day. We run those prints and either get them to you directly or work with you to ship to the customer. Nobody walks away without their item; it just arrives a day or two later.',
        tags: ['live-events', 'getting-started'],
      },
      {
        q: 'Who handles payments at the event, and how do I receive my cut?',
        a: 'We run the booth and take all customer payments directly — you don\'t need to staff a register or manage a POS. Your deposit is already paid before the event, so there\'s no invoice waiting for you on the other side.\n\nAfter the event, we compile a full sales report and send you a copy. If sales covered the deposit and generated a split, we remit your share — typically as soon as the following day. If it was a slower night and sales only partially covered the deposit, you receive back whatever we were able to recover. The deposit is your floor, not a debt.\n\nThe only scenario where you\'d receive a bill after the event is if you asked us to do giveaways or purchase items off the booth on behalf of customers — in that case we\'ll invoice you for those separately.',
        tags: ['live-events', 'pricing'],
      },
      {
        q: 'What happens if my event gets cancelled or postponed?',
        a: 'Simple rule: you only owe us the operational deposit if we operate. If the event gets cancelled or you don\'t have us come out, we refund your deposit in full.\n\nThe print cost is a fixed cost regardless — but those transfers are yours to keep. Use them at a rescheduled event, a future show, a traditional production run, whatever makes sense. The artwork is ready whenever you are.',
        tags: ['live-events', 'pricing'],
      },
      {
        q: 'Do you carry liability insurance?',
        a: 'Yes. We carry liability insurance and can provide a certificate of insurance (COI) as required by your venue or event organizer. Let us know during booking and we\'ll make sure you have what you need.',
        tags: ['live-events', 'about-us'],
      },
    ],
  },
];

// ─── Theme filters (cross-section) ───────────────────────────────────────────

const THEMES = [
  { label: 'All', value: 'all' },
  { label: 'Getting Started', value: 'getting-started' },
  { label: 'Live Events', value: 'live-events' },
  { label: 'Pricing', value: 'pricing' },
  { label: 'Print Quality', value: 'print-quality' },
  { label: 'About Us', value: 'about-us' },
];

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

// Flat item with a stable ID and source section label
interface FlatItem extends FaqItem {
  id: string;
  sectionLabel: string;
}

export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [activeTheme, setActiveTheme] = useState('all');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const term = search.trim().toLowerCase();

  // When a theme is active (not 'all'), produce a flat cross-section list.
  // When 'all', produce the section-grouped structure.
  const flatItems = useMemo<FlatItem[]>(() => {
    if (activeTheme === 'all' && !term) return [];
    const result: FlatItem[] = [];
    FAQ_DATA.forEach((section) => {
      section.items.forEach((item, i) => {
        const matchesTheme = activeTheme === 'all' || item.tags.includes(activeTheme);
        const searchable = [item.q, item.a, ...(item.bullets ?? [])].join(' ').toLowerCase();
        const matchesSearch = !term || searchable.includes(term);
        if (matchesTheme && matchesSearch) {
          result.push({ ...item, id: `${section.category}-${i}`, sectionLabel: section.category });
        }
      });
    });
    return result;
  }, [activeTheme, term]);

  // Section-grouped view (used only when theme = 'all' and no search)
  const groupedSections = useMemo(() => {
    if (activeTheme !== 'all' || term) return [];
    return FAQ_DATA;
  }, [activeTheme, term]);

  const isFlat = activeTheme !== 'all' || !!term;
  const totalResults = isFlat ? flatItems.length : groupedSections.reduce((n, s) => n + s.items.length, 0);
  const isEmpty = isFlat ? flatItems.length === 0 : false;

  // Debounced search tracking — fires 1.5s after the user stops typing
  const searchTracked = useRef('');
  useEffect(() => {
    if (!term || term === searchTracked.current) return;
    const timer = setTimeout(() => {
      searchTracked.current = term;
      track('faq_searched', { query: term, results: flatItems.length });
    }, 1500);
    return () => clearTimeout(timer);
  }, [term, flatItems.length]);

  const toggleOpen = (id: string, question: string, sectionLabel: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        track('faq_item_opened', { question, section: sectionLabel, theme: activeTheme });
      }
      return next;
    });
  };

  const renderAccordionItem = (item: FlatItem, index: number, total: number, showSection: boolean) => {
    const isOpen = openIds.has(item.id);
    return (
      <Box key={item.id} sx={{ borderBottom: index < total - 1 ? '1px solid #1a1a1a' : 'none' }}>
        <Box
          onClick={() => toggleOpen(item.id, item.q, item.sectionLabel)}
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
          <Box sx={{ flex: 1 }}>
            {showSection && (
              <Typography sx={{ color: '#444', fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase', mb: 0.5 }}>
                {item.sectionLabel}
              </Typography>
            )}
            <Typography
              variant="body2"
              sx={{ color: isOpen ? '#eaeaea' : '#ccc', fontWeight: isOpen ? 600 : 400, fontSize: { xs: '0.9rem', md: '0.95rem' }, lineHeight: 1.5 }}
            >
              {highlight(item.q, search)}
            </Typography>
          </Box>
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

        {isOpen && (
          <Box sx={{ px: { xs: 3, md: 4 }, pb: { xs: 3, md: 3.5 }, pt: { xs: 1.5, md: 2 } }}>
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
  };

  return (
    <Box sx={{ backgroundColor: '#0f0f0f', minHeight: '100vh' }}>
      <AppHeader />

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

      {/* ── Theme filters ─────────────────────────────────────────────────────── */}
      <Box sx={{ borderBottom: '1px solid #1a1a1a', position: 'sticky', top: { xs: 56, md: 64 }, zIndex: 10, backgroundColor: 'rgba(15,15,15,0.97)', backdropFilter: 'blur(10px)' }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 3, display: 'flex', gap: 2, overflowX: 'auto', alignItems: 'center', justifyContent: 'center', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
            {THEMES.map((theme) => (
              <Box
                key={theme.value}
                onClick={() => {
                  setActiveTheme(theme.value);
                  if (theme.value !== 'all') track('faq_filter_selected', { theme: theme.label });
                }}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 5,
                  border: '1px solid',
                  borderColor: activeTheme === theme.value ? '#f2bf00' : '#2a2a2a',
                  backgroundColor: activeTheme === theme.value ? 'rgba(242,191,0,0.1)' : '#111',
                  color: activeTheme === theme.value ? '#f2bf00' : '#555',
                  fontSize: '0.82rem',
                  fontWeight: activeTheme === theme.value ? 700 : 500,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: '#3a3a3a', color: '#aaa' },
                  flexShrink: 0,
                }}
              >
                {theme.label}
              </Box>
            ))}
          </Box>
          {(term || activeTheme !== 'all') && (
            <Typography variant="caption" sx={{ color: '#444', fontSize: '0.74rem', textAlign: 'center', display: 'block', pb: 1.5 }}>
              {totalResults} result{totalResults !== 1 ? 's' : ''}
            </Typography>
          )}
        </Container>
      </Box>

      {/* ── FAQ content ───────────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {isEmpty ? (
          <Box sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
            <Typography variant="h3" sx={{ color: '#333', mb: 2, fontSize: '1.4rem' }}>No results for &ldquo;{search}&rdquo;</Typography>
            <Typography variant="body2" sx={{ color: '#555', mb: 4 }}>Try different keywords, or browse by theme above.</Typography>
            <Box
              onClick={() => { setSearch(''); setActiveTheme('all'); }}
              sx={{ display: 'inline-block', color: '#f2bf00', fontSize: '0.88rem', cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
            >
              Clear search →
            </Box>
          </Box>
        ) : isFlat ? (
          /* ── Flat cross-section view (theme or search active) ── */
          <motion.div {...fadeUp}>
            <Box sx={{ border: '1px solid #1e1e1e', borderRadius: 2, overflow: 'hidden' }}>
              {flatItems.map((item, i) =>
                renderAccordionItem(item, i, flatItems.length, !!term || activeTheme !== 'all')
              )}
            </Box>
          </motion.div>
        ) : (
          /* ── Section-grouped view (All, no search) ── */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 6, md: 8 } }}>
            {groupedSections.map((section) => (
              <motion.div key={section.category} {...fadeUp}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: '#f2bf00', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.72rem', fontWeight: 700, display: 'block', mb: 3 }}
                  >
                    {section.category}
                  </Typography>
                  <Box sx={{ border: '1px solid #1e1e1e', borderRadius: 2, overflow: 'hidden' }}>
                    {section.items.map((item, i) =>
                      renderAccordionItem(
                        { ...item, id: `${section.category}-${i}`, sectionLabel: section.category },
                        i,
                        section.items.length,
                        false
                      )
                    )}
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        )}
      </Container>
      <AppFooter />
    </Box>
  );
}
