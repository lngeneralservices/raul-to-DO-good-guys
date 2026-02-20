import { Card } from '@/components/ui/card';

interface ServiceItem {
  name: string;
  description: string;
}

interface ServicesProps {
  title: string;
  subtitle?: string;
  items: ServiceItem[];
  _enabled?: boolean;
  _order?: number;
}

export function Services({ title, subtitle, items }: ServicesProps) {
  if (!items || items.length === 0) return null;
  
  return (
    <section className="py-[var(--spacing-section,4rem)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-muted">{subtitle}</p>}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((service, index) => (
            <Card key={index} className="h-full">
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-muted">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
