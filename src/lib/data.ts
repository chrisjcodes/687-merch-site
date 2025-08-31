import { WorkItem, Partner } from './types';

export const siteCopy = {
  headline: 'THINK BIG. START SMALL.',
  subhead:
    'We help brands, artists, and small businesses launch and refine merchandise programs with flexible, small-batch production and creative support. Experiment, scale, and connect with your audience—without the big upfront costs.',
};

export const recentWork: WorkItem[] = [
  {
    slug: 'legendary-showdown',
    title: 'Penn State vs USC Tailgate Tee',
    thumbnail: '/images/work/showdown-thumb.jpg',
    images: ['/images/work/showdown-1.jpg', '/images/work/showdown-2.jpg'],
    tags: ['College', 'Event Tee'],
    year: 2025,
  },
  {
    slug: 'colony-retro',
    title: 'Colony Retro Logo Tee',
    thumbnail: '/images/work/colony-thumb.jpg',
    images: ['/images/work/colony-1.jpg'],
    tags: ['Logo', 'Retro'],
  },
  {
    slug: 'eagles-nest-west',
    title: 'Eagles Nest West Club Tee',
    thumbnail: '/images/work/enw-thumb.jpg',
    images: ['/images/work/enw-1.jpg'],
  },
];

export const partners: Partner[] = [
  { name: 'Sony Pictures', logo: '/images/partners/sony.png' },
  { name: 'Colony', logo: '/images/partners/colony.png' },
  { name: 'FSU Seminole Club', logo: '/images/partners/fsu.png' },
];