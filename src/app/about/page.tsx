import { getContentBySlug, getProject } from '@/lib/cms-client';
import type { SectionsContent } from '@/types/content';
import { Hero } from '@/components/sections/Hero';
import { markdownToHtml } from '@/lib/markdown';

export async function generateMetadata() {
  const content = await getContentBySlug('about');
  if (!content) {
    const project = await getProject();
    return {
      title: 'About Us',
      description: "Learn more about " + project.name,
    };
  }
  return {
    title: content.meta_title || 'About Us',
    description: content.meta_description || content.excerpt,
  };
}

export default async function AboutPage() {
  const [content, project] = await Promise.all([
    getContentBySlug('about'),
    getProject(),
  ]);

  if (!content) {
    return (
      <>
        <Hero 
          headline={"About " + project.name}
          subheadline="Learn more about our company and team"
        />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted">About page content coming soon.</p>
        </div>
      </>
    );
  }

  const sections = (content.sections_content ?? {}) as SectionsContent;
  const aboutSection = sections.about;

  return (
    <>
      <Hero 
        headline={content.h1 ?? content.title ?? 'About Us'}
        subheadline={content.excerpt ?? ''}
      />
      {aboutSection ? (
        <section className="py-16 container mx-auto px-4">
          <div className="prose max-w-3xl mx-auto" dangerouslySetInnerHTML={markdownToHtml((aboutSection?.content_md ?? content.body_md) || '')} />
        </section>
      ) : content.body_md && (
        <section className="py-16 container mx-auto px-4">
          <div className="prose max-w-3xl mx-auto" dangerouslySetInnerHTML={markdownToHtml(content.body_md)} />
        </section>
      )}
    </>
  );
}
