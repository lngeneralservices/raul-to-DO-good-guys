interface ProcessStep {
  title: string;
  description: string;
}

interface ProcessProps {
  title?: string;
  subtitle?: string;
  steps: ProcessStep[];
  _enabled?: boolean;
  _order?: number;
}

export function Process({ title, subtitle, steps }: ProcessProps) {
  if (!steps || steps.length === 0) return null;
  
  return (
    <section className="py-[var(--spacing-section,4rem)] bg-surface">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted">{subtitle}</p>}
          </div>
        )}
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 mb-8 last:mb-0">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
