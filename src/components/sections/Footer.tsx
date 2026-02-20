import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

interface FooterConfig {
  showLogo?: boolean;
  tagline?: string;
  showQuickLinks?: boolean;
  showServices?: boolean;
  showContact?: boolean;
  quickLinks?: Array<{ label: string; href: string }>;
  serviceLinks?: Array<{ label: string; href: string }>;
  copyrightText?: string;
}

interface Project {
  name: string;
  logo_url?: string;
  nap_name?: string;
  nap_phone?: string;
  nap_email?: string;
  nap_address?: string;
  nap_city?: string;
  nap_state?: string;
  nap_zip?: string;
}

interface FooterProps {
  project: Project;
  config?: FooterConfig;
}

const DEFAULT_QUICK_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Service Areas', href: '/locations' },
];

export function Footer({ project, config }: FooterProps) {
  const showLogo = config?.showLogo !== false;
  const tagline = config?.tagline || 'Professional services you can trust.';
  const quickLinks = config?.quickLinks || DEFAULT_QUICK_LINKS;
  const showQuickLinks = config?.showQuickLinks !== false;
  const showContact = config?.showContact !== false;
  const copyrightText = config?.copyrightText || '© ' + new Date().getFullYear() + ' ' + project.name + '. All rights reserved.';

  const hasAddress = project.nap_address || project.nap_city;
  const fullAddress = [
    project.nap_address,
    [project.nap_city, project.nap_state, project.nap_zip].filter(Boolean).join(', ')
  ].filter(Boolean).join(', ');

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            {showLogo && (
              <div className="mb-4">
                {project.logo_url ? (
                  <img src={project.logo_url} alt={project.name} className="h-8 w-auto brightness-0 invert" />
                ) : (
                  <span className="text-xl font-heading font-bold">{project.name}</span>
                )}
              </div>
            )}
            <p className="text-background/70 text-sm">{tagline}</p>
          </div>

          {/* Quick Links */}
          {showQuickLinks && (
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          {config?.serviceLinks && config.serviceLinks.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {config.serviceLinks.slice(0, 5).map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          {showContact && (
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                {project.nap_phone && (
                  <li className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-background/70" />
                    <a 
                      href={"tel:" + project.nap_phone.replace(/\D/g, '')}
                      className="text-background/70 hover:text-background transition-colors"
                    >
                      {project.nap_phone}
                    </a>
                  </li>
                )}
                {project.nap_email && (
                  <li className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-background/70" />
                    <a 
                      href={"mailto:" + project.nap_email}
                      className="text-background/70 hover:text-background transition-colors"
                    >
                      {project.nap_email}
                    </a>
                  </li>
                )}
                {hasAddress && (
                  <li className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-background/70 mt-0.5" />
                    <span className="text-background/70">{fullAddress}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-background/10 text-center text-sm text-background/50">
          {copyrightText}
        </div>
      </div>
    </footer>
  );
}
