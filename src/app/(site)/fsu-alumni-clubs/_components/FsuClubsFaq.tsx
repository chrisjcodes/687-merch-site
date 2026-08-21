'use client';

import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  VerifiedOutlined,
  GavelOutlined,
  PaidOutlined,
  ScheduleOutlined,
  BrushOutlined,
  OpenInNew as OpenInNewIcon,
  EmailOutlined,
  PhoneOutlined,
} from '@mui/icons-material';
import AppHeader from '@/app/(site)/_components/AppHeader';
import AppFooter from '@/app/(site)/_components/AppFooter';

const EMAIL = 'info@687merch.com';
const PHONE_DISPLAY = '424 460 3076';
const PHONE_HREF = 'tel:+14244603076';

/**
 * Inline anchor. The global stylesheet strips link styling from `a`, so every
 * link on this page has to opt back in explicitly.
 */
function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        color: 'primary.main',
        textDecoration: 'none',
        fontWeight: 600,
        '&:hover': { textDecoration: 'underline' },
      }}
    >
      {children}
    </Box>
  );
}

const highlights = [
  {
    icon: GavelOutlined,
    title: 'FSU sets the rules',
    body: 'Every design has to follow Florida State’s branding and licensing guidelines. Their guide is the source of truth — not ours, and not a template someone used last season.',
  },
  {
    icon: VerifiedOutlined,
    title: 'We’re a licensed vendor',
    body: 'We hold a Florida State license to print apparel for internal FSU department use, and recognized alumni clubs fall under that coverage.',
  },
  {
    icon: PaidOutlined,
    title: 'Royalties apply',
    body: 'Every order carrying FSU marks is subject to a royalty fee charged by the university. It is part of the cost of the order, and we build it into your quote.',
  },
  {
    icon: ScheduleOutlined,
    title: 'Lead time is everything',
    body: 'Licensing approval, production and shipping all take time. If you have a kickoff or game day in mind, the clock starts well before you think it does.',
  },
];

const timeline = [
  {
    step: '01',
    label: 'Design & artwork',
    duration: '1–2 weeks',
    body: 'We build or clean up the artwork so it is print-ready and follows FSU’s brand guidelines from the start. Revisions live here — not after submission.',
  },
  {
    step: '02',
    label: 'Licensing approval',
    duration: '2–3 weeks',
    body: 'We submit the design to FSU’s licensing office for approval. This step is out of our hands, and it slows down during football season when everyone is submitting at once.',
  },
  {
    step: '03',
    label: 'Production',
    duration: '2–3 weeks',
    body: 'Blanks are sourced and the order is printed. Nothing goes on press until the design is approved and garments are in hand.',
  },
  {
    step: '04',
    label: 'Shipping & delivery',
    duration: '~1 week',
    body: 'Finished goods ship to your club. Build in a buffer if the order is going to an event rather than an address.',
  },
];

type FaqItem = { q: string; a: React.ReactNode };
type FaqSection = { title: string; items: FaqItem[] };

const faqSections: FaqSection[] = [
  {
    title: 'Branding & Licensing',
    items: [
      {
        q: 'Whose branding rules do we follow?',
        a: (
          <>
            <Typography paragraph>
              Florida State&apos;s. Every piece of club merch that uses FSU marks has to follow the
              university&apos;s branding and licensing guidelines, and those guidelines are published
              and maintained by FSU — we just work within them.
            </Typography>
            <Typography paragraph>
              Start with the{' '}
              <TextLink href="https://brand.fsu.edu/">FSU Brand Style Guide</TextLink> and the{' '}
              <TextLink href="https://licensing.fsu.edu/trademark-policies">
                Office of Trademark Licensing&apos;s trademark policies
              </TextLink>
              . If you are a Seminole Club, the Alumni Association&apos;s{' '}
              <TextLink href="https://alumni.fsu.edu/clubs/resources">
                resources for club leaders
              </TextLink>{' '}
              covers the club-specific pieces, including your official club wordmark.
            </Typography>
            <Typography>
              The short version: FSU marks can change size, but they cannot be altered, recolored,
              redrawn, combined with other marks, or overprinted with other words or artwork.
            </Typography>
          </>
        ),
      },
      {
        q: 'Can we use our own club logo instead of an FSU mark?',
        a: (
          <>
            <Typography paragraph>
              Recognized clubs and chapters are issued an official wordmark by the FSU Alumni
              Association, and using that wordmark as issued is the fastest path — it generally
              does not need additional design approval from the university.
            </Typography>
            <Typography>
              If you want a custom mark of your own instead, it has to be approved by the Alumni
              Association, which will in turn seek approval from the Office of Trademark Licensing.
              That is a longer road, so tell us early if that is the direction you want to go.
            </Typography>
          </>
        ),
      },
      {
        q: 'Can we put a local sponsor’s logo on the shirt?',
        a: (
          <Typography>
            Sometimes, but there are limits. Sponsor logos may only appear alongside your official
            club or chapter wordmark furnished by the Alumni Association — they cannot be
            combined with standalone University trademarks, and the design must not imply that FSU
            endorses the sponsor. Send us the sponsor artwork up front so we can flag any problems
            before it goes to licensing.
          </Typography>
        ),
      },
      {
        q: 'Who has the final say on a design?',
        a: (
          <Typography>
            Florida State does. We will tell you when we think something will have trouble getting
            approved, and we will help you fix it, but we cannot approve a design on the
            university&apos;s behalf and neither can your club. Please treat anything on this page as
            our practical guidance, not an official ruling from FSU.
          </Typography>
        ),
      },
    ],
  },
  {
    title: 'Timing & Deadlines',
    items: [
      {
        q: 'We need shirts by a specific date. When do we need to start?',
        a: (
          <>
            <Typography paragraph>
              Sooner than feels necessary. Work backward from your date and account for three
              separate clocks: design, licensing approval, and production plus shipping. As a rule of
              thumb, plan on <strong>eight to ten weeks</strong> between &ldquo;we have an idea&rdquo;
              and &ldquo;boxes are on site.&rdquo;
            </Typography>
            <Typography>
              If your date is a kickoff, a season opener, or anything else in the late-summer rush,
              give yourself more room than that. Everyone on campus is submitting artwork in the same
              few weeks, and the licensing queue reflects it.
            </Typography>
          </>
        ),
      },
      {
        q: 'Can licensing approval be rushed?',
        a: (
          <Typography>
            No. Approval turnaround is controlled by FSU&apos;s licensing office, not by us, and there
            is no expedite button we can press on your behalf. The only real lever your club has is
            starting earlier and submitting a clean, guideline-compliant design the first time.
          </Typography>
        ),
      },
      {
        q: 'What actually causes delays?',
        a: (
          <>
            <Typography paragraph>Almost always one of these:</Typography>
            <Box component="ul" sx={{ pl: 3, m: 0, '& li': { mb: 1 } }}>
              <li>Artwork that alters an FSU mark and has to be reworked and resubmitted.</li>
              <li>Waiting on a club decision — colors, garment, quantities — after the design is done.</li>
              <li>Submitting during peak season, when the approval queue is longest.</li>
              <li>Garment availability, especially for specific colors or a specific brand of blank.</li>
              <li>Adding a sponsor or a second design late in the process, which restarts approval.</li>
            </Box>
          </>
        ),
      },
      {
        q: 'What if we come to you late?',
        a: (
          <Typography>
            Tell us the date anyway and we will be straight with you about whether it is reachable.
            Sometimes a simpler design, a different garment, or a smaller first run makes a tight
            deadline work. What we will not do is promise a date that depends on an approval we do
            not control.
          </Typography>
        ),
      },
    ],
  },
  {
    title: 'Working With Us',
    items: [
      {
        q: 'Are you a licensed FSU vendor?',
        a: (
          <>
            <Typography paragraph>
              Yes. We hold a Florida State license that allows us to print apparel items for
              <strong> internal FSU department use</strong>, and that coverage extends to alumni
              clubs ordering merch for club use.
            </Typography>
            <Typography>
              One thing worth being clear about: this is an internal-use license. It is not a retail
              license, so we are not the right vendor for merch a club intends to sell to the general
              public through a store or a public storefront. If that is what you have in mind, talk to
              us first and we will point you toward the right path.
            </Typography>
          </>
        ),
      },
      {
        q: 'What is the royalty fee?',
        a: (
          <>
            <Typography paragraph>
              Florida State charges a royalty on orders bearing university marks, and that applies to
              club orders placed through us. It is collected on the university&apos;s behalf and
              remitted to FSU — it is not a 687 Merch fee, and it is not optional.
            </Typography>
            <Typography>
              We show it as part of your quote rather than burying it, so your club treasurer sees the
              real number before you commit.
            </Typography>
          </>
        ),
      },
      {
        q: 'Can we just hire you for the design and print it somewhere else?',
        a: (
          <>
            <Typography paragraph>
              You can hire us for design only — plenty of clubs do. But the printing still has to
              go to a licensed vendor. Handing an approved design to an unlicensed shop, a local
              screen printer without an FSU license, or an online print-on-demand service is not
              allowed, no matter who drew the artwork.
            </Typography>
            <Typography>
              If you are not printing with us, use FSU&apos;s{' '}
              <TextLink href="https://licensing.fsu.edu/">licensing site</TextLink> to find a licensed
              vendor — under the Campus Use tab, choose &ldquo;Find a Licensee.&rdquo; We are
              happy to hand off print-ready files to whoever you pick.
            </Typography>
          </>
        ),
      },
      {
        q: 'What do you need from us to get started?',
        a: (
          <>
            <Typography paragraph>Send us as much of this as you have:</Typography>
            <Box component="ul" sx={{ pl: 3, m: 0, '& li': { mb: 1 } }}>
              <li>Your club or chapter name, and your official wordmark if you have it.</li>
              <li>The date you need product in hand, and what the date is for.</li>
              <li>Rough quantities and a size breakdown if you have one.</li>
              <li>Garment preferences — tee, hat, polo, quarter-zip, colors.</li>
              <li>Any design direction, sketches, or past artwork you want to reuse.</li>
              <li>Who at the club can approve artwork and sign off on the quote.</li>
            </Box>
            <Typography sx={{ mt: 2 }}>
              You do not need all of it to start the conversation. The date is the one thing we
              really want early.
            </Typography>
          </>
        ),
      },
    ],
  },
];

const resources = [
  {
    label: 'FSU Brand Style Guide',
    href: 'https://brand.fsu.edu/',
    desc: 'Logos, colors, typography, and how marks may and may not be used.',
  },
  {
    label: 'Office of Trademark Licensing',
    href: 'https://licensing.fsu.edu/',
    desc: 'Licensing policies, royalty information, and the licensed vendor directory.',
  },
  {
    label: 'Licensing for Campus Departments',
    href: 'https://licensing.fsu.edu/campus-use/campus-departments',
    desc: 'The internal-use rules our license operates under.',
  },
  {
    label: 'FSU Alumni Association — Club Leader Resources',
    href: 'https://alumni.fsu.edu/clubs/resources',
    desc: 'Club wordmarks and the branding basics written specifically for Seminole Clubs.',
  },
];

export default function FsuClubsFaq() {
  return (
    <Box>
      <AppHeader />

      <main>
        {/* Hero */}
        <Box
          sx={{
            pt: { xs: 14, md: 20 },
            pb: { xs: 8, md: 12 },
            backgroundColor: '#0f0f0f',
            backgroundImage:
              'radial-gradient(circle at 20% 0%, rgba(242, 191, 0, 0.12) 0%, rgba(15, 15, 15, 0) 55%)',
          }}
        >
          <Container maxWidth="md">
            <Chip
              label="For FSU Alumni Clubs"
              sx={{
                mb: 3,
                color: 'primary.main',
                borderColor: 'primary.main',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
              variant="outlined"
            />
            <Typography variant="h1" component="h1" sx={{ mb: 3 }}>
              Club Merch, By The Book
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '1.05rem', md: '1.25rem' }, lineHeight: 1.7, mb: 4 }}
            >
              We&apos;re a licensed Florida State vendor, and we work with alumni clubs that want
              merch done properly — on-brand, licensed, and delivered before the date that
              matters. Here&apos;s what your club needs to know before you order.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                href={`mailto:${EMAIL}?subject=FSU%20Alumni%20Club%20Merch`}
                startIcon={<EmailOutlined />}
                sx={{ color: '#0f0f0f' }}
              >
                Start a Project
              </Button>
              <Button variant="outlined" color="inherit" href="#timeline">
                See the Timeline
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Highlights */}
        <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#0f0f0f' }}>
          <Container maxWidth="lg">
            <Typography variant="h2" component="h2" sx={{ mb: { xs: 4, md: 6 } }}>
              The Short Version
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              {highlights.map(({ icon: Icon, title, body }) => (
                <Paper
                  key={title}
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    height: '100%',
                    backgroundColor: '#141414',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                  }}
                >
                  <Icon sx={{ color: 'primary.main', fontSize: 36, mb: 2 }} />
                  <Typography variant="h5" component="h3" sx={{ mb: 1.5 }}>
                    {title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {body}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Timeline */}
        <Box
          id="timeline"
          sx={{
            py: { xs: 8, md: 12 },
            backgroundColor: '#ffffff',
            color: '#000',
            scrollMarginTop: '80px',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ mb: { xs: 4, md: 6 }, maxWidth: 760 }}>
              <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
                Work Backward From Your Date
              </Typography>
              <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#444' }}>
                Kickoff, game day, a reunion — whatever your date is, the merch has to clear
                three separate stages before it reaches you, and one of them isn&apos;t ours to speed
                up. Ranges below are typical, not guaranteed.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
                gap: { xs: 3, md: 2 },
              }}
            >
              {timeline.map(({ step, label, duration, body }) => (
                <Box
                  key={step}
                  sx={{
                    borderTop: '3px solid #f2bf00',
                    pt: 2.5,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 700, color: '#999', letterSpacing: '0.1em', mb: 1 }}
                  >
                    {step}
                  </Typography>
                  <Typography variant="h5" component="h3" sx={{ mb: 0.5 }}>
                    {label}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: '#b58e00', mb: 1.5, fontSize: '0.95rem' }}
                  >
                    {duration}
                  </Typography>
                  <Typography sx={{ color: '#555', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {body}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Paper
              elevation={0}
              sx={{
                mt: { xs: 5, md: 7 },
                p: { xs: 3, md: 4 },
                backgroundColor: '#0f0f0f',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2.5,
              }}
            >
              <ScheduleOutlined sx={{ color: 'primary.main', fontSize: 36, flexShrink: 0 }} />
              <Box>
                <Typography variant="h5" component="p" sx={{ color: '#fff', mb: 1 }}>
                  Plan on 8–10 weeks
                </Typography>
                <Typography sx={{ color: '#bbb', lineHeight: 1.7 }}>
                  That&apos;s the practical window from first conversation to product in hand. Late
                  summer and football season run longer, because every department and club on campus
                  is in the licensing queue at the same time. The clubs that get their merch on time
                  are the ones that start early — there is no version of this where waiting
                  helps.
                </Typography>
              </Box>
            </Paper>
          </Container>
        </Box>

        {/* FAQ */}
        <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#0f0f0f' }}>
          <Container maxWidth="md">
            <Typography variant="h2" component="h2" sx={{ mb: { xs: 4, md: 6 } }}>
              Frequently Asked Questions
            </Typography>

            {faqSections.map((section) => (
              <Box key={section.title} sx={{ mb: { xs: 5, md: 7 } }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ color: 'primary.main', mb: 2, letterSpacing: '0.08em' }}
                >
                  {section.title}
                </Typography>

                {section.items.map((item) => (
                  <Accordion
                    key={item.q}
                    disableGutters
                    elevation={0}
                    sx={{
                      backgroundColor: '#141414',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      mb: 1.5,
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': { borderColor: 'rgba(242, 191, 0, 0.4)' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                      sx={{ px: { xs: 2, md: 3 }, py: 1 }}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: '1.05rem', pr: 2 }}>
                        {item.q}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        px: { xs: 2, md: 3 },
                        pb: 3,
                        color: 'text.secondary',
                        '& p': { lineHeight: 1.75 },
                        '& p:last-child': { mb: 0 },
                      }}
                    >
                      {item.a}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ))}
          </Container>
        </Box>

        {/* Official resources */}
        <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: '#0a0a0a' }}>
          <Container maxWidth="md">
            <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
              Official FSU Resources
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
              These are the university&apos;s own pages. When something on this page and something on
              theirs disagree, theirs wins.
            </Typography>

            <Box sx={{ display: 'grid', gap: 2 }}>
              {resources.map((resource) => (
                <Paper
                  key={resource.href}
                  component="a"
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    p: { xs: 2.5, md: 3 },
                    backgroundColor: '#141414',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    textDecoration: 'none',
                    transition: 'border-color 0.2s ease',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                      {resource.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {resource.desc}
                    </Typography>
                  </Box>
                  <OpenInNewIcon sx={{ color: 'primary.main', flexShrink: 0 }} />
                </Paper>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Contact */}
        <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#0f0f0f' }}>
          <Container maxWidth="md">
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 6 },
                textAlign: 'center',
                backgroundColor: '#141414',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
              }}
            >
              <BrushOutlined sx={{ color: 'primary.main', fontSize: 44, mb: 2 }} />
              <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
                Got a Date in Mind?
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 620, mx: 'auto' }}
              >
                Tell us the date and roughly what you want. We&apos;ll tell you what&apos;s realistic,
                what licensing will need, and what it costs — royalty included, before you
                commit to anything.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  justifyContent: 'center',
                  mb: 4,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  href={`mailto:${EMAIL}?subject=FSU%20Alumni%20Club%20Merch`}
                  startIcon={<EmailOutlined />}
                  sx={{ color: '#0f0f0f' }}
                >
                  {EMAIL}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  href={PHONE_HREF}
                  startIcon={<PhoneOutlined />}
                >
                  {PHONE_DISPLAY}
                </Button>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                687 Merch is a licensed Florida State University vendor for internal department use.
                This page is general guidance for club leaders and is not an official FSU
                publication — branding, licensing, and royalty requirements are set by the
                university and are subject to change.
              </Typography>
            </Paper>
          </Container>
        </Box>
      </main>

      <AppFooter />
    </Box>
  );
}
