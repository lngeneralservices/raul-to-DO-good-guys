import { Briefcase, Clock, Star, Users, Award, Check, Trophy, Target } from 'lucide-react';

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
  icon?: 'briefcase' | 'clock' | 'star' | 'users' | 'award' | 'check' | 'trophy' | 'target';
}

interface StatsProps {
  title?: string;
  subtitle?: string;
  items: StatItem[];
  _enabled?: boolean;
  _order?: number;
}

const iconMap = {
  briefcase: Briefcase,
  clock: Clock,
  star: Star,
  users: Users,
  award: Award,
  check: Check,
  trophy: Trophy,
  target: Target,
};

export function Stats({ title, subtitle, items }: StatsProps) {
  if (!items || items.length === 0) return null;
  
  return (
    <section className="py-[var(--spacing-section,4rem)] bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg opacity-80">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((stat, index) => {
            const Icon = stat.icon ? iconMap[stat.icon] : null;
            return (
              <div key={index} className="text-center">
                {Icon && <Icon className="w-8 h-8 mx-auto mb-2 opacity-80" />}
                <div className="text-4xl font-bold mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
