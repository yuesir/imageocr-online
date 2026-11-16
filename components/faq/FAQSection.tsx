'use client'

import { useId, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FAQItem {
  question: ReactNode
  answer: ReactNode
}
interface FAQSectionProps {
  title?: string
  description?: ReactNode
  eyebrow?: string
  items: FAQItem[]
  className?: string
}

/** The site's single FAQ presentation: one open item, native button keyboard
 * controls, rounded hover clipping, and a visible inset focus outline. */
export function FAQSection({ title = 'Frequently Asked Questions', description, eyebrow, items, className = '' }: FAQSectionProps) {
  const id = useId()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <section className={`editorial-section bg-card ${className}`} aria-labelledby={`${id}-title`} data-faq-section>
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          {eyebrow && <p className="eyebrow !text-accent-foreground">{eyebrow}</p>}
          <h2 id={`${id}-title`} className="text-3xl text-foreground md:text-4xl">{title}</h2>
          {description && <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">{description}</p>}
        </div>
        <div className="space-y-4">
          {items.map((item, index) => {
            const open = openIndex === index
            return (
              <div key={index} className="overflow-hidden rounded-lg border border-border bg-card" data-faq-item>
                <h3>
                  <button
                    id={`${id}-question-${index}`}
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${id}-answer-${index}`}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-start justify-between gap-4 px-6 py-4 text-left text-lg text-foreground transition-colors hover:bg-background focus-visible:!outline-offset-[-4px]"
                  >
                    <span className="min-w-0 break-words font-serif leading-relaxed">{item.question}</span>
                    <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={`${id}-answer-${index}`}
                  role="region"
                  aria-labelledby={`${id}-question-${index}`}
                  hidden={!open}
                  className="space-y-4 px-6 pb-4 text-base leading-relaxed text-muted-foreground [&_p]:my-0 [&_p]:text-base [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline"
                >
                  {item.answer}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
