/**
 * Contract v1 - Defensive Normalization Functions
 * 
 * These functions NEVER throw and ALWAYS return valid defaults.
 * Use these to safely transform raw CMS data into typed structures.
 * 
 * VERSION: 1.0
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type CtaLinkType = 'url' | 'phone' | 'form' | 'page' | 'email';

export interface CtaButtonConfig {
  text: string;
  linkType: CtaLinkType;
  href?: string;
  customUrl?: string;
  pageSlug?: string;
  phoneNumber?: string;
  email?: string;
  newTab?: boolean;
}

export interface QuickLink {
  label: string;
  url: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterConfig {
  email?: string;
  quickLinksModule?: { links?: QuickLink[] };
  quickLinks?: NavItem[];
  serviceLinks?: Array<{ label: string; href: string }>;
  socialLinks?: Array<{ platform: string; url: string }>;
  copyrightText?: string;
  showNewsletter?: boolean;
  columns?: number;
  [key: string]: unknown;
}

export interface HeaderConfig {
  navItems?: NavItem[];
  phoneNumber?: string;
  logoSize?: string;
  logoPosition?: 'left' | 'center';
  navStyle?: string;
  navAlignment?: 'left' | 'center' | 'right';
  showCta?: boolean;
  ctaText?: string;
  ctaLink?: string;
  sticky?: boolean;
  transparent?: boolean;
  [key: string]: unknown;
}

export interface SectionBase {
  _enabled?: boolean;
  _order?: number;
}

export interface HeroSection extends SectionBase {
  headline?: string;
  subheadline?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  backgroundImage?: string;
  image?: string;
}

export interface AboutSection extends SectionBase {
  title?: string;
  subtitle?: string;
  content_md?: string;
}

export interface SectionsContent {
  hero?: HeroSection;
  about?: AboutSection;
  [key: string]: unknown;
}

export interface Project {
  name?: string;
  slug?: string;
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
  [key: string]: unknown;
}

// ============================================
// HELPERS
// ============================================

const isDev = process.env.NODE_ENV === 'development';

function warn(message: string, data?: unknown): void {
  if (isDev) {
    console.warn(`[ContractV1] ${message}`, data ?? '');
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

// ============================================
// CTA BUTTON NORMALIZATION
// ============================================

export function normalizeCtaButton(
  input: unknown,
  fallbackText: string,
  fallbackPhone?: string
): CtaButtonConfig | undefined {
  if (input === null || input === undefined) return undefined;
  if (!isObject(input)) {
    warn('Invalid CTA button config', input);
    return undefined;
  }
  // Empty object = invalid
  if (Object.keys(input).length === 0) return undefined;

  const hasText = isString(input.text) && input.text.trim().length > 0;
  const hasLinkType = isString(input.linkType) && ['url', 'phone', 'form', 'page', 'email'].includes(input.linkType);
  const hasDestination = isString(input.customUrl) || isString(input.pageSlug) || isString(input.phoneNumber) || isString(input.email);

  // No meaningful data = invalid
  if (!hasText && !hasLinkType && !hasDestination && !fallbackText) return undefined;

  const text = hasText ? (input.text as string).trim() : fallbackText;
  let linkType: CtaLinkType = 'url';
  
  if (hasLinkType) {
    linkType = input.linkType as CtaLinkType;
  } else if (isString(input.phoneNumber) || (fallbackPhone && !input.customUrl && !input.pageSlug)) {
    linkType = 'phone';
  } else if (isString(input.email)) {
    linkType = 'email';
  } else if (isString(input.pageSlug)) {
    linkType = 'page';
  }

  const result: CtaButtonConfig = { text, linkType };

  if (isString(input.href)) result.href = input.href;
  if (isString(input.customUrl)) result.customUrl = input.customUrl;
  if (isString(input.pageSlug)) result.pageSlug = input.pageSlug;
  if (isString(input.phoneNumber)) result.phoneNumber = input.phoneNumber;
  else if (fallbackPhone) result.phoneNumber = fallbackPhone;
  if (isString(input.email)) result.email = input.email;
  if (typeof input.newTab === 'boolean') result.newTab = input.newTab;

  if (linkType === 'url' && !result.href && !result.customUrl && !result.pageSlug) {
    result.href = '/';
  }

  return result;
}

// ============================================
// FOOTER CONFIG NORMALIZATION
// ============================================

export function normalizeFooterConfig(input: unknown): FooterConfig {
  if (!isObject(input)) {
    if (input !== null && input !== undefined) warn('Invalid footer config', input);
    return {};
  }

  const result: FooterConfig = {};

  if (isString(input.email)) result.email = input.email;
  if (isString(input.copyrightText)) result.copyrightText = input.copyrightText;
  if (typeof input.showNewsletter === 'boolean') result.showNewsletter = input.showNewsletter;
  if (typeof input.columns === 'number') result.columns = input.columns;

  if (isObject(input.quickLinksModule)) {
    const links = normalizeQuickLinks(input.quickLinksModule.links);
    result.quickLinksModule = { links };
  }

  if (isArray(input.quickLinks)) {
    result.quickLinks = input.quickLinks
      .filter(isObject)
      .map((item): NavItem => ({
        label: isString(item.label) ? item.label : '',
        href: isString(item.href) ? item.href : (isString(item.url) ? item.url : '/'),
      }))
      .filter(item => item.label);
  }

  if (isArray(input.serviceLinks)) {
    result.serviceLinks = input.serviceLinks
      .filter(isObject)
      .map((item) => ({
        label: isString(item.label) ? item.label : '',
        href: isString(item.href) ? item.href : '/',
      }))
      .filter(item => item.label);
  }

  if (isArray(input.socialLinks)) {
    result.socialLinks = input.socialLinks
      .filter(isObject)
      .map((item) => ({
        platform: isString(item.platform) ? item.platform : '',
        url: isString(item.url) ? item.url : '',
      }))
      .filter(item => item.platform && item.url);
  }

  return result;
}

function normalizeQuickLinks(input: unknown): QuickLink[] {
  if (!isArray(input)) return [];
  return input
    .filter(isObject)
    .map((item): QuickLink => ({
      label: isString(item.label) ? item.label : '',
      url: isString(item.url) ? item.url : (isString(item.href) ? item.href : '/'),
    }))
    .filter(item => item.label);
}

// ============================================
// HEADER CONFIG NORMALIZATION
// ============================================

export function normalizeHeaderConfig(input: unknown): HeaderConfig {
  if (!isObject(input)) {
    if (input !== null && input !== undefined) warn('Invalid header config', input);
    return {};
  }

  const result: HeaderConfig = {};

  if (isArray(input.navItems)) {
    result.navItems = input.navItems
      .filter(isObject)
      .map((item): NavItem => ({
        label: isString(item.label) ? item.label : '',
        href: isString(item.href) ? item.href : '/',
      }))
      .filter(item => item.label);
  }

  if (isString(input.phoneNumber)) result.phoneNumber = input.phoneNumber;
  if (isString(input.logoSize)) result.logoSize = input.logoSize;
  if (isString(input.navStyle)) result.navStyle = input.navStyle;
  if (isString(input.ctaText)) result.ctaText = input.ctaText;
  if (isString(input.ctaLink)) result.ctaLink = input.ctaLink;

  if (input.logoPosition === 'left' || input.logoPosition === 'center') {
    result.logoPosition = input.logoPosition;
  }
  if (input.navAlignment === 'left' || input.navAlignment === 'center' || input.navAlignment === 'right') {
    result.navAlignment = input.navAlignment;
  }

  if (typeof input.showCta === 'boolean') result.showCta = input.showCta;
  if (typeof input.sticky === 'boolean') result.sticky = input.sticky;
  if (typeof input.transparent === 'boolean') result.transparent = input.transparent;

  return result;
}

// ============================================
// SECTIONS CONTENT NORMALIZATION
// ============================================

export function normalizeSectionsContent(input: unknown): SectionsContent {
  if (!isObject(input)) {
    if (input !== null && input !== undefined) warn('Invalid sections content', input);
    return {};
  }

  const result: SectionsContent = {};

  if (isObject(input.hero)) {
    result.hero = {
      _enabled: typeof input.hero._enabled === 'boolean' ? input.hero._enabled : true,
      _order: typeof input.hero._order === 'number' ? input.hero._order : 0,
      headline: isString(input.hero.headline) ? input.hero.headline : undefined,
      subheadline: isString(input.hero.subheadline) ? input.hero.subheadline : undefined,
      ctaPrimary: isString(input.hero.ctaPrimary) ? input.hero.ctaPrimary : undefined,
      ctaSecondary: isString(input.hero.ctaSecondary) ? input.hero.ctaSecondary : undefined,
      backgroundImage: isString(input.hero.backgroundImage) ? input.hero.backgroundImage : undefined,
      image: isString(input.hero.image) ? input.hero.image : undefined,
    };
  }

  if (isObject(input.about)) {
    result.about = {
      _enabled: typeof input.about._enabled === 'boolean' ? input.about._enabled : true,
      _order: typeof input.about._order === 'number' ? input.about._order : 1,
      title: isString(input.about.title) ? input.about.title : undefined,
      subtitle: isString(input.about.subtitle) ? input.about.subtitle : undefined,
      content_md: isString(input.about.content_md) ? input.about.content_md : undefined,
    };
  }

  // Copy other sections as-is
  const sectionKeys = ['stats', 'services', 'process', 'faq', 'testimonials', 'cta', 'trustBadges', 'areas', 'pricing'];
  for (const key of sectionKeys) {
    if (isObject(input[key])) {
      result[key] = {
        ...(input[key] as Record<string, unknown>),
        _enabled: typeof (input[key] as Record<string, unknown>)._enabled === 'boolean' 
          ? (input[key] as Record<string, unknown>)._enabled 
          : true,
        _order: typeof (input[key] as Record<string, unknown>)._order === 'number' 
          ? (input[key] as Record<string, unknown>)._order 
          : 999,
      };
    }
  }

  return result;
}

// ============================================
// PROJECT NORMALIZATION
// ============================================

export function normalizeProject(input: unknown): Project {
  if (!isObject(input)) {
    if (input !== null && input !== undefined) warn('Invalid project data', input);
    return {};
  }

  const result: Project = {};

  if (isString(input.name)) result.name = input.name;
  if (isString(input.slug)) result.slug = input.slug;
  if (isString(input.logo_url)) result.logo_url = input.logo_url;
  if (isString(input.nap_name)) result.nap_name = input.nap_name;
  if (isString(input.nap_phone)) result.nap_phone = input.nap_phone;
  if (isString(input.nap_email)) result.nap_email = input.nap_email;
  if (isString(input.nap_address)) result.nap_address = input.nap_address;
  if (isString(input.nap_city)) result.nap_city = input.nap_city;
  if (isString(input.nap_state)) result.nap_state = input.nap_state;
  if (isString(input.nap_zip)) result.nap_zip = input.nap_zip;
  if (isString(input.primary_category)) result.primary_category = input.primary_category;

  result.header_config = normalizeHeaderConfig(input.header_config);
  result.footer_config = normalizeFooterConfig(input.footer_config);

  return result;
}

// ============================================
// GLOBAL CTA NORMALIZATION
// ============================================

export function normalizeGlobalCta(
  designData: unknown,
  fallbackPhone?: string
): {
  phoneNumber?: string;
  primaryText: string;
  secondaryText: string;
  heroPrimary?: CtaButtonConfig;
  heroSecondary?: CtaButtonConfig;
  ctaSection?: CtaButtonConfig;
} {
  const result = {
    primaryText: 'Get Quote',
    secondaryText: 'Learn More',
    phoneNumber: fallbackPhone,
    heroPrimary: undefined as CtaButtonConfig | undefined,
    heroSecondary: undefined as CtaButtonConfig | undefined,
    ctaSection: undefined as CtaButtonConfig | undefined,
  };

  if (!isObject(designData)) return result;

  const templateData = isObject(designData.template) ? designData.template : designData;
  const globalCta = isObject(templateData.globalCta) ? templateData.globalCta : {};

  if (isString(globalCta.phoneNumber)) result.phoneNumber = globalCta.phoneNumber;
  if (isString(globalCta.primaryText)) result.primaryText = globalCta.primaryText;
  if (isString(globalCta.secondaryText)) result.secondaryText = globalCta.secondaryText;

  const phone = result.phoneNumber || fallbackPhone;

  result.heroPrimary = normalizeCtaButton(globalCta.heroPrimary, result.primaryText, phone);
  result.heroSecondary = normalizeCtaButton(globalCta.heroSecondary, result.secondaryText, phone);
  result.ctaSection = normalizeCtaButton(globalCta.ctaSection, result.primaryText, phone);

  return result;
}
