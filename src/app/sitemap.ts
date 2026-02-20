import { getSitemap } from '@/lib/cms-client';
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let dynamicPages: MetadataRoute.Sitemap = [];
  
  try {
    const { urls } = await getSitemap();
    dynamicPages = (urls || []).map((item: any) => ({
      url: `${BASE_URL}/${item.slug}`,
      lastModified: new Date(item.updated_at),
      changeFrequency: item.type === 'blog' ? 'weekly' as const : 'monthly' as const,
      priority: item.type === 'page' ? 1.0 : item.type === 'service' ? 0.8 : 0.6,
    }));
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
  }
  
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/locations`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), priority: 0.7 },
  ];
  
  return [...staticPages, ...dynamicPages];
}
