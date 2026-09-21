import { WorkItem, Partner } from './types';

export const siteCopy = {
  headline: 'MERCH ON YOUR TERMS.',
  subhead:
    'Three production models designed around how you actually work—not how a print shop wants you to order.',
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
    tagline: 'We bring the shop to your event.',
    body: 'You purchase the transfers and provide a deposit. We bring blank merchandise, equipment, and staff to run your merch shop on-site. Customers buy at the event and we produce on the spot. Once sales recoup your deposit, it\'s returned to you and we split remaining profits. Zero leftover finished inventory.',
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
  },
  {
    slug: 'colony-cinco-anos',
    title: 'Colony Cinco Años Tee',
    thumbnail: '/images/work/ColonyCincoAnosFront.png',
    images: ['/images/work/ColonyCincoAnosFront.png'],
    tags: ['Logo', 'Anniversary', 'Retro'],
    year: 2024,
  },
  {
    slug: 'eagles-nest-west',
    title: 'Eagles Nest West Club Tee',
    thumbnail: '/images/work/EaglesNestWestFront.png',
    images: ['/images/work/EaglesNestWestFront.png', '/images/work/EaglesNestWestBack.png'],
    tags: ['Club', 'Lifestyle'],
    year: 2024,
  },
  {
    slug: 'interstellar',
    title: 'Interstellar Graphic Tee',
    thumbnail: '/images/work/InterstellarFront.png',
    images: ['/images/work/InterstellarFront.png', '/images/work/InterstellarBack.png'],
    tags: ['Graphic', 'Space', 'Movie'],
    year: 2024,
  },
  {
    slug: 'philthy-design',
    title: 'Philthy Custom Design',
    thumbnail: '/images/work/PhilthyFront.png',
    images: ['/images/work/PhilthyFront.png', '/images/work/PhilthyBack.png'],
    tags: ['Custom', 'Street'],
    year: 2024,
  },
  {
    slug: 'good-people-advisory',
    title: 'Good People Advisory',
    thumbnail: '/images/work/GoodPeopleAdvisoryBack.png',
    images: ['/images/work/GoodPeopleAdvisoryBack.png'],
    tags: ['Advisory', 'Lifestyle'],
    year: 2024,
  },
  {
    slug: 'san-remo-not-like-us',
    title: 'San Remo Not Like Us',
    thumbnail: '/images/work/SanRemoNotLikeUs.png',
    images: ['/images/work/SanRemoNotLikeUs.png'],
    tags: ['Music', 'Culture'],
    year: 2024,
  },
  {
    slug: 'sf-fsu-design',
    title: 'SF FSU Design',
    thumbnail: '/images/work/SFFSU.png',
    images: ['/images/work/SFFSU.png'],
    tags: ['College', 'SF'],
    year: 2024,
  },
  {
    slug: 'brit-since-96',
    title: 'Brit Since 96',
    thumbnail: '/images/work/BritSince96.png',
    images: ['/images/work/BritSince96.png'],
    tags: ['Vintage', 'Year'],
    year: 2024,
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