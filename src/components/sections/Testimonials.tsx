import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialItem {
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
}

interface TestimonialsProps {
  title: string;
  subtitle?: string;
  items: TestimonialItem[];
  _enabled?: boolean;
  _order?: number;
}

export function Testimonials({ title, subtitle, items }: TestimonialsProps) {
  if (!items || items.length === 0) return null;
  
  return (
    <section className="py-[var(--spacing-section,4rem)] bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-muted">{subtitle}</p>}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((testimonial, index) => (
            <Card key={index} className="h-full flex flex-col">
              {testimonial.rating && testimonial.rating > 0 && (
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: Math.min(testimonial.rating, 5) }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              )}
              <p className="text-muted mb-4 flex-grow">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                {(testimonial.role || testimonial.company) && (
                  <p className="text-sm text-muted">
                    {testimonial.role}{testimonial.role && testimonial.company && ' at '}{testimonial.company}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
