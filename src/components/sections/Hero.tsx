import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Exported CTA button config - fields are optional for CMS partial configs
export interface CtaButtonConfig {
  text: string;
  linkType: 'page' | 'url' | 'phone' | 'email' | 'form';
  href?: string;
  pageSlug?: string;
  customUrl?: string;
  phoneNumber?: string;
  email?: string;
  newTab?: boolean;
}

interface HeroProps {
  headline: string;
  subheadline?: string;
  backgroundImage?: string;
  primaryButton?: CtaButtonConfig;
  secondaryButton?: CtaButtonConfig;
  phoneNumber?: string;
  _enabled?: boolean;
  _order?: number;
}

function getButtonHref(button?: CtaButtonConfig, fallbackPhone?: string): string {
  if (!button || !button.linkType) return '#';
  switch (button.linkType) {
    case 'page': return button.pageSlug ? `/${button.pageSlug}` : '#';
    case 'url': return button.customUrl || '#';
    case 'phone': return `tel:${(button.phoneNumber || fallbackPhone || '').replace(/\D/g, '')}`;
    case 'email': return `mailto:${button.email || ''}`;
    default: return '#';
  }
}

export function Hero({ 
  headline, 
  subheadline, 
  backgroundImage,
  primaryButton,
  secondaryButton,
  phoneNumber,
}: HeroProps) {
  const hasBackground = !!backgroundImage;
  
  // Only render buttons if they are explicitly configured
  const showPrimary = !!primaryButton;
  const showSecondary = !!secondaryButton;
  const primaryHref = primaryButton ? getButtonHref(primaryButton, phoneNumber) : '#';
  const secondaryHref = secondaryButton ? getButtonHref(secondaryButton, phoneNumber) : '#';
  
  return (
    <section 
      className="relative min-h-[70vh] flex items-center justify-center py-[var(--spacing-section,4rem)]"
      style={hasBackground ? { 
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : { backgroundColor: 'var(--color-surface, #f5f5f5)' }}
    >
      {/* Overlay using CSS variables from design template */}
      {hasBackground && (
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundColor: 'var(--hero-overlay-color, #000000)',
            opacity: 'var(--hero-overlay-opacity, 0.5)',
          }}
        />
      )}
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 
          className="text-4xl md:text-6xl font-heading font-bold mb-6"
          style={hasBackground ? { color: 'var(--hero-text-color, #ffffff)' } : undefined}
        >
          {headline}
        </h1>
        {subheadline && (
          <p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            style={hasBackground ? { color: 'var(--hero-text-color, #ffffff)', opacity: 0.9 } : { color: 'var(--color-text-muted)' }}
          >
            {subheadline}
          </p>
        )}
        {(showPrimary || showSecondary) && (
          <div className="flex gap-4 justify-center flex-wrap">
            {showPrimary && primaryButton && (
              <Link href={primaryHref}>
                <Button size="lg">{primaryButton.text}</Button>
              </Link>
            )}
            {showSecondary && secondaryButton && (
              <Link href={secondaryHref}>
                <Button size="lg" variant={hasBackground ? "secondary" : "outline"}>{secondaryButton.text}</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
