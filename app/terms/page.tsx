import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background ">
      <Header />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card  rounded-lg shadow-tactile p-8">
          
          <h1 className="text-4xl font-bold text-foreground  mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground  mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground  mb-4">
                By accessing and using ImageOCR Online ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground  mb-4">
                ImageOCR Online provides optical character recognition (OCR) services that allow users to extract text from images. The service supports multiple languages and document types including business cards, IDs, invoices, and general text recognition.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground  mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground  mb-4">
                <li>Ensuring you have the right to upload and process the images you submit</li>
                <li>Not uploading content that violates any laws or regulations</li>
                <li>Not uploading malicious files or content that could harm our systems</li>
                <li>Respecting the privacy and rights of others in any content you upload</li>
                <li>Using the service in accordance with these terms and applicable laws</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">4. Privacy and Data Protection</h2>
              <p className="text-muted-foreground  mb-4">
                We take your privacy seriously. Images uploaded to our service are processed for OCR purposes only. We do not store your images permanently on our servers, and they are automatically deleted after processing. For detailed information about how we handle your data, please refer to our Privacy Policy.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">5. Prohibited Uses</h2>
              <p className="text-muted-foreground  mb-4">
                You may not use our service:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground  mb-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">6. Service Availability</h2>
              <p className="text-muted-foreground  mb-4">
                We strive to maintain high availability of our service, but we do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or technical issues. We reserve the right to modify, suspend, or discontinue the service at any time without prior notice.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground  mb-4">
                In no event shall ImageOCR Online, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">8. Accuracy of OCR Results</h2>
              <p className="text-muted-foreground  mb-4">
                While we strive to provide accurate OCR results, we cannot guarantee 100% accuracy. The quality of results depends on various factors including image quality, text clarity, and language complexity. Users should verify the accuracy of extracted text for their specific use cases.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">9. Intellectual Property</h2>
              <p className="text-muted-foreground  mb-4">
                The service and its original content, features, and functionality are and will remain the exclusive property of ImageOCR Online and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">10. Termination</h2>
              <p className="text-muted-foreground  mb-4">
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will cease immediately.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground  mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">12. Governing Law</h2>
              <p className="text-muted-foreground  mb-4">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which our company is registered, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">13. Contact Information</h2>
              <p className="text-muted-foreground  mb-4">
                If you have any questions about these Terms of Service, please contact us through our website or support channels.
              </p>
            </section>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}