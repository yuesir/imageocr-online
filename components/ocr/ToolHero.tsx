import type { LucideIcon } from 'lucide-react'

interface ToolHeroProps {
  title: string
  description: string
  label: string
  icon: LucideIcon
}

/** Shared editorial introduction for OCR tool pages, in both paper themes. */
export function ToolHero({ title, description, label, icon: Icon }: ToolHeroProps) {
  return (
    <section className="editorial-section border-b border-border bg-background text-foreground" data-tool-hero>
      <div className="editorial-wrap grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
        <div className="min-w-0">
          <p className="eyebrow !text-accent-foreground flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {label}
          </p>
          <h1 className="break-words text-4xl font-normal tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </div>
        <div className="min-w-0">
          <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 text-xs text-secondary-foreground" aria-label="Tool capabilities">
            {['Image to text', 'Batch recognition', 'Copy & download'].map(feature => (
              <li key={feature} className="rounded-md border border-border bg-secondary px-3 py-2">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
