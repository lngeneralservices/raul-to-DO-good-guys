// V2 Section Content Types
// These types mirror the CMS sections_content structure
// This is the SINGLE SOURCE OF TRUTH for content types

export interface SectionBase {
  _enabled?: boolean;
  _order?: number;
}

export interface HeroSection extends SectionBase {
  headline: string;
  subheadline?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  backgroundImage?: string;
  image?: string;
}

export interface AboutSection extends SectionBase {
  title: string;
  subtitle?: string;
  content_md: string;
}

export interface StatItem {
  value: string;
  label: string;
  suffix?: string;
  icon?: 'briefcase' | 'clock' | 'star' | 'users' | 'award' | 'check' | 'trophy' | 'target';
}

export interface StatsSection extends SectionBase {
  title?: string;
  subtitle?: string;
  items: StatItem[];
}

export interface ServiceItem {
  name: string;
  description: string;
  icon?: string;
}

export interface ServicesSection extends SectionBase {
  title: string;
  subtitle?: string;
  items: ServiceItem[];
}

export interface ProcessStep {
  title: string;
  description: string;
  icon?: string;
}

export interface ProcessSection extends SectionBase {
  title?: string;
  subtitle?: string;
  steps: ProcessStep[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection extends SectionBase {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
}

export interface TestimonialItem {
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
}

export interface TestimonialsSection extends SectionBase {
  title: string;
  subtitle?: string;
  items: TestimonialItem[];
}

export interface CtaSection extends SectionBase {
  title: string;
  subtitle?: string;
  buttonText?: string;
  secondaryButtonText?: string;
}

export interface TrustBadge {
  label: string;
  description?: string;
  icon?: string;
}

export interface TrustBadgesSection extends SectionBase {
  title?: string;
  subtitle?: string;
  badges: TrustBadge[];
}

export interface AreasSection extends SectionBase {
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  isHighlighted?: boolean;
  ctaText?: string;
}

export interface PricingSection extends SectionBase {
  title?: string;
  subtitle?: string;
  tiers: PricingTier[];
}

// Additional section types for extensibility
export interface PartnersSection extends SectionBase {
  title: string;
  subtitle?: string;
}

export interface GallerySection extends SectionBase {
  title: string;
  subtitle?: string;
  description?: string;
}

export interface TeamSection extends SectionBase {
  title: string;
  subtitle?: string;
}

export interface BlogSection extends SectionBase {
  title: string;
  subtitle?: string;
}

// Combined sections content type
export interface SectionsContent {
  hero?: HeroSection;
  about?: AboutSection;
  stats?: StatsSection;
  services?: ServicesSection;
  process?: ProcessSection;
  faq?: FaqSection;
  testimonials?: TestimonialsSection;
  cta?: CtaSection;
  trustBadges?: TrustBadgesSection;
  areas?: AreasSection;
  pricing?: PricingSection;
  partners?: PartnersSection;
  gallery?: GallerySection;
  team?: TeamSection;
  blog?: BlogSection;
}

// City type for Areas section
export interface City {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  h1?: string;
  meta_title?: string;
  meta_description?: string;
}

// Page content from CMS
export interface PageContent {
  id: string;
  slug: string;
  type: string;
  title?: string;
  h1?: string;
  excerpt?: string;
  meta_title?: string;
  meta_description?: string;
  body_md?: string;
  featured_image_url?: string;
  sections_content?: SectionsContent;
}

// ============================================
// HEADER & FOOTER CONFIG TYPES
// ============================================

export interface QuickLink {
  label: string;
  url: string;
}

export interface HeaderConfig {
  navItems?: Array<{ label: string; href: string }>;
  phoneNumber?: string;
  logoSize?: string;
  logoPosition?: 'left' | 'center';
  navStyle?: string;
  navAlignment?: 'left' | 'center' | 'right';
  showCta?: boolean;
  ctaText?: string;
  ctaLink?: string;
  ctaStyle?: string;
  showPhone?: boolean;
  phonePosition?: 'left' | 'right' | 'cta';
  sticky?: boolean;
  transparent?: boolean;
  backgroundColor?: string;
  textColor?: string;
  mobileMenuStyle?: string;
  [key: string]: unknown;
}

export interface FooterConfig {
  email?: string;
  quickLinksModule?: { links?: QuickLink[] };
  serviceLinks?: Array<{ label: string; href: string }>;
  quickLinks?: Array<{ label: string; href: string }>;
  socialLinks?: Array<{ platform: string; url: string }>;
  copyrightText?: string;
  showNewsletter?: boolean;
  columns?: number;
  [key: string]: unknown;
}

// Project info from CMS
export interface Project {
  name: string;
  slug: string;
  logo_url?: string;
  nap_name?: string;
  nap_phone?: string;
  nap_email?: string;
  nap_address?: string;
  nap_city?: string;
  nap_state?: string;
  nap_zip?: string;
  primary_category?: string;
  header_config?: HeaderConfig;
  footer_config?: FooterConfig;
}
