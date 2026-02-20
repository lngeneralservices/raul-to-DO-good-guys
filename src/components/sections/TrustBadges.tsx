import { Award, Shield, Clock, CheckCircle } from 'lucide-react';

interface TrustBadge {
  label: string;
  description?: string;
  icon?: string;
}

interface TrustBadgesProps {
  title?: string;
  subtitle?: string;
  badges: TrustBadge[];
  _enabled?: boolean;
  _order?: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  award: Award,
  shield: Shield,
  clock: Clock,
  check: CheckCircle,
};

export function TrustBadges({ title, subtitle, badges }: TrustBadgesProps) {
  if (!badges || badges.length === 0) return null;
  
  return (
    <section className="py-[var(--spacing-section,4rem)] border-y">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold mb-2">{title}</h2>
            {subtitle && <p className="text-muted">{subtitle}</p>}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon ? iconMap[badge.icon] || Award : Award;
            return (
              <div key={index} className="flex items-center gap-3 text-center">
                <Icon className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold">{badge.label}</p>
                  {badge.description && (
                    <p className="text-sm text-muted">{badge.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
