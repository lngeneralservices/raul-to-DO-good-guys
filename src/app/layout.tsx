import type { Metadata } from 'next';
import { getProject, getContent } from '@/lib/cms-client';
import { normalizeProject, normalizeFooterConfig, normalizeHeaderConfig } from '@/lib/normalize';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const rawProject = await getProject();
  const project = normalizeProject(rawProject);
  return {
    title: {
      default: project.name || 'My Website',
      template: `%s | ${project.name || 'My Website'}`,
    },
    description: `${project.name || 'My Website'} - ${project.primary_category || 'Professional Services'}`,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Single fetch - extract configs from project (no redundant API calls)
  const [rawProject, servicesResult] = await Promise.all([
    getProject(),
    getContent({ type: 'service' }),
  ]);
  
  // Normalize project data with defensive defaults
  const project = normalizeProject(rawProject);
  
  // Type-safe config extraction via normalizers - never throws
  const headerConfig = normalizeHeaderConfig(project.header_config);
  const footerConfig = normalizeFooterConfig(project.footer_config);
  
  // Map quickLinksModule.links to navItems (url -> href)
  // Using normalized data - links is always an array or undefined
  const navItems = footerConfig.quickLinksModule?.links?.map((l) => ({
    label: l.label,
    href: l.url,
  })) ?? footerConfig.quickLinks ?? [];
  
  // Map services to serviceLinks for footer
  const serviceLinks = servicesResult.items?.slice(0, 6).map((s: { title?: string; slug: string }) => ({
    label: s.title ?? s.slug,
    href: `/services/${s.slug}`,
  })) ?? [];
  
  // Extract email from footer_config
  const email = footerConfig.email;

  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-body antialiased">
        <Header 
          project={project} 
          config={{ 
            ...headerConfig, 
            navItems,
            phoneNumber: project.nap_phone,
          }} 
        />
        <main className="min-h-[80vh]">{children}</main>
        <Footer 
          project={{ ...project, nap_email: email }} 
          config={{ 
            ...footerConfig, 
            serviceLinks,
            // Map quickLinksModule.links to quickLinks (url -> href)
            quickLinks: footerConfig.quickLinksModule?.links?.map((l) => ({
              label: l.label,
              href: l.url,
            })) ?? footerConfig.quickLinks ?? [],
          }} 
        />
      </body>
    </html>
  );
}
