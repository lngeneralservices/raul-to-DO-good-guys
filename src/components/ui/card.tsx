import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface p-6 rounded-[var(--border-radius,0.5rem)] shadow-[var(--shadow,0_1px_3px_rgba(0,0,0,0.1))]',
        className
      )}
    >
      {children}
    </div>
  );
}
