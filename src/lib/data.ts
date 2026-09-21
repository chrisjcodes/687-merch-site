import { WorkItem, Partner } from './types';

export const siteCopy = {
  headline: 'YOUR MERCH PARTNER.',
  subhead:
    'Most printers take your order and hand it back. We work alongside you to figure out the right production model—and put our own resources on the line to make it work.',
};

export const services = [
  {
    id: 'traditional',
    title: 'Traditional Production',
    tagline: 'The straightforward option.',
    body: 'We work with you on the design, you choose your garments, sizes, colors and quantities, and we decorate everything and deliver the finished order to you.',
    icon: '01',
  },
  {
    id: 'flexible',
    title: 'Flexible Merch Production',
    tagline: 'Quantity pricing without quantity commitment.',
    body: 'We produce your designs as professional plastisol screen-print transfers. You purchase the prints upfront but decide when and how to use them—on any garment, color, or size mix, whenever you\'re ready. Lower print costs from quantity without predicting exactly what you\'ll need months out.',
    icon: '02',
  },
  {
    id: 'mobile',
    title: 'Mobile Merch',
    tagline: 'We bring the shop. You keep the upside.',
    body: 'You pay to have your artwork printed as transfers—you own those regardless of how the event goes. You also put down an operational deposit covering our labor, travel, and event overhead. We bring the blank garments, equipment, van, and staff entirely at our own cost. Event sales return your deposit first, then we split remaining profits. We only win when you do—and you walk away with zero finished inventory.',
    icon: '03',
    featured: true,
  },
];

export const recentWork: WorkItem[] = [
  {
    slug: 'penn-vs-usc-showdown',
    title: 'Penn State vs USC Tailgate Tee',
    thumbnail: '/images/work/PennXUSC.png',
    images: ['/images/work/PennXUSC.png'],
    tags: ['College', 'Event Tee', 'Rivalry'],
    year: 2024,
    productionModel: 'traditional',
    context: 'One-time rivalry event with a fixed date and known headcount—traditional bulk order was the right fit.',
  },
  {
    slug: 'colony-cinco-anos',
    title: 'Colony Cinco Años Tee',
    thumbnail: '/images/work/ColonyCincoAnosFront.png',
    images: ['/images/work/ColonyCincoAnosFront.png'],
    tags: ['Logo', 'Anniversary', 'Retro'],
    year: 2024,
    productionModel: 'flexible',
    context: 'Bar wanted to sell tees to regulars over time without over-ordering. Transfers let them restock in small batches as demand came in.',
  },
  {
    slug: 'eagles-nest-west',
    title: 'Eagles Nest West Club Tee',
    thumbnail: '/images/work/EaglesNestWestFront.png',
    images: ['/images/work/EaglesNestWestFront.png', '/images/work/EaglesNestWestBack.png'],
    tags: ['Club', 'Lifestyle'],
    year: 2024,
    productionModel: 'flexible',
    context: 'Growing fan club needed an ongoing supply without committing to garment styles upfront—transfers gave them flexibility as the group expanded.',
  },
  {
    slug: 'interstellar',
    title: 'Interstellar Graphic Tee',
    thumbnail: '/images/work/InterstellarFront.png',
    images: ['/images/work/InterstellarFront.png', '/images/work/InterstellarBack.png'],
    tags: ['Graphic', 'Space', 'Movie'],
    year: 2024,
    productionModel: 'traditional',
    context: 'Limited-run for a film screening event—defined quantity, single delivery, no need for ongoing production.',
  },
  {
    slug: 'philthy-design',
    title: 'Philthy Custom Design',
    thumbnail: '/images/work/PhilthyFront.png',
    images: ['/images/work/PhilthyFront.png', '/images/work/PhilthyBack.png'],
    tags: ['Custom', 'Street'],
    year: 2024,
    productionModel: 'flexible',
    context: 'Independent label testing multiple colorways—transfers let them produce small quantities of each without locking into a full run on any single style.',
  },
  {
    slug: 'good-people-advisory',
    title: 'Good People Advisory',
    thumbnail: '/images/work/GoodPeopleAdvisoryBack.png',
    images: ['/images/work/GoodPeopleAdvisoryBack.png'],
    tags: ['Advisory', 'Lifestyle'],
    year: 2024,
    productionModel: 'traditional',
    context: 'Corporate client gifting with a curated size run—straightforward one-time order, no ongoing inventory needed.',
  },
  {
    slug: 'san-remo-not-like-us',
    title: 'San Remo Not Like Us',
    thumbnail: '/images/work/SanRemoNotLikeUs.png',
    images: ['/images/work/SanRemoNotLikeUs.png'],
    tags: ['Music', 'Culture'],
    year: 2024,
    productionModel: 'flexible',
    context: 'Music venue selling merch across multiple events—transfers made it easy to restock between shows and adjust to whatever garments were trending.',
  },
  {
    slug: 'sf-fsu-design',
    title: 'SF FSU Design',
    thumbnail: '/images/work/SFFSU.png',
    images: ['/images/work/SFFSU.png'],
    tags: ['College', 'SF'],
    year: 2024,
    productionModel: 'traditional',
    context: 'Alumni watch party tee with a known attendee list—bulk order with a hard deadline, done.',
  },
  {
    slug: 'brit-since-96',
    title: 'Brit Since 96',
    thumbnail: '/images/work/BritSince96.png',
    images: ['/images/work/BritSince96.png'],
    tags: ['Vintage', 'Year'],
    year: 2024,
    productionModel: 'flexible',
    context: 'Small streetwear brand printing a design across multiple drops over the season—transfers meant they could use the same print on different blanks as styles sold through.',
  },
];

export const partners: Partner[] = [
  { name: 'Sony Pictures', logo: '/images/partners/sony.png' },
  { name: 'Colony', logo: '/images/partners/colony.png' },
  { name: 'FSU SF', logo: '/images/partners/fsu-sf.webp' },
  { name: 'Brit', logo: '/images/partners/brit.webp' },
  { name: 'Good People', logo: '/images/partners/good-people.webp' },
  { name: 'San Remo', logo: '/images/partners/san-remo.webp' },
];