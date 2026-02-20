import { getContent } from '@/lib/cms-client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default async function ServicesPage() {
  const { items } = await getContent({ type: 'service' });

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-heading font-bold mb-8">Our Services</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((service: any) => (
          <Link key={service.id} href={`/services/${service.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
              <p className="text-muted">{service.excerpt}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
