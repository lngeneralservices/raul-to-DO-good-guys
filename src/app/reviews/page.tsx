import { getProject, getTestimonials } from '@/lib/cms-client';
import { Hero } from '@/components/sections/Hero';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

export async function generateMetadata() {
  const project = await getProject();
  return {
    title: 'Reviews',
    description: "See what customers say about " + project.name,
  };
}

export default async function ReviewsPage() {
  const [project, testimonials] = await Promise.all([
    getProject(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero 
        headline="Customer Reviews"
        subheadline={"See what our customers say about " + project.name}
      />
      <section className="py-16 container mx-auto px-4">
        {testimonials && testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial: any, index: number) => (
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
                  {/* API returns author_name/author_role, but also support name/role for flexibility */}
                  <p className="font-semibold">{testimonial.author_name || testimonial.name}</p>
                  {(testimonial.author_role || testimonial.role) && (
                    <p className="text-sm text-muted">{testimonial.author_role || testimonial.role}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">No reviews yet. Check back soon!</p>
          </div>
        )}
      </section>
    </>
  );
}
