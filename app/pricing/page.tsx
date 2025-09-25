import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Pricing - ImageOCR Online',
  description: 'Choose the perfect plan for your OCR needs. Extract text from images with our powerful AI technology.',
}

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out our OCR technology',
    features: [
      '10 images per day',
      'Basic OCR accuracy',
      'Standard processing speed',
      'Email support',
      'Basic file formats (JPG, PNG)'
    ],
    cta: 'Get Started Free',
    popular: false,
    buttonVariant: 'outline' as const
  },
  {
    name: 'Monthly Pro',
    price: '$10',
    period: 'per month',
    description: 'Ideal for regular users and small businesses',
    features: [
      '1,000 images per month',
      'Advanced OCR accuracy',
      'Priority processing',
      'Priority email support',
      'All file formats supported',
      'Batch processing',
      'API access',
      'Export to multiple formats'
    ],
    cta: 'Start Monthly Plan',
    popular: true,
    buttonVariant: 'default' as const
  },
  {
    name: 'Annual Pro',
    price: '$99',
    period: 'per year',
    originalPrice: '$120',
    description: 'Best value for power users and enterprises',
    features: [
      '15,000 images per year',
      'Highest OCR accuracy',
      'Fastest processing speed',
      '24/7 priority support',
      'All file formats supported',
      'Advanced batch processing',
      'Full API access',
      'Custom integrations',
      'Analytics dashboard',
      'Team collaboration tools'
    ],
    cta: 'Save with Annual',
    popular: false,
    buttonVariant: 'default' as const,
    savings: 'Save $21'
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Unlock the full potential of AI-powered OCR technology. Extract text from images with 
            unmatched accuracy and speed. Start free, upgrade when you need more.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium">
            <Check className="w-4 h-4" />
            No setup fees • Cancel anytime • 30-day money-back guarantee
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, _index) => (
            <div
              key={tier.name}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                tier.popular 
                  ? 'border-blue-500 dark:border-blue-400' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              {tier.savings && (
                <div className="absolute -top-3 -right-3">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {tier.savings}
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {tier.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {tier.period}
                    </span>
                  </div>
                  {tier.originalPrice && (
                    <div className="mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        {tier.originalPrice}/year
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' 
                      : ''
                  }`}
                  variant={tier.buttonVariant}
                  size="lg"
                >
                  {tier.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can upgrade, downgrade, or cancel your subscription at any time. 
                Changes take effect immediately.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                What file formats do you support?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We support all major image formats including JPG, PNG, PDF, TIFF, BMP, 
                and many more. Pro plans include advanced format support.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Is there a money-back guarantee?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely! We offer a 30-day money-back guarantee on all paid plans. 
                No questions asked.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Do you offer enterprise solutions?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! Contact us for custom enterprise solutions with dedicated support, 
                custom integrations, and volume discounts.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who trust ImageOCR for their text extraction needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
              Contact Sales
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}