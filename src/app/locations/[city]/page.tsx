import { getContent, getContentBySlug } from '@/lib/cms-client';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/sections/Hero';
import { markdownToHtml } from '@/lib/markdown';

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  const { items } = await getContent({ type: 'city' });
  return items?.map((item: any) => ({ city: item.slug })) || [];
}

export async function generateMetadata({ params }: PageProps) {
  const { city } = await params;
  const content = await getContentBySlug(city);
  if (!content) return {};
  return {
    title: content.meta_title || content.title,
    description: content.meta_description || content.excerpt,
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { city } = await params;
  const content = await getContentBySlug(city);
  if (!content) notFound();

  return (
    <>
      <Hero 
        headline={content.h1 ?? content.title ?? 'Service Area'}
        subheadline={content.excerpt ?? ''}
      />
      <article className="container mx-auto px-4 py-16 prose max-w-none">
        <div dangerouslySetInnerHTML={markdownToHtml(content.body_md)} />
      </article>
    </>
  );
}
