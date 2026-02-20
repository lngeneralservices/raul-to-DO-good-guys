// lib/cms-client.ts
// Server-only module - do not import in client components
import 'server-only';

// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================

// Support both CONTENT_* and CMS_* variable names for flexibility
const CONTENT_API_URL =
  process.env.CONTENT_API_URL ||
  process.env.CMS_API_URL ||
  'https://YOUR_PROJECT.supabase.co/functions/v1/public-content';
const CONTENT_PROJECT_SLUG = process.env.CONTENT_PROJECT_SLUG || process.env.CMS_PROJECT_SLUG || '';
const CONTENT_API_KEY = process.env.CONTENT_API_KEY || process.env.CMS_API_KEY || '';

// Module-level flag to prevent repeated config warnings
let configWarningShown = false;

/**
 * Validates CMS configuration and returns status
 * Logs warning only once per process lifecycle
 */
function validateConfig(): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!CONTENT_PROJECT_SLUG) missing.push('CONTENT_PROJECT_SLUG (or CMS_PROJECT_SLUG)');
  if (!CONTENT_API_KEY) missing.push('CONTENT_API_KEY (or CMS_API_KEY)');
  
  if (missing.length > 0 && !configWarningShown) {
    configWarningShown = true;
    console.warn('[CMS] Missing config: ' + missing.join(', ') + '. Using fallback data.');
  }
  
  return { ok: missing.length === 0, missing };
}

/**
 * Builds the API base URL, avoiding /v1 and slug duplication
 * 
 * Examples:
 * - Input: "https://api.example.com/public-content", slug: "abc" → ".../public-content/v1/abc"
 * - Input: "https://api.example.com/public-content/v1", slug: "abc" → ".../public-content/v1/abc"
 * - Input: "https://api.example.com/public-content/v1/abc", slug: "abc" → ".../public-content/v1/abc"
 */
function buildApiBase(): string {
  if (!CONTENT_PROJECT_SLUG) return '';
  
  // Normalize: remove trailing slashes
  let base = CONTENT_API_URL.replace(/\/+$/, '');
  
  // Check if the URL already ends with the project slug (with or without /v1/)
  // Example: ".../public-content/v1/my-slug" with slug="my-slug" → strip and rebuild
  const slugPattern = new RegExp('(/v1)?/' + CONTENT_PROJECT_SLUG + '/?$', 'i');
  if (slugPattern.test(base)) {
    base = base.replace(slugPattern, '');
    return base + '/v1/' + CONTENT_PROJECT_SLUG;
  }
  
  // Check if /v1 is present at the end (without slug)
  // Example: ".../public-content/v1" → add slug
  if (/\/v1\/?$/i.test(base)) {
    base = base.replace(/\/v1\/?$/i, '');
    return base + '/v1/' + CONTENT_PROJECT_SLUG;
  }
  
  // No /v1 and no slug - add both
  // Example: ".../public-content" → ".../public-content/v1/slug"
  return base + '/v1/' + CONTENT_PROJECT_SLUG;
}

const API_BASE = buildApiBase();

// ============================================
// TYPE DEFINITIONS
// ============================================

// Import types from centralized location
// Re-export for convenience so consumers can import from cms-client
export type {
  SectionBase,
  HeroSection,
  AboutSection,
  StatsSection,
  StatItem,
  ServicesSection,
  ServiceItem,
  ProcessSection,
  ProcessStep,
  FaqSection,
  FaqItem,
  TestimonialsSection,
  TestimonialItem,
  CtaSection,
  TrustBadgesSection,
  TrustBadge,
  AreasSection,
  PricingSection,
  PricingTier,
  SectionsContent,
  PageContent,
  City,
  Project,
  QuickLink,
  HeaderConfig,
  FooterConfig,
} from '@/types/content';

import type { PageContent, Project, SectionsContent, City, HeaderConfig, FooterConfig } from '@/types/content';

export interface ContentFilters {
  type?: string;
  slug?: string;
  city?: string;
  service?: string;
  limit?: number;
}

export type ContentListResponse<T = PageContent> = { items: T[] };

// ============================================
// FALLBACK DATA
// ============================================

const FALLBACK_PROJECT: Project = {
  name: 'My Website',
  slug: 'my-website',
  primary_category: 'Professional Services',
};

const FALLBACK_CONTENT: ContentListResponse<unknown> = { items: [] };

// ============================================
// CACHE TAGS
// ============================================
// Tag naming convention for revalidation:
//   - project         → Project/site config
//   - design          → Active design template
//   - content:list    → All content lists
//   - content:list:<type>  → Content list filtered by type (e.g., content:list:service)
//   - content:<type>:<slug> → Single content item by type+slug
//   - content:slug:<slug>   → Single content item by slug only (fallback)
//   - sitemap         → Sitemap data
//   - testimonials    → Testimonials list
//   - team            → Team members list

// ============================================
// CORE FETCH HELPER
// ============================================

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

/**
 * Centralized fetch with error handling, headers, caching, and cache tags
 * Tags enable granular revalidation via revalidateTag()
 */
async function cmsFetch<T>(
  path: string, 
  options: FetchOptions = {}
): Promise<T | null> {
  const { ok } = validateConfig();
  if (!ok || !API_BASE) return null;
  
  const { revalidate = 60, tags } = options;
  
  try {
    // Build Next.js cache options
    // Tags are supported in Next.js 13.4+ - gracefully handle if not available
    const nextOptions: { revalidate: number; tags?: string[] } = { revalidate };
    if (tags && tags.length > 0) {
      nextOptions.tags = tags;
    }
    
    const res = await fetch(API_BASE + path, {
      headers: { 
        'x-api-key': CONTENT_API_KEY,
        'Content-Type': 'application/json',
      },
      next: nextOptions,
    });
    
    if (!res.ok) {
      console.error('[CMS] Fetch failed: ' + path + ' (status: ' + res.status + ')');
      return null;
    }
    
    return await res.json() as T;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[CMS] Fetch error: ' + path + ' - ' + msg);
    return null;
  }
}

// ============================================
// PUBLIC API FUNCTIONS
// ============================================

/**
 * Fetch content items with optional filters
 * Tags: content:list, content:list:<type>
 */
export async function getContent<T = PageContent>(
  filters: ContentFilters = {}
): Promise<ContentListResponse<T>> {
  const { ok } = validateConfig();
  if (!ok) return FALLBACK_CONTENT as ContentListResponse<T>;
  
  const params = new URLSearchParams();
  if (filters.type) params.set('type', filters.type);
  if (filters.slug) params.set('slug', filters.slug);
  if (filters.city) params.set('city', filters.city);
  if (filters.service) params.set('service', filters.service);
  
  const queryString = params.toString();
  const path = '/content' + (queryString ? '?' + queryString : '');
  
  // Build tags based on filters
  const tags: string[] = ['content:list'];
  if (filters.type) {
    tags.push('content:list:' + filters.type);
  }
  // If fetching by slug, add slug-specific tags
  if (filters.slug) {
    if (filters.type) {
      tags.push('content:' + filters.type + ':' + filters.slug);
    }
    tags.push('content:slug:' + filters.slug);
  }
  
  const result = await cmsFetch<ContentListResponse<T>>(path, { tags });
  return result || (FALLBACK_CONTENT as ContentListResponse<T>);
}

/**
 * Fetch a single content item by slug
 * Tags: content:slug:<slug>
 */
export async function getContentBySlug<T = PageContent>(slug: string): Promise<T | null> {
  const result = await getContent<T>({ slug });
  return result.items?.[0] || null;
}

/**
 * Fetch the home page content (type: 'page', slug: 'home')
 * Tags: content:page:home, content:slug:home
 * Falls back to slug: '' for legacy compatibility
 */
export async function getHomeContent(): Promise<PageContent | null> {
  // Try slug: 'home' first
  const homeResult = await getContent<PageContent>({ type: 'page', slug: 'home' });
  if (homeResult.items?.[0]) {
    return homeResult.items[0];
  }
  
  // Fallback: try empty slug for legacy setups
  const fallbackResult = await getContent<PageContent>({ type: 'page', slug: '' });
  return fallbackResult.items?.[0] || null;
}

/**
 * Fetch cities for the Areas section
 * Tags: content:list, content:list:city
 */
export async function getCities(limit = 6): Promise<City[]> {
  const result = await getContent<City>({ type: 'city' });
  return (result.items || []).slice(0, limit);
}

/**
 * Fetch project/site configuration
 * Tags: project
 */
export async function getProject(): Promise<Project> {
  const result = await cmsFetch<Project>('/project', { 
    revalidate: 300,
    tags: ['project'],
  });
  return result || FALLBACK_PROJECT;
}

/**
 * Fetch active design template
 * Tags: design
 */
export async function getDesign(): Promise<Record<string, unknown> | null> {
  return await cmsFetch<Record<string, unknown>>('/design', { 
    revalidate: 300,
    tags: ['design'],
  });
}

// NOTE: getHeaderConfig() and getFooterConfig() removed.
// Use normalizeHeaderConfig(project.header_config) and normalizeFooterConfig(project.footer_config)
// from '@/lib/normalize' instead. These normalizers provide type-safe defaults.

/**
 * Fetch testimonials from dedicated endpoint
 * Tags: testimonials
 */
export async function getTestimonials(): Promise<Array<Record<string, unknown>>> {
  const result = await cmsFetch<{ items: Array<Record<string, unknown>> }>('/testimonials', { 
    revalidate: 300,
    tags: ['testimonials'],
  });
  return result?.items || [];
}

/**
 * Fetch team members from dedicated endpoint
 * Tags: team
 */
export async function getTeam(): Promise<Array<Record<string, unknown>>> {
  const result = await cmsFetch<{ items: Array<Record<string, unknown>> }>('/team', { 
    revalidate: 300,
    tags: ['team'],
  });
  return result?.items || [];
}

/**
 * Fetch sitemap data for all published content
 * Tags: sitemap
 */
export async function getSitemap(): Promise<{ urls: Array<{ slug: string; updated_at: string; type: string }> }> {
  const result = await cmsFetch<{ urls: Array<{ slug: string; updated_at: string; type: string }> }>('/sitemap', { 
    revalidate: 3600,
    tags: ['sitemap'],
  });
  return result || { urls: [] };
}

// ============================================
// GEOGRAPHY API (Global Data)
// ============================================

export interface GeographyFilters {
  state?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface GeographyCity {
  id: string;
  name: string;
  state: string | null;
  county: string | null;
  lat: number | null;
  lng: number | null;
  population: number | null;
  place_type: string;
  metro: string | null;
}

export interface GeographyCounty {
  id: string;
  name: string;
  state: string;
  fips_code: string | null;
  population: number | null;
  city_count: number | null;
}

export interface GeographyMetro {
  id: string;
  name: string;
  state: string | null;
  cbsa_type: string | null;
  counties: string[] | null;
}

export interface GeographyCbsa {
  id: string;
  cbsa_code: string;
  title: string;
  cbsa_type: string;
  principal_city: string | null;
}

export interface GeographyResponse<T> {
  items: T[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
    has_more: boolean;
  };
}

export interface GeographyStats {
  cities: number;
  counties: number;
  metros: number;
  cbsa: number;
}

/**
 * Fetch global geography data (cities, counties, metros, CBSAs)
 * This data is shared across all projects
 */
export async function getGeography<T = GeographyCity>(
  type: 'cities' | 'counties' | 'metros' | 'cbsa',
  filters: GeographyFilters = {}
): Promise<GeographyResponse<T>> {
  const { ok } = validateConfig();
  if (!ok) return { items: [], pagination: { limit: 100, offset: 0, count: 0, has_more: false } };
  
  const params = new URLSearchParams({ type });
  if (filters.state) params.set('state', filters.state);
  if (filters.search) params.set('search', filters.search);
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.offset) params.set('offset', String(filters.offset));
  
  const result = await cmsFetch<GeographyResponse<T>>(
    '/geography?' + params.toString(),
    { revalidate: 3600 } // Cache for 1 hour
  );
  return result || { items: [], pagination: { limit: 100, offset: 0, count: 0, has_more: false } };
}

/**
 * Fetch cities from global geography
 */
export async function getGeographyCities(filters: GeographyFilters = {}): Promise<GeographyCity[]> {
  const result = await getGeography<GeographyCity>('cities', filters);
  return result.items;
}

/**
 * Fetch counties from global geography
 */
export async function getGeographyCounties(filters: GeographyFilters = {}): Promise<GeographyCounty[]> {
  const result = await getGeography<GeographyCounty>('counties', filters);
  return result.items;
}

/**
 * Fetch metros from global geography
 */
export async function getGeographyMetros(filters: GeographyFilters = {}): Promise<GeographyMetro[]> {
  const result = await getGeography<GeographyMetro>('metros', filters);
  return result.items;
}

/**
 * Fetch CBSAs from global geography
 */
export async function getGeographyCbsas(filters: GeographyFilters = {}): Promise<GeographyCbsa[]> {
  const result = await getGeography<GeographyCbsa>('cbsa', filters);
  return result.items;
}

/**
 * Fetch geography statistics (counts of all geographic entities)
 */
export async function getGeographyStats(): Promise<GeographyStats> {
  const result = await cmsFetch<GeographyStats>('/geography-stats', { revalidate: 3600 });
  return result || { cities: 0, counties: 0, metros: 0, cbsa: 0 };
}
