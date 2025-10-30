import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: 'Refund Policy - ImageOCR Online',
  description: 'Comprehensive refund policy for ImageOCR Online services, including eligibility criteria, processing timelines, and payment processor requirements.',
}

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">Refund Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">1. Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                At ImageOCR Online, we strive to provide high-quality OCR services. This refund policy outlines the terms and conditions under which refunds may be requested and processed. All payments are processed through our secure payment partners Stripe and Creem, and this policy complies with their respective requirements and regulations.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">2. Refund Eligibility Criteria</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You may be eligible for a refund under the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li><strong>Service Unavailability:</strong> If our OCR service is unavailable for more than 24 consecutive hours due to technical issues on our end</li>
                <li><strong>Billing Errors:</strong> If you were charged incorrectly due to a system error or duplicate transaction</li>
                <li><strong>Unused Credits:</strong> For subscription plans, unused credits may be eligible for pro-rated refunds within 30 days of purchase</li>
                <li><strong>Technical Failures:</strong> If the OCR service consistently fails to process your images due to system errors (not image quality issues)</li>
                <li><strong>Unauthorized Charges:</strong> If charges were made without your authorization</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Non-Refundable Situations</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Refunds will NOT be provided in the following cases:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Dissatisfaction with OCR accuracy due to poor image quality or unsupported formats</li>
                <li>Change of mind after successful service delivery</li>
                <li>Credits that have been fully utilized</li>
                <li>Violation of our Terms of Service</li>
                <li>Requests made more than 30 days after the original purchase date</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">3. Processing Timelines</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our refund processing timelines vary depending on the payment method and circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li><strong>Credit/Debit Cards (Stripe):</strong> 5-10 business days after approval</li>
                <li><strong>Digital Wallets (Creem):</strong> 3-7 business days after approval</li>
                <li><strong>Bank Transfers:</strong> 7-14 business days after approval</li>
                <li><strong>Review Process:</strong> All refund requests are reviewed within 2-3 business days</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>Note:</strong> Processing times may vary depending on your bank or financial institution. International transactions may take additional time.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">4. Fees and Restrictions</h2>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Processing Fees</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Refunds for amounts under $10 may be subject to a $2 processing fee</li>
                <li>International refunds may incur currency conversion fees charged by your bank</li>
                <li>Partial refunds for unused credits will be calculated on a pro-rated basis</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Restrictions</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Maximum of one refund request per transaction</li>
                <li>Refunds must be requested within 30 days of the original purchase</li>
                <li>Promotional or discounted purchases may only be eligible for partial refunds</li>
                <li>Bulk purchase refunds are evaluated on a case-by-case basis</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">5. How to Request a Refund</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Contact our support team through our website contact form or email</li>
                <li>Provide your transaction ID or order number</li>
                <li>Clearly explain the reason for your refund request</li>
                <li>Include any relevant documentation or screenshots</li>
                <li>Allow 2-3 business days for our team to review your request</li>
              </ol>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>Required Information:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Full name and email address associated with the account</li>
                <li>Transaction date and amount</li>
                <li>Payment method used</li>
                <li>Detailed description of the issue</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">6. Payment Processor Disclosures</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Stripe Compliance</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Payments processed through Stripe are subject to Stripe's Terms of Service and Privacy Policy. Stripe may retain transaction data as required by law and their data retention policies. For disputes related to Stripe transactions, you may also contact Stripe directly through their dispute resolution process.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Creem Compliance</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Payments processed through Creem are governed by Creem's terms and conditions. Creem provides additional consumer protection for digital wallet transactions. Refunds processed through Creem may be subject to their specific refund policies and timelines.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Chargeback Policy</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Before initiating a chargeback with your bank or credit card company, please contact us directly to resolve any issues. Chargebacks can result in additional fees and may affect your ability to use our services in the future. We are committed to working with you to resolve any legitimate concerns.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">7. Subscription Refunds</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                For subscription-based services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Monthly subscriptions can be cancelled at any time with no refund for the current billing period</li>
                <li>Annual subscriptions may be eligible for pro-rated refunds if cancelled within 30 days</li>
                <li>Unused credits from cancelled subscriptions expire immediately upon cancellation</li>
                <li>Refunds will be processed to the original payment method</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">8. Dispute Resolution</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you disagree with our refund decision, you may:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Request a review by our senior support team</li>
                <li>Provide additional documentation to support your case</li>
                <li>Contact your payment processor directly for transaction disputes</li>
                <li>Seek resolution through applicable consumer protection agencies</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">9. Legal Compliance</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This refund policy complies with applicable consumer protection laws and regulations. Your statutory rights as a consumer are not affected by this policy. In jurisdictions where additional consumer protections apply, those protections take precedence over any conflicting terms in this policy.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">10. Policy Updates</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We reserve the right to update this refund policy at any time. Material changes will be communicated to users via email or through our website. Continued use of our services after policy updates constitutes acceptance of the revised terms.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                For refund requests or questions about this policy, please contact us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li><strong>Email:</strong> support@imageocr-online.com</li>
                <li><strong>Response Time:</strong> Within 24-48 hours</li>
                <li><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (UTC)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Please include "Refund Request" in your email subject line for faster processing.
              </p>
            </section>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-8">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Important Notice:</strong> This refund policy is designed to be fair to both our customers and our business. We encourage you to review our Terms of Service and Privacy Policy for additional information about our services. If you have any questions about eligibility or the refund process, please don't hesitate to contact our support team before making a purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}