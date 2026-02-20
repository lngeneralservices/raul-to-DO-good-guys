import { getContent, getContentBySlug } from '@/lib/cms-client';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/sections/Hero';
import { markdownToHtml } from '@/lib/markdown';

// Next.js 15: params is now a Promise
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { items } = await getContent({ type: 'service' });
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

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const content = await getContentBySlug(slug);
  if (!content) notFound();

  return (
    <>
      <Hero 
        headline={content.h1 ?? content.title ?? 'Our Services'}
        subheadline={content.excerpt ?? ''}
      />
      <article className="container mx-auto px-4 py-16 prose max-w-none">
        <div dangerouslySetInnerHTML={markdownToHtml(content.body_md)} />
      </article>
    </>
  );
}
