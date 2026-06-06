export interface Category {
  slug: string
  name: string
  description: string
  color: string
  bgColor: string
}

export const categories: Category[] = [
  {
    slug: 'finance',
    name: 'Finance',
    description: 'Personal finance, budgeting, investing, and money management tips.',
    color: '#16a34a',
    bgColor: '#dcfce7',
  },
  {
    slug: 'stock-market',
    name: 'Stock Market',
    description: 'Stock analysis, market trends, trading strategies, and investment ideas.',
    color: '#0284c7',
    bgColor: '#e0f2fe',
  },
  {
    slug: 'business',
    name: 'Business',
    description: 'Entrepreneurship, startups, business strategy, and corporate news.',
    color: '#9333ea',
    bgColor: '#f3e8ff',
  },
  {
    slug: 'technology',
    name: 'Technology',
    description: 'Tech news, software, hardware, and digital innovation.',
    color: '#2563eb',
    bgColor: '#dbeafe',
  },
  {
    slug: 'ai',
    name: 'AI',
    description: 'Artificial intelligence, machine learning, and the future of automation.',
    color: '#dc2626',
    bgColor: '#fee2e2',
  },
  {
    slug: 'careers',
    name: 'Careers',
    description: 'Job hunting, career growth, skills development, and workplace tips.',
    color: '#d97706',
    bgColor: '#fef3c7',
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    description: 'Property investing, housing market, buying, selling, and renting.',
    color: '#0891b2',
    bgColor: '#cffafe',
  },
  {
    slug: 'insurance',
    name: 'Insurance',
    description: 'Health, life, auto, and home insurance guides and comparisons.',
    color: '#4f46e5',
    bgColor: '#e0e7ff',
  },
  {
    slug: 'sports',
    name: 'Sports',
    description: 'Latest sports news, match analysis, athlete profiles, and more.',
    color: '#be123c',
    bgColor: '#ffe4e6',
  },
  {
    slug: 'general',
    name: 'General',
    description: 'Everything else — lifestyle, culture, and interesting stories.',
    color: '#64748b',
    bgColor: '#f1f5f9',
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
