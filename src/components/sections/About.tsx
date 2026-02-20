import { markdownToHtml } from '@/lib/markdown';

interface AboutProps {
  title: string;
  subtitle?: string;
  content_md: string;
  _enabled?: boolean;
  _order?: number;
}

export function About({ title, subtitle, content_md }: AboutProps) {
  return (
    <section className="py-[var(--spacing-section,4rem)] bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-muted">{subtitle}</p>}
        </div>
        <div 
          className="prose max-w-3xl mx-auto"
          dangerouslySetInnerHTML={markdownToHtml(content_md)}
        />
      </div>
    </section>
  );
}
