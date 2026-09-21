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
    tagline: 'Your screen printing, applied on your schedule.',
    body: 'You pay for your screen printing upfront—we print your artwork onto transfer sheets instead of directly onto garments. That means your prints aren\'t tied to any specific blank. Use them on t-shirts today, hoodies next month, or a different colorway entirely. Quantity pricing on the screen printing without having to predict exactly what you\'ll need or when.',
    icon: '02',
  },
  {
    id: 'mobile',
    title: 'Mobile Merch',
    tagline: 'We bring the shop. You keep the upside.',
    body: 'You pay for your screen printing—we print your artwork onto transfer sheets so they can be applied on-site at the event. You also put down an operational deposit covering our labor, travel, and event overhead. We bring the blank garments, van, equipment, and staff entirely at our cost. Event sales return your deposit first, then we split what\'s left. We only win when you do—and you leave with zero finished inventory.',
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
    context: 'Bar wanted to sell tees to regulars without over-ordering. Paying for the screen printing upfront let them apply prints to new blanks in small batches as demand came in.',
  },
  {
    slug: 'eagles-nest-west',
    title: 'Eagles Nest West Club Tee',
    thumbnail: '/images/work/EaglesNestWestFront.png',
    images: ['/images/work/EaglesNestWestFront.png', '/images/work/EaglesNestWestBack.png'],
    tags: ['Club', 'Lifestyle'],
    year: 2024,
    productionModel: 'flexible',
    context: 'Growing fan club needed an ongoing supply without committing to garment styles upfront—paying for the screen printing and applying it to blanks later gave them flexibility as the group expanded.',
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
    context: 'Independent label testing multiple colorways—paying for the screen printing once and applying it to different blanks let them test each style without committing to a full run.',
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
    context: 'Music venue selling merch across multiple events—screen printing to transfer sheets made it easy to restock between shows and apply to whatever garments were trending.',
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
    context: 'Small streetwear brand running a design across multiple drops—paying for the screen printing once and applying it to different blanks meant the same print carried through the whole season as styles sold through.',
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