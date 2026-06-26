export interface ContentSection {
  slug: string;
  title: string;
  description: string;
  prefixes: string[];
}

export const contentSections: ContentSection[] = [
  {
    slug: 'hero',
    title: 'Hero Section',
    description: 'Edit the homepage hero text, buttons, and slide image URLs.',
    prefixes: ['hero'],
  },
  {
    slug: 'mission-strip',
    title: 'Vision, Mission & Programs Strip',
    description: 'Edit the three summary panels below the homepage hero.',
    prefixes: ['strip'],
  },
  {
    slug: 'stats',
    title: 'Stats Counter',
    description: 'Edit homepage metrics and their labels.',
    prefixes: ['stat'],
  },
  {
    slug: 'cta',
    title: 'Call To Action',
    description: 'Edit the homepage registration call-to-action block.',
    prefixes: ['cta'],
  },
  {
    slug: 'about',
    title: 'About Page',
    description: 'Edit copy used on the public About page.',
    prefixes: ['about'],
  },
  {
    slug: 'footer',
    title: 'Footer Contact',
    description: 'Edit footer tagline, address, email, and phone number.',
    prefixes: ['footer'],
  },
  {
    slug: 'social',
    title: 'Social Links',
    description: 'Edit public social media and messaging links.',
    prefixes: ['social'],
  },
];
