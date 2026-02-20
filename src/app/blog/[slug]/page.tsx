import { getContent, getContentBySlug } from '@/lib/cms-client';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/sections/Hero';
import { markdownToHtml } from '@/lib/markdown';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { items } = await getContent({ type: 'blog' });
  return items?.map((item: any) => ({ slug: item.slug })) || [];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const content = await getContentBySlug(slug);
  if (!content) return {};
  return {
    title: content.meta_title || content.title,
    description: content.meta_description || content.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const content = await getContentBySlug(slug);
  if (!content) notFound();

  return (
    <>
      <Hero 
        headline={content.h1 ?? content.title ?? 'Blog Post'}
        subheadline={content.excerpt ?? ''}
        backgroundImage={content.featured_image_url ?? undefined}
      />
      <article className="container mx-auto px-4 py-16 prose max-w-3xl">
        <div dangerouslySetInnerHTML={markdownToHtml(content.body_md)} />
      </article>
    </>
  );
}
