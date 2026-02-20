'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone } from 'lucide-react';

interface HeaderConfig {
  logoUrl?: string;
  showCta?: boolean;
  ctaText?: string;
  ctaLink?: string;
  ctaType?: 'phone' | 'page' | 'url';
  phoneNumber?: string;
  navItems?: Array<{ label: string; href: string }>;
}

interface Project {
  name: string;
  logo_url?: string;
  nap_phone?: string;
}

interface HeaderProps {
  project: Project;
  config?: HeaderConfig;
}

const DEFAULT_NAV = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Locations', href: '/locations' },
  { label: 'Contact', href: '/contact' },
];

export function Header({ project, config }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const logoUrl = config?.logoUrl || project.logo_url;
  const navItems = config?.navItems || DEFAULT_NAV;
  const showCta = config?.showCta !== false;
  const ctaText = config?.ctaText || 'Call Now';
  const phoneNumber = config?.phoneNumber || project.nap_phone;
  const ctaHref = config?.ctaType === 'phone' && phoneNumber 
    ? 'tel:' + phoneNumber.replace(/\D/g, '')
    : config?.ctaLink || '/contact';

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt={project.name} className="h-8 w-auto" />
          ) : (
            <span className="text-xl font-heading font-bold text-primary">{project.name}</span>
          )}
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {showCta && (
            <Link href={ctaHref}>
              <Button size="sm">
                {config?.ctaType === 'phone' && <Phone className="w-4 h-4 mr-2" />}
                {ctaText}
              </Button>
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-foreground/80 hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {showCta && (
              <Link href={ctaHref} onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">
                  {config?.ctaType === 'phone' && <Phone className="w-4 h-4 mr-2" />}
                  {ctaText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
