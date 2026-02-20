import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import type { City } from '@/lib/cms-client';

interface AreasProps {
  title?: string;
  subtitle?: string;
  description?: string;
  cities?: City[];
  _enabled?: boolean;
  _order?: number;
}

export function Areas({ 
  title = 'Service Areas', 
  subtitle, 
  description,
  cities = [],
}: AreasProps) {
  // Don't render if no cities and no description
  if (cities.length === 0 && !description) return null;
  
  return (
    <section className="py-[var(--spacing-section,4rem)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-muted">{subtitle}</p>}
          {description && <p className="text-muted mt-4 max-w-2xl mx-auto">{description}</p>}
        </div>
        {cities.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Link key={city.id} href={`/locations/${city.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" aria-hidden="true" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{city.title}</h3>
                      {city.excerpt && <p className="text-muted line-clamp-2">{city.excerpt}</p>}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link href="/locations" className="text-primary hover:underline font-medium">
            View All Service Areas →
          </Link>
        </div>
      </div>
    </section>
  );
}
