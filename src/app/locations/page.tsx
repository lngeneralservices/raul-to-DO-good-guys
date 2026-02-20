import { getContent, getProject } from '@/lib/cms-client';
import { Hero } from '@/components/sections/Hero';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export async function generateMetadata() {
  const project = await getProject();
  return {
    title: 'Service Areas',
    description: "Explore the areas we serve at " + project.name,
  };
}

export default async function LocationsPage() {
  const [{ items: cities }, project] = await Promise.all([
    getContent({ type: 'city' }),
    getProject(),
  ]);

  return (
    <>
      <Hero 
        headline="Service Areas"
        subheadline="Explore the communities we proudly serve"
      />
      <section className="py-16 container mx-auto px-4">
        {cities && cities.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city: any) => (
              <Link key={city.id} href={"/locations/" + city.slug}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h2 className="text-xl font-semibold mb-2">{city.title}</h2>
                      <p className="text-muted line-clamp-2">{city.excerpt}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">Service area pages coming soon.</p>
          </div>
        )}
      </section>
    </>
  );
}
