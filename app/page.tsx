import { FAQSection } from '@/components/faq/FAQSection'
import Link from 'next/link'
import { HomeHero } from '@/components/home/HomeHero'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { InteractiveOCR } from '@/components/ocr/InteractiveOCR'

const tools = [
  ['01 / FINANCIAL DOCUMENTS', 'Invoices & Receipts', 'Extract invoice details and receipt text for your everyday bookkeeping.', '/invoices-ocr'],
  ['02 / IMAGE TO TEXT', 'Screenshots, Books & Slides', 'Turn scanned pages and everyday images into editable, searchable text.', '/jpg-to-text'],
  ['03 / MULTILINGUAL SCRIPTS', 'Arabic, CJK, Greek & More', 'Explore dedicated tools for documents across languages and writing systems.', '/image-ocr-chinese'],
  ['04 / HANDWRITTEN ARCHIVES', 'Notes Worth Keeping', 'Bring handwritten notes and personal archives into your digital workflow.', '/handwriting-to-text'],
  ['05 / DOCUMENT EXTRACTION', 'Cards & Identity Documents', 'Dedicated extraction workflows for business cards and identity documents.', '/business-cards-ocr'],
  ['06 / BATCH WORKBENCH', 'A Whole Stack, Digitized', 'Upload multiple images together, review the results, and copy your text.', '/ocr'],
]
const faqs = [
  ['What is image OCR?', 'Optical Character Recognition detects text in images and converts it into editable digital text. Use it with photographs, scanned pages, receipts, and screenshots.'],
  ['How do I convert an image to text?', 'Upload an image, start recognition, then review and copy or download the extracted text. Clear, well-lit images produce better results.'],
  ['Can I process multiple images?', 'Yes. Select up to 10 images in the workbench and process them together. Each image must be within the upload size limit.'],
  ['Which languages are supported?', 'The workbench handles multilingual text. Dedicated pages offer workflows for Arabic, Chinese, Greek, Indian languages, and Japanese.'],
]
export default function HomePage() {
  return <div className="min-h-screen bg-background">
    <Header />
    <main>
      <HomeHero />
      <section className="editorial-wrap px-5 py-12 md:py-20" aria-label="Optical workbench">
        <div id="workbench"><InteractiveOCR /></div><div className="ruler" />
      </section>
      <section className="editorial-section" id="tools"><div className="editorial-wrap">
        <p className="eyebrow">Index of extraction tools</p><h2 className="text-3xl md:text-4xl mb-9">Specialized Optical Pipelines</h2>
        <div className="grid md:grid-cols-3 gap-4">{tools.map(([label,title,body,url])=><Link href={url} key={url} className="editorial-card group hover:border-primary transition-colors"><p className="eyebrow">{label}</p><h3 className="text-2xl mb-3">{title}</h3><p className="text-sm text-muted-foreground mb-6">{body}</p><span className="workbench-label border-t block pt-4 group-hover:text-primary">Open tool ↗</span></Link>)}</div>
      </div></section>
      <section className="editorial-section bg-secondary/40" id="workflow"><div className="editorial-wrap">
        <p className="eyebrow">Three-stage optical pipeline</p><h2 className="text-3xl md:text-4xl mb-10">From Raw Pixels to Editable Text</h2>
        <div className="grid md:grid-cols-3 gap-6">{[['01 / INGEST','Upload or Drop Specimens','Select a single image or a batch of JPG, PNG, WebP, BMP, or TIFF files.','INPUT: UP TO 10 IMAGES'],['02 / RECOGNIZE','Extract the Written Word','Start recognition and let the OCR engine transform your images into editable text.','PROCESS: IMAGE → TEXT'],['03 / EXPORT','Inspect, Refine & Download','Review your extracted text, copy it to the clipboard, or download it for your records.','OUTPUT: EDITABLE TEXT']].map(([n,t,b,f])=><article className="editorial-card" key={n}><p className="eyebrow border-b pb-4">{n}</p><h3 className="text-2xl mb-3">{t}</h3><p className="text-sm text-muted-foreground mb-8">{b}</p><p className="workbench-label bg-secondary p-3 rounded">{f}</p></article>)}</div>
      </div></section>
      <section className="editorial-section"><div className="editorial-wrap">
        <p className="eyebrow">Built for your document workflow</p><h2 className="text-3xl md:text-4xl mb-10">Careful Extraction. Clear Results.</h2>
        <div className="grid md:grid-cols-2 gap-6"><article className="editorial-card"><p className="eyebrow">01 / DOCUMENT INTELLIGENCE</p><h3 className="text-3xl mb-4">Bring Your Paper Archive Into Focus</h3><p className="text-muted-foreground">From business receipts to research notes, choose the extraction tool that fits your document. Review results before bringing them into your records.</p></article><article className="editorial-card !bg-[#141413] !text-[#F6F4EF]"><p className="eyebrow">02 / YOUR WORKSPACE</p><h3 className="text-3xl mb-4">A Practical Tool for Everyday Documents</h3><p className="text-[#C9C2B4]">Keep your workflow simple: upload, recognize, review, and export. Manage your account and image allowance in one place.</p><Link href="/privacy" className="workbench-label inline-block mt-6 !text-[#F6F4EF] underline">Read our privacy policy ↗</Link></article></div>
      </div></section>
      <FAQSection eyebrow="Technical documentation & FAQ" items={faqs.map(([question, answer]) => ({ question, answer: <p>{answer}</p> }))} />
      <section className="bg-[#141413] text-[#F6F4EF] py-14 px-6"><div className="editorial-wrap flex flex-col md:flex-row gap-8 justify-between items-start md:items-center"><div><p className="eyebrow">Ready to digitize</p><h2 className="text-3xl">Your next document, made editable.</h2></div><Link href="#workbench" className="bg-primary text-white rounded-md px-6 py-3 text-sm">Open Optical Workbench ↗</Link></div></section>
    </main><Footer />
  </div>
}
