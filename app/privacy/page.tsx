import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy | ImageOCR Online',
    description: 'Privacy Policy for ImageOCR Online - Learn how we collect, use, and protect your personal information.',
    keywords: 'privacy policy, data protection, GDPR, personal information, cookies',
  }
}

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-background ">
      <Header />
      <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card  shadow-tactile rounded-lg p-8">
          <h1 className="text-4xl font-bold text-foreground  mb-8">Privacy Policy</h1>
          
          <div className="text-sm text-muted-foreground  mb-8">
            <p><strong>Last Updated:</strong> {lastUpdated}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">1. Introduction</h2>
              <p className="text-muted-foreground  leading-relaxed mb-4">
                Welcome to ImageOCR Online. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our optical character recognition (OCR) services.
              </p>
              <p className="text-muted-foreground  leading-relaxed">
                By using our service, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-foreground  mb-3">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 text-muted-foreground  mb-4">
                <li>Account information from Google sign-in (email address, display name, profile photo)</li>
                <li>Profile information (name, preferences)</li>
                <li>Images and documents you upload for OCR processing</li>
                <li>Communication data when you contact us</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground  mb-3">2.2 Information Automatically Collected</h3>
              <ul className="list-disc pl-6 text-muted-foreground  mb-4">
                <li>Usage data (pages visited, features used, time spent)</li>
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Log data (access times, error logs, performance metrics)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground  mb-3">2.3 Third-Party Information</h3>
              <p className="text-muted-foreground  leading-relaxed">
                We may receive information about you from third-party services you choose to connect with our platform, such as social media login providers or cloud storage services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground  leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground  mb-4">
                <li><strong>Service Provision:</strong> To provide, maintain, and improve our OCR services</li>
                <li><strong>Processing:</strong> To process your uploaded images and extract text content</li>
                <li><strong>Account Management:</strong> To create and manage your user account</li>
                <li><strong>Communication:</strong> To send you service-related notifications and updates</li>
                <li><strong>Analytics:</strong> To analyze usage patterns and improve our services</li>
                <li><strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                <li><strong>Marketing:</strong> To send promotional materials (with your consent)</li>
              </ul>
            </section>

            <section id="ocr-data" className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">4. Data Processing and Storage</h2>
              
              <h3 className="text-xl font-medium text-foreground  mb-3">4.1 Image Processing</h3>
              <p className="text-muted-foreground  leading-relaxed mb-4">
                Tools such as passport and driver’s license OCR submit images directly for recognition. We send images to cloud OCR providers, including Alibaba Cloud and Tencent Cloud, to extract text. The file upload workflow on the OCR Processing page saves original images in Supabase Storage when you upload while signed in. OCR results from saved files can also be stored in your account history.
              </p>

              <h3 className="text-xl font-medium text-foreground  mb-3">4.2 Data Retention</h3>
              <ul className="list-disc pl-6 text-muted-foreground  mb-4">
                <li>We retain successful OCR responses, including extracted text, for both guests and signed-in users so a retry of the same request can return the original result.</li>
                <li>Images saved through the file upload workflow and retained OCR results have no fixed automatic deletion period. You can delete entries from your account history in the dashboard. To request deletion of stored images or other OCR data, contact privacy@imageocrai.com.</li>
                <li>Account information is retained until account deletion</li>
                <li>Log data is retained for up to 12 months for security and analytics purposes</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground  mb-3">4.3 Data Security</h3>
              <p className="text-muted-foreground  leading-relaxed">
                We implement industry-standard security measures including encryption in transit and at rest, secure server infrastructure, regular security audits, and access controls to protect your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">5. Third-Party Services</h2>
              <p className="text-muted-foreground  leading-relaxed mb-4">
                Our service integrates with the following third-party providers:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground  mb-4">
                <li><strong>Google Analytics:</strong> For website analytics and usage tracking</li>
                <li><strong>Tencent Cloud OCR:</strong> For advanced OCR processing capabilities</li>
                <li><strong>Alibaba Cloud:</strong> For cloud OCR processing</li>
                <li><strong>Supabase:</strong> For database, file storage, and authentication services</li>
              </ul>
              <p className="text-muted-foreground  leading-relaxed">
                These third parties have their own privacy policies governing their use of your information. We encourage you to review their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">6. Your Rights and Choices</h2>
              <p className="text-muted-foreground  leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              
              <h3 className="text-xl font-medium text-foreground  mb-3">6.1 GDPR Rights (EU Residents)</h3>
              <ul className="list-disc pl-6 text-muted-foreground  mb-4">
                <li><strong>Right of Access:</strong> Request copies of your personal data</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
                <li><strong>Right to Object:</strong> Object to certain types of processing</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground  mb-3">6.2 CCPA Rights (California Residents)</h3>
              <ul className="list-disc pl-6 text-muted-foreground  mb-4">
                <li>Right to know what personal information is collected</li>
                <li>Right to delete personal information</li>
                <li>Right to opt-out of the sale of personal information</li>
                <li>Right to non-discrimination for exercising privacy rights</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground  mb-3">6.3 Exercising Your Rights</h3>
              <p className="text-muted-foreground  leading-relaxed">
                To exercise any of these rights, please contact us using the information provided in the Contact Us section. We will respond to your request within the timeframes required by applicable law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground  mb-4">7. Contact Us</h2>
              <p className="text-muted-foreground  leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-background  p-6 rounded-lg">
                <p className="text-muted-foreground  mb-2"><strong>Email:</strong> privacy@imageocrai.com</p>
              </div>
              <p className="text-muted-foreground  leading-relaxed mt-4">
                We will respond to your inquiry within 30 days of receipt.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              This Privacy Policy is effective as of {lastUpdated} and was last updated on the same date.
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}