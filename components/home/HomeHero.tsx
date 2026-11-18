'use client'

import { OCRPricingInfo } from '@/components/ocr/OCRServiceInfo'
import { useState } from 'react'
import { ArrowDown, ArrowRight, Check, Copy, FileText } from 'lucide-react'

const exampleText = `RECEIPT
Archive Café
123 Paper Street

Latte         $4.50
Croissant     $3.75

Subtotal      $8.25
Tax (8.5%)    $0.70
Total         $8.95`

export function HomeHero() {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  async function copyExample() {
    try {
      await navigator.clipboard.writeText(exampleText)
      setCopied(true)
      setCopyFailed(false)
    } catch { setCopyFailed(true) }
  }
  return (
    <section className="home-hero border-b border-border bg-background" aria-labelledby="home-hero-title">
      <div className="editorial-wrap home-hero-layout">
        <div className="min-w-0">
          <p className="eyebrow !text-accent-foreground flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            Optical character recognition
          </p>
          <h1 id="home-hero-title" className="text-4xl text-foreground sm:text-5xl lg:text-6xl">
            Image to Text Converter (OCR) — Extract &amp; Transcribe Text <em className="text-primary">Instantly</em>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            Upload images, photos and get accurate text extract results instantly.{' '}
            <a href="#workbench" className="inline-flex items-center gap-2 text-sm font-medium text-accent-foreground underline underline-offset-4">
              Extract text now <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </p>
          <p className="mt-3 max-w-lg text-sm text-muted-foreground"><OCRPricingInfo /></p>
        </div>

        <figure className="home-hero-demo min-w-0" aria-label="Illustrative example of a receipt converted into editable text">
          <div className="home-hero-wash" aria-hidden="true" />
          <div className="home-hero-documents">
            <div className="home-receipt-frame">
              <div className="home-receipt bg-card text-card-foreground">
                <div className="text-center">
                  <p className="font-mono text-lg font-bold tracking-wide">RECEIPT</p>
                  <p className="mt-4 text-sm font-semibold">Archive Café</p>
                  <p className="mt-1 text-xs">123 Paper Street</p>
                </div>
                <dl className="mt-5 space-y-2 border-y border-dashed border-input py-4 text-xs">
                  <div className="flex justify-between gap-2"><dt>Latte</dt><dd>$4.50</dd></div>
                  <div className="flex justify-between gap-2"><dt>Croissant</dt><dd>$3.75</dd></div>
                </dl>
                <dl className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between gap-2"><dt>Subtotal</dt><dd>$8.25</dd></div>
                  <div className="flex justify-between gap-2"><dt>Tax (8.5%)</dt><dd>$0.70</dd></div>
                  <div className="flex justify-between gap-2 border-t border-input pt-3 font-bold"><dt>Total</dt><dd>$8.95</dd></div>
                </dl>
              </div>
            </div>
            <span className="home-hero-arrow border border-border bg-card text-primary" aria-hidden="true"><ArrowRight className="h-5 w-5" /></span>
            <div className="home-text-card border border-border bg-card text-card-foreground">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
                <div className="flex min-w-0 items-center gap-2"><FileText className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><h2 className="text-lg">Extracted text</h2></div>
                <button type="button" onClick={() => void copyExample()} className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Copy example text">
                  {copied ? <Check className="h-4 w-4 text-sage" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <pre className="mt-4 whitespace-pre-wrap font-mono text-[11px] leading-[1.8] sm:text-xs">{exampleText}</pre>
            </div>
          </div>
          <figcaption className="relative mt-5 text-center font-mono text-[10px] tracking-wide text-muted-foreground" aria-live="polite">
            {copyFailed ? 'Could not copy. Select the example text to copy it.' : copied ? 'Example text copied to clipboard.' : 'ILLUSTRATIVE EXAMPLE / IMAGE → EDITABLE TEXT'}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
