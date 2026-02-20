import type { ComponentType } from 'react';
import { getHomeContent, getProject, getDesign, getCities, type City } from '@/lib/cms-client';
import { 
  normalizeProject, 
  normalizeSectionsContent, 
  normalizeGlobalCta,
  type SectionsContent 
} from '@/lib/normalize';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Stats } from '@/components/sections/Stats';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { Faq } from '@/components/sections/Faq';
import { Testimonials } from '@/components/sections/Testimonials';
import { Cta } from '@/components/sections/Cta';
import { TrustBadges } from '@/components/sections/TrustBadges';
import { Areas } from '@/components/sections/Areas';
import { Pricing } from '@/components/sections/Pricing';
import { CmsNotConfigured } from '@/components/sections/CmsNotConfigured';

// Section renderer map - all V2 section types
// Using ComponentType<any> to avoid strict prop checking at registry level
// Each component handles its own prop validation internally
type AnySectionComponent = ComponentType<any>;

const SECTION_COMPONENTS: Record<string, AnySectionComponent> = {
  hero: Hero,
  about: About,
  stats: Stats,
  services: Services,
  process: Process,
  faq: Faq,
  testimonials: Testimonials,
  cta: Cta,
  trustBadges: TrustBadges,
  areas: Areas,
  pricing: Pricing,
};

// Get ordered and enabled sections from sections_content
function getOrderedSections(sections: SectionsContent): Array<{ key: string; data: SectionsContent[keyof SectionsContent] }> {
  return Object.entries(sections)
    .filter(([key, section]) => {
      // Skip internal metadata keys
      if (key.startsWith('_')) return false;
      // Check if section is enabled (default: true)
      const sectionObj = section as Record<string, unknown> | undefined;
      return sectionObj?._enabled !== false;
    })
    .sort(([, a], [, b]) => {
      const aObj = a as Record<string, unknown> | undefined;
      const bObj = b as Record<string, unknown> | undefined;
      const orderA = (aObj?._order as number) ?? 999;
      const orderB = (bObj?._order as number) ?? 999;
      return orderA - orderB;
    })
    .map(([key, data]) => ({ key, data }));
}

export default async function HomePage() {
  let rawProject, homepage, design;
  let cities: City[] = [];
  
  try {
    [rawProject, homepage, design] = await Promise.all([
      getProject(),
      getHomeContent(),
      getDesign(),
    ]);
    
    // Normalize sections content with defensive defaults
    const sections = normalizeSectionsContent(homepage?.sections_content);
    const areasSection = sections.areas;
    if (areasSection && areasSection._enabled !== false) {
      cities = await getCities(6);
    }
  } catch (error) {
    console.error('Failed to fetch CMS data:', error);
    return <CmsNotConfigured />;
  }

  // Normalize project data with defensive defaults
  const project = normalizeProject(rawProject);

  // Show CMS not configured message if no project data
  if (!project.name || project.name === 'My Website') {
    return <CmsNotConfigured />;
  }

  // Normalize sections content
  const sections = normalizeSectionsContent(homepage?.sections_content);
  const orderedSections = getOrderedSections(sections);
  
  // Get globalCta from design template - normalized with safe defaults
  const globalCta = normalizeGlobalCta(design, project.nap_phone);
  const phoneNumber = globalCta.phoneNumber || project.nap_phone;
  
  // Get featured image for hero background
  const heroSection = sections.hero;
  const heroBackgroundImage = heroSection?.backgroundImage || 
                               heroSection?.image || 
                               homepage?.featured_image_url;

  // Fallback if no sections_content - show basic hero with normalized CTA buttons
  if (orderedSections.length === 0) {
    return (
      <Hero 
        headline={homepage?.h1 ?? project.name ?? 'Welcome'}
        subheadline={homepage?.excerpt ?? ("Welcome to " + (project.name ?? 'Our Site'))}
        backgroundImage={heroBackgroundImage ?? undefined}
        primaryButton={globalCta.heroPrimary}
        secondaryButton={globalCta.heroSecondary}
        phoneNumber={phoneNumber}
      />
    );
  }

  return (
    <>
      {orderedSections.map(({ key, data }) => {
        const Component = SECTION_COMPONENTS[key];
        if (!Component) {
          // Development warning for unknown section types
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Unknown section type: ${key}`);
          }
          return null;
        }
        
        // Render each section with properly typed props
        if (key === 'hero') {
          const heroData = sections.hero;
          return (
            <Hero
              key={key}
              headline={heroData?.headline || homepage?.h1 || project.name || 'Welcome'}
              subheadline={heroData?.subheadline || homepage?.excerpt}
              backgroundImage={heroData?.backgroundImage || heroData?.image || homepage?.featured_image_url}
              primaryButton={globalCta.heroPrimary}
              secondaryButton={globalCta.heroSecondary}
              phoneNumber={phoneNumber}
            />
          );
        }
        
        if (key === 'cta') {
          return <Cta key={key} {...data} ctaButton={globalCta.ctaSection} phoneNumber={phoneNumber} />;
        }
        
        if (key === 'areas') {
          return <Areas key={key} {...data} cities={cities} />;
        }
        
        // For other sections, pass data directly (they don't need CTA normalization)
        return <Component key={key} {...data} />;
      })}
    </>
  );
}
