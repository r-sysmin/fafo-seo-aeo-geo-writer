export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export interface Page {
  id: string;
  user_id: string;
  url: string;
  keyword: string | null;
  title: string | null;
  description: string | null;
  slug: string | null;
  og_image_url: string | null;
  current_title: string | null;
  current_description: string | null;
  created_at: string;
  updated_at: string;
}

export type PageStatus = 'optimized' | 'partial' | 'missing';

export function deriveStatus(page: Page): PageStatus {
  if (page.title && page.description) return 'optimized';
  if (page.title || page.description) return 'partial';
  return 'missing';
}

export interface GenerateMetaResult {
  title: string;
  description: string;
  slug: string;
  current_title: string;
  current_description: string;
}

export interface FeatureTab {
  id: string;
  label: string;
  description: string;
  screenshot: string;
}

export interface ValueProp {
  icon: string;
  label: string;
  body: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface FooterLinks {
  product: { label: string; href: string }[];
  connect: { label: string; href: string }[];
  legal: { label: string; href: string }[];
}

export const profile: Profile = {
  id: 'demo-user-01',
  full_name: 'Maya Reyes',
  avatar_url: null,
};

export const pages: Page[] = [
  {
    id: 'p1',
    user_id: 'demo-user-01',
    url: 'stackform.io/blog/deploy-faster',
    keyword: 'CI/CD pipeline',
    title: 'Deploy Faster with CI/CD — Stackform Engineering Guide',
    description: "Learn how Stackform's CI/CD pipeline cuts deploy time by 80%. Step-by-step guide for engineering teams shipping daily.",
    slug: 'deploy-faster',
    og_image_url: 'https://stackform.io/og/deploy-faster.png',
    current_title: 'Deploy faster - Stackform',
    current_description: 'Stackform blog.',
    created_at: '2024-03-15T10:22:00Z',
    updated_at: '2024-03-15T10:22:00Z',
  },
  {
    id: 'p2',
    user_id: 'demo-user-01',
    url: 'stackform.io/features',
    keyword: 'CI/CD for teams',
    title: 'Stackform — Ship Software Faster',
    description: "Stackform gives your engineering team a CI/CD pipeline that deploys in seconds, not minutes. No config files, no YAML.",
    slug: 'features',
    og_image_url: 'https://stackform.io/og/features.png',
    current_title: 'Features - Stackform',
    current_description: 'Stackform feature overview.',
    created_at: '2024-03-12T09:14:00Z',
    updated_at: '2024-03-12T09:14:00Z',
  },
  {
    id: 'p3',
    user_id: 'demo-user-01',
    url: 'stackform.io/about',
    keyword: 'developer tools company',
    title: 'About Stackform — Built for Engineering Teams',
    description: 'Stackform was founded by engineers who were tired of slow deployments. We build CI/CD tools that get out of your way.',
    slug: 'about',
    og_image_url: 'https://stackform.io/og/about.png',
    current_title: 'About - Stackform',
    current_description: 'About us.',
    created_at: '2024-03-10T14:30:00Z',
    updated_at: '2024-03-10T14:30:00Z',
  },
  {
    id: 'p4',
    user_id: 'demo-user-01',
    url: 'stackform.io/blog/zero-downtime',
    keyword: 'zero downtime deployment',
    title: 'Zero Downtime Deployments with Stackform',
    description: "Ship to production without taking your app offline. Stackform's blue-green deployment strategy keeps your users happy.",
    slug: 'zero-downtime',
    og_image_url: 'https://stackform.io/og/zero-downtime.png',
    current_title: 'Zero downtime - Stackform blog',
    current_description: 'Stackform engineering blog.',
    created_at: '2024-02-28T11:05:00Z',
    updated_at: '2024-02-28T11:05:00Z',
  },
  {
    id: 'p5',
    user_id: 'demo-user-01',
    url: 'stackform.io/integrations',
    keyword: 'GitHub GitLab integrations',
    title: 'Stackform Integrations — GitHub, GitLab, Bitbucket',
    description: 'Connect your existing repo in 60 seconds. Stackform integrates with GitHub, GitLab, and Bitbucket with no config required.',
    slug: 'integrations',
    og_image_url: 'https://stackform.io/og/integrations.png',
    current_title: 'Integrations - Stackform',
    current_description: null,
    created_at: '2024-02-20T16:44:00Z',
    updated_at: '2024-02-20T16:44:00Z',
  },
  {
    id: 'p6',
    user_id: 'demo-user-01',
    url: 'stackform.io/pricing',
    keyword: 'CI/CD pricing',
    title: 'Stackform Pricing',
    description: null,
    slug: 'pricing',
    og_image_url: null,
    current_title: 'Pricing - Stackform',
    current_description: null,
    created_at: '2024-03-10T08:22:00Z',
    updated_at: '2024-03-10T08:22:00Z',
  },
  {
    id: 'p7',
    user_id: 'demo-user-01',
    url: 'stackform.io/docs/quickstart',
    keyword: 'getting started guide',
    title: 'Getting Started with Stackform',
    description: null,
    slug: 'quickstart',
    og_image_url: null,
    current_title: 'Quickstart - Stackform Docs',
    current_description: 'Getting started.',
    created_at: '2024-03-08T13:17:00Z',
    updated_at: '2024-03-08T13:17:00Z',
  },
  {
    id: 'p8',
    user_id: 'demo-user-01',
    url: 'stackform.io/security',
    keyword: 'SOC2 security compliance',
    title: 'Stackform Security & Compliance',
    description: null,
    slug: 'security',
    og_image_url: null,
    current_title: null,
    current_description: null,
    created_at: '2024-02-14T10:00:00Z',
    updated_at: '2024-02-14T10:00:00Z',
  },
  {
    id: 'p9',
    user_id: 'demo-user-01',
    url: 'stackform.io/changelog',
    keyword: null,
    title: null,
    description: null,
    slug: null,
    og_image_url: null,
    current_title: null,
    current_description: null,
    created_at: '2024-03-05T09:00:00Z',
    updated_at: '2024-03-05T09:00:00Z',
  },
  {
    id: 'p10',
    user_id: 'demo-user-01',
    url: 'stackform.io/blog/kubernetes-vs-stackform',
    keyword: null,
    title: null,
    description: null,
    slug: null,
    og_image_url: null,
    current_title: null,
    current_description: null,
    created_at: '2024-01-30T15:20:00Z',
    updated_at: '2024-01-30T15:20:00Z',
  },
];

export const demoGeneration: GenerateMetaResult = {
  title: 'Deploy Faster with CI/CD — Stackform Engineering Guide',
  description: "Learn how Stackform's CI/CD pipeline cuts deploy time by 80%. Step-by-step guide for engineering teams shipping daily.",
  slug: 'deploy-faster',
  current_title: 'Deploy faster - Stackform',
  current_description: 'Stackform blog.',
};

export const featureTabs: FeatureTab[] = [
  {
    id: 'checklist',
    label: 'Pages checklist',
    description: "Scan every URL you've added. Green means optimized. Amber means partial. Red means missing. Your SEO backlog in one view.",
    screenshot: '/screenshots/pages-list.png',
  },
  {
    id: 'previews',
    label: 'Platform previews',
    description: 'See exactly how your page appears on Google, X, Slack, Facebook, LinkedIn, and Discord — before you publish a single character.',
    screenshot: '/screenshots/page-view-google.png',
  },
  {
    id: 'ai',
    label: 'AI generate',
    description: 'Paste a URL and a keyword. Hit Generate. Get a title and description crafted for clicks, pre-filled and ready to tweak.',
    screenshot: '/screenshots/edit-mode-generating.png',
  },
];

export const valueProps: ValueProp[] = [
  { icon: 'FileText', label: 'No fluff copy', body: 'Your library, your words. No filler.' },
  { icon: 'Eye', label: 'Instant previews', body: 'See Google, X, Slack, and more before you publish.' },
  { icon: 'Library', label: 'Your own library', body: "Every page you've ever optimized, in one place." },
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote: "I optimized 40 pages in one afternoon. The Google preview alone saved me hours of guessing.",
    name: 'Maya R.',
    role: 'Head of Content',
    company: 'Stackform',
  },
  {
    id: 't2',
    quote: "I used to write meta tags blind. Now I can see exactly what X and Slack will show before I hit publish.",
    name: 'Dan K.',
    role: 'Indie founder',
    company: 'Loopcast',
  },
  {
    id: 't3',
    quote: "The checklist view is the thing. I finally know which pages are done and which aren't.",
    name: 'Priya N.',
    role: 'SEO Lead',
    company: 'Meridian',
  },
];

export const footerLinks: FooterLinks = {
  product: [
    { label: 'Pages list', href: '/demo/pages' },
    { label: 'Demo', href: '/demo/pages' },
  ],
  connect: [
    { label: 'Twitter', href: 'https://twitter.com' },
    { label: 'GitHub', href: 'https://github.com' },
  ],
  legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
  ],
};
