import { getContentBySlug, getProject } from '@/lib/cms-client';
import { Hero } from '@/components/sections/Hero';
import { Phone, Mail, MapPin } from 'lucide-react';

export async function generateMetadata() {
  const content = await getContentBySlug('contact');
  if (!content) {
    const project = await getProject();
    return {
      title: 'Contact Us',
      description: "Contact " + project.name + " for professional services",
    };
  }
  return {
    title: content.meta_title || 'Contact Us',
    description: content.meta_description || content.excerpt,
  };
}

export default async function ContactPage() {
  const [content, project] = await Promise.all([
    getContentBySlug('contact'),
    getProject(),
  ]);

  return (
    <>
      <Hero 
        headline={content?.h1 ?? 'Contact Us'}
        subheadline={content?.excerpt ?? 'Get in touch with our team'}
      />
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-heading font-bold mb-6">Get In Touch</h2>
            <div className="space-y-4">
              {project.nap_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href={"tel:" + project.nap_phone.replace(/\D/g, '')} className="hover:text-primary">
                    {project.nap_phone}
                  </a>
                </div>
              )}
              {project.nap_email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href={"mailto:" + project.nap_email} className="hover:text-primary">
                    {project.nap_email}
                  </a>
                </div>
              )}
              {(project.nap_address || project.nap_city) && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    {project.nap_address && <p>{project.nap_address}</p>}
                    <p>{[project.nap_city, project.nap_state, project.nap_zip].filter(Boolean).join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-surface rounded-lg p-8">
            <h2 className="text-2xl font-heading font-bold mb-6">Send Us a Message</h2>
            <p className="text-muted mb-4">Add your contact form here.</p>
            <div className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border rounded-md" />
              <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border rounded-md" />
              <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-2 border rounded-md" />
              <button type="button" className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90">Send Message</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
