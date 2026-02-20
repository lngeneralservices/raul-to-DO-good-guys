import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  isHighlighted?: boolean;
  ctaText?: string;
}

interface PricingProps {
  title?: string;
  subtitle?: string;
  tiers: PricingTier[];
  _enabled?: boolean;
  _order?: number;
}

export function Pricing({ title = 'Pricing', subtitle, tiers }: PricingProps) {
  if (!tiers || tiers.length === 0) return null;
  
  return (
    <section className="py-[var(--spacing-section,4rem)] bg-surface">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted">{subtitle}</p>}
          </div>
        )}
        <div className={`grid gap-6 ${tiers.length === 2 ? 'md:grid-cols-2 max-w-3xl' : 'md:grid-cols-3 max-w-5xl'} mx-auto`}>
          {tiers.map((tier, index) => (
            <Card 
              key={index} 
              className={`h-full flex flex-col ${tier.isHighlighted ? 'ring-2 ring-primary' : ''}`}
            >
              {tier.isHighlighted && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium -mt-6 -mx-6 mb-4 rounded-t-[var(--border-radius,0.5rem)]">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-primary">
                  {tier.price}
                  {tier.period && <span className="text-base font-normal text-muted">/{tier.period}</span>}
                </div>
                {tier.description && <p className="text-muted mt-2">{tier.description}</p>}
              </div>
              <ul className="space-y-3 mb-6 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact">
                <Button className="w-full" variant={tier.isHighlighted ? 'default' : 'outline'}>
                  {tier.ctaText || 'Get Started'}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
