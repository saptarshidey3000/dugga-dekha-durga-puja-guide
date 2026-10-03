import { PandalCategory } from './types';

export interface CategoryMeta {
  id: PandalCategory;
  name: string;
  bengaliName: string;
  icon: string;
  tagline: string;
  color: string;
  badgeBg: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'must-visit',
    name: 'Must Visit',
    bengaliName: 'অবশ্য দ্রষ্টব্য',
    icon: '🔥',
    tagline: 'Iconic crowd favorites and hallmark celebrations that define Kolkata Puja.',
    color: '#B93624',
    badgeBg: 'rgba(185, 54, 36, 0.15)',
  },
  {
    id: 'best-theme',
    name: 'Best Theme',
    bengaliName: 'সেরা থিম',
    icon: '🎨',
    tagline: 'Visionary installations, architectural artistry, and profound conceptual design.',
    color: '#D99A3D',
    badgeBg: 'rgba(217, 154, 61, 0.15)',
  },
  {
    id: 'traditional',
    name: 'Traditional',
    bengaliName: 'সনাতনী',
    icon: '🛕',
    tagline: 'Pure devotion, timeless Ekchala pratima, Chandoker daak, and authentic rituals.',
    color: '#E07A5F',
    badgeBg: 'rgba(224, 122, 95, 0.15)',
  },
  {
    id: 'heritage',
    name: 'Heritage',
    bengaliName: 'ঐতিহ্যবাহী',
    icon: '🏛️',
    tagline: 'Century-old neighborhood institutions steeped in Bengal’s cultural history.',
    color: '#C59B27',
    badgeBg: 'rgba(197, 155, 39, 0.15)',
  },
];
