'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
  _enabled?: boolean;
  _order?: number;
}

export function Faq({ title, subtitle, items }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  if (!items || items.length === 0) return null;
  
  return (
    <section className="py-[var(--spacing-section,4rem)]">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{title}</h2>
            {subtitle && <p className="text-lg text-muted">{subtitle}</p>}
          </div>
        )}
        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, index) => (
            <div key={index} className="border rounded-[var(--border-radius,0.5rem)] overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-surface"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold">{item.question}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-surface border-t">
                  <p className="text-muted">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
