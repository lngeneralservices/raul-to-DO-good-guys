import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CtaButtonConfig {
  text: string;
  linkType: 'page' | 'url' | 'phone' | 'email';
  pageSlug?: string;
  customUrl?: string;
  phoneNumber?: string;
  email?: string;
}

interface CtaProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  secondaryButtonText?: string;
  ctaButton?: CtaButtonConfig;
  phoneNumber?: string;
  _enabled?: boolean;
  _order?: number;
}

function getButtonHref(button?: CtaButtonConfig, fallbackPhone?: string): string {
  if (!button) return '#';
  switch (button.linkType) {
    case 'page': return button.pageSlug ? `/${button.pageSlug}` : '#';
    case 'url': return button.customUrl || '#';
    case 'phone': return `tel:${(button.phoneNumber || fallbackPhone || '').replace(/\D/g, '')}`;
    case 'email': return `mailto:${button.email || ''}`;
    default: return '#';
  }
}

export function Cta({ title, subtitle, buttonText, secondaryButtonText, ctaButton, phoneNumber }: CtaProps) {
  // Use structured ctaButton if available, otherwise fall back to buttonText
  const primaryText = ctaButton?.text || buttonText;
  const primaryHref = ctaButton ? getButtonHref(ctaButton, phoneNumber) : '/contact';
  const showPhone = secondaryButtonText && phoneNumber;
  
  return (
    <section className="py-[var(--spacing-section,4rem)] bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{title}</h2>
        {subtitle && <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">{subtitle}</p>}
        <div className="flex gap-4 justify-center flex-wrap">
          {primaryText && (
            <Link href={primaryHref}>
              <Button size="lg" variant="secondary">{primaryText}</Button>
            </Link>
          )}
          {showPhone && (
            <Link href={`tel:${phoneNumber.replace(/\D/g, '')}`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                {secondaryButtonText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
