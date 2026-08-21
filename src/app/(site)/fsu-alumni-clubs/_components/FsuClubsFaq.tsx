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
import Image from 'next/image';
import Link from 'next/link';
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
    title: 'We know the guidelines',
    body: 'Florida State publishes the branding and licensing standards, and keeping up with them is our job, not your club’s. Bring us the idea — we will shape it into something that fits.',
  },
  {
    icon: VerifiedOutlined,
    title: 'We’re a licensed vendor',
    body: 'We hold a Florida State license to print apparel for internal FSU department use, and recognized alumni clubs fall under that coverage — so you are covered from the first sketch.',
  },
  {
    icon: PaidOutlined,
    title: 'Royalties go back to FSU',
    body: 'Orders carrying university marks include a royalty that goes to Florida State. We handle it and show it plainly in your quote, so there are no surprises for your treasurer.',
  },
  {
    icon: ScheduleOutlined,
    title: 'Earlier means better',
    body: 'Approval, production and shipping each take time. The sooner you loop us in, the more room we have to explore ideas rather than settle for whatever will fit the calendar.',
  },
];

const timeline = [
  {
    step: '01',
    label: 'Design & artwork',
    duration: '1–2 weeks',
    body: 'We take your concept and build it into print-ready artwork that already lines up with FSU’s guidelines. This is where we explore options together, so the version we submit is one we are all behind.',
  },
  {
    step: '02',
    label: 'Licensing approval',
    duration: 'At least 1–2 weeks',
    body: 'We handle the submission to FSU’s licensing office and any back-and-forth with them. Allow a week or two at minimum, and a little more if they ask for changes or are working through a high volume of requests — football season being the obvious one.',
  },
  {
    step: '03',
    label: 'Production',
    duration: '~10 business days',
    body: 'Once the design is approved, we turn most orders of 50 shirts or fewer around in about 10 business days. Larger runs take longer, and nothing goes on press before approval comes back.',
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
    title: 'Is This a Fit for Our Club?',
    items: [
      {
        q: 'Can you print for our club if we’re nowhere near Tallahassee?',
        a: (
          <>
            <Typography paragraph>
              Yes. We print for FSU clubs across the country and ship to wherever you are. Your club
              does not need to be near campus, and neither do we — the process and the licensing
              rules are the same either way.
            </Typography>
            <Typography>
              The only thing distance really changes is the shipping leg at the end, so if you are
              far out — or shipping to an event venue instead of somebody&apos;s address — build
              in a little extra room.
            </Typography>
          </>
        ),
      },
      {
        q: 'What items do you offer?',
        a: (
          <>
            <Typography paragraph>
              Mostly apparel — tees, hats, polos, quarter-zips, and the like. That is where our FSU
              license applies and where most club orders land.
            </Typography>
            <Typography>
              We can also help design and prep other printed pieces — signage, stickers, event
              collateral — even when the printing itself happens elsewhere. Anything carrying FSU
              marks still has to be produced by a licensed vendor, so for non-apparel we will hand
              off print-ready files to a licensee rather than run it ourselves. If you have something
              specific in mind, ask; worst case we tell you it is not ours and point you somewhere
              useful.
            </Typography>
          </>
        ),
      },
      {
        q: 'Our club is small and doesn’t have much of a budget. Can we still do merch?',
        a: (
          <>
            <Typography paragraph>
              Yes — and honestly, this is the case we are built for. We keep deals that are
              exclusive to FSU clubs, and the way we print handles very small runs, so you are not
              forced into 200 shirts to reach a price break and then storing 150 of them in
              someone&apos;s garage until next season.
            </Typography>
            <Typography>
              We optimize for experimentation with all our clients: print a small run, find out what
              your members actually wear, then reorder the design that worked. Being a smaller club
              is not a limitation on that — it is the situation it was designed around.
            </Typography>
          </>
        ),
      },
      {
        q: 'Are you alumni owned?',
        a: (
          <Typography>
            Yes, proudly. Class of 2011, lifelong Nole. That is part of why we are careful about the
            branding and licensing side rather than treating it as paperwork — they are our
            school&apos;s marks too.
          </Typography>
        ),
      },
    ],
  },
  {
    title: 'Branding & Licensing',
    items: [
      {
        q: 'How closely do we have to follow FSU’s branding guidelines?',
        a: (
          <>
            <Typography paragraph>
              Closely — but that is our work to carry, not yours. Florida State publishes and
              maintains the branding and licensing standards, and staying fluent in them is part of
              what you are hiring us for. Come to us with an idea rather than a rulebook, and we
              will tell you what it takes to get there.
            </Typography>
            <Typography paragraph>
              Start with the{' '}
              <TextLink href="https://brand.fsu.edu/">FSU Brand Style Guide</TextLink> and the{' '}
              <TextLink href="https://licensing.fsu.edu/trademark-policies">
                Office of Trademark Licensing&apos;s trademark policies
              </TextLink>
              . The club-specific pieces — including your official club wordmark — come from
              university leadership rather than from the brand site, so check with them if you are
              not sure which wordmark your club has been issued.
            </Typography>
            <Typography>
              The one thing worth knowing up front: the marks themselves are fixed. They can scale,
              but they are not redrawn, recolored, or merged into other artwork — that is how
              Florida State protects them, and we protect them the same way. Everything around the
              marks is where your club&apos;s personality goes, and there is far more room there
              than most clubs expect.
            </Typography>
          </>
        ),
      },
      {
        q: 'Can we use our own club logo instead of an FSU mark?',
        a: (
          <>
            <Typography paragraph>
              Recognized clubs and chapters are issued an official wordmark by university
              leadership, and using that wordmark as issued is the fastest path — it generally
              does not need additional design approval.
            </Typography>
            <Typography>
              Want a mark of your own instead? That is a real option — it goes to university
              leadership first, then to the Office of Trademark Licensing. It is a longer road, so
              tell us early and we will help you build something worth the trip.
            </Typography>
          </>
        ),
      },
      {
        q: 'Can we put a local sponsor’s logo on the shirt?',
        a: (
          <Typography>
            Usually yes, within a few conditions. A sponsor logo can sit alongside your official
            club or chapter wordmark, but not next to a standalone University trademark, and the
            layout should not read as though FSU is endorsing the sponsor. Send us the sponsor
            artwork early and we will find an arrangement that keeps everyone happy — your
            sponsor included.
          </Typography>
        ),
      },
      {
        q: 'Who has the final say on a design?',
        a: (
          <Typography>
            Florida State makes the final call — but you are not walking in there alone. We know
            what tends to clear and what tends to come back, we build the design accordingly, and we
            make the case for it when we submit. If licensing wants a change, we bring it back to
            you with options rather than a dead end. Treat this page as our practical experience,
            not an official ruling from FSU.
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
              thumb, plan on <strong>six to eight weeks</strong> between &ldquo;we have an idea&rdquo;
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
            Not directly — the licensing office sets its own pace, so budget at least one to two
            weeks, and more if changes come back or they are working through a backlog. What we can
            do is give it the best possible run: artwork built to the guidelines from the start,
            submitted cleanly, with us handling the follow-up. A design that clears on the first
            pass is the closest thing to a fast track there is.
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
            Tell us the date anyway — we would rather work the problem than turn you away. A
            simpler design, a different garment, or a smaller first run can often rescue a tight
            deadline, and we will lay out the options honestly. The one thing we will not do is
            promise a date that depends on an approval we do not control, because a promise like
            that helps nobody.
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
              Orders carrying university marks include a royalty that goes to Florida State. It is
              not a 687 Merch fee — we collect it on the university&apos;s behalf and pass it
              through. It is also part of what makes the whole system work: those royalties fund
              university initiatives, so your club&apos;s order sends a little something back to the
              school.
            </Typography>
            <Typography>
              We handle the paperwork and show the royalty as a line in your quote rather than
              burying it, so your treasurer sees the real number before you commit to anything.
            </Typography>
          </>
        ),
      },
      {
        q: 'Do you offer online stores or pre-sales for clubs?',
        a: (
          <>
            <Typography paragraph>
              We can stand up an online ordering portal for your club, but it works as a pre-sale
              rather than a permanent storefront. The shop opens for a limited window, your members
              order and pay through it, and then we close it, run every order in one batch, and ship
              the finished goods to the club.
            </Typography>
            <Typography paragraph>
              That is what makes small runs work. Nobody is guessing at quantities or sizes up front,
              your club is not fronting cash for inventory, and there are no leftover mediums sitting
              in a closet at the end.
            </Typography>
            <Typography>
              One scheduling note: the order window is an extra stage on top of the timeline above.
              The shop cannot open until the design is approved, and production does not start until
              it closes — so decide how long you want it open and count that toward your date.
            </Typography>
          </>
        ),
      },
      {
        q: 'Can we just hire you for the design and print it somewhere else?',
        a: (
          <>
            <Typography paragraph>
              You can hire us for design only — plenty of clubs do, and we are glad to. The one
              thing to know is that the printing still needs to go to a licensed vendor, whoever
              drew the artwork. An unlicensed local shop or a print-on-demand service is not an
              option, and it is the kind of thing that puts a club in an awkward spot with the
              university, so we would rather flag it now than after the shirts exist.
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
];

export default function FsuClubsFaq() {
  return (
    <Box>
      {/* Standalone page: logo only, linked back to the main site — no site nav. */}
      <Box
        component="header"
        sx={{
          py: { xs: 2, md: 2.5 },
          backgroundColor: '#0f0f0f',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            component={Link}
            href="/"
            aria-label="687 Merch home"
            sx={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <Image
              src="/687-logo.png"
              alt="687 Merch"
              width={144}
              height={48}
              style={{ width: 'auto', height: '48px', maxWidth: '100%' }}
              priority
            />
          </Box>
        </Container>
      </Box>

      <main>
        {/* Hero */}
        <Box
          sx={{
            pt: { xs: 7, md: 10 },
            pb: { xs: 8, md: 12 },
            backgroundColor: '#0f0f0f',
            backgroundImage:
              'radial-gradient(circle at 20% 0%, rgba(242, 191, 0, 0.12) 0%, rgba(15, 15, 15, 0) 55%)',
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h1"
              component="h1"
              sx={{ mb: 3, fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' } }}
            >
              Your FSU Club&apos;s Vision, Cleared To Print
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '1.05rem', md: '1.25rem' }, lineHeight: 1.7, mb: 4 }}
            >
              You know what your club wants to wear. We know what Florida State will approve.
              We&apos;re a licensed FSU vendor, and our job is to take your club&apos;s idea and turn
              it into something that clears licensing, protects the marks we all care about, and
              lands before the date that matters.
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
            scrollMarginTop: '24px',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ mb: { xs: 4, md: 6 }, maxWidth: 760 }}>
              <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
                Work Backward From Your Date
              </Typography>
              <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#444' }}>
                Kickoff, game day, a reunion — whatever your date is, here is the path from your
                idea to boxes on site. We drive three of these four stages and shepherd the fourth.
                Ranges below are typical, not guaranteed.
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
                  Plan on 6–8 weeks
                </Typography>
                <Typography sx={{ color: '#bbb', lineHeight: 1.7 }}>
                  The stages above add up to roughly five to seven weeks when everything goes
                  smoothly; the extra week gives us room to refine the artwork and gives your club
                  room to decide. Late summer and football season run longer, since every department
                  and club on campus is in the licensing queue at once. Come to us early and the
                  timeline stops being a constraint on what your club can make.
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
              You do not need to read any of this to work with us — we will bring what matters to
              you. It is here for the club leaders who like to see the source, and if anything on
              this page ever disagrees with the university&apos;s, theirs is the one to trust.
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
                Does Your Club Need Merch?
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 620, mx: 'auto' }}
              >
                We&apos;re happy to help. Tell us roughly what you have in mind and we&apos;ll walk
                you through what licensing will need and what it costs — royalty included —
                before you commit to anything.
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
                This page is our own guidance for club leaders, not an official FSU publication —
                branding, licensing, and royalty requirements are set by the university and can
                change.
              </Typography>
            </Paper>
          </Container>
        </Box>
      </main>

      <AppFooter />
    </Box>
  );
}
