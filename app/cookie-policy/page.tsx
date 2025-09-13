import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">What Are Cookies</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  This Cookie Policy explains what cookies are, how we use cookies, how third-parties we may partner with may use cookies on the Service, your choices regarding cookies and further information about cookies.
                </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">How We Use Cookies</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                When you use and access ImageOCR Online, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li><strong>Essential cookies:</strong> These are necessary for the website to function properly</li>
                <li><strong>Analytics cookies:</strong> These help us understand how visitors interact with our website</li>
                <li><strong>Functionality cookies:</strong> These enable enhanced functionality and personalization</li>
                <li><strong>Performance cookies:</strong> These help us improve website performance and user experience</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">Types of Cookies We Use</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Essential Cookies</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the website, you cannot refuse them without impacting how our site functions.
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Analytics and Performance Cookies</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  These cookies collect information about how you use our website, such as which pages you visit most often and if you receive error messages. This information helps us improve how our website works and enhance user experience.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We may use Google Analytics to analyze website usage. Google Analytics uses cookies to collect information about website usage, but does not collect personal information about website visitors.
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Functionality Cookies</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  These cookies allow our website to remember choices you make (such as your preferred language or theme settings) and provide enhanced, more personal features. They may also be used to provide services you have asked for.
                </p>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service and deliver advertisements on and through the Service.
              </p>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Google Analytics</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We use Google Analytics to analyze the use of our website. Google Analytics gathers information about website use by means of cookies. The information gathered relating to our website is used to create reports about the use of our website.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You can opt out of Google Analytics by visiting the Google Analytics opt-out page: 
                  <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                    https://tools.google.com/dlpage/gaoptout
                  </a>
                </p>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">Your Cookie Choices</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You have several options for managing cookies:
              </p>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Browser Settings</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Most web browsers allow you to control cookies through their settings preferences. You can set your browser to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                  <li>Delete all cookies</li>
                  <li>Block all cookies</li>
                  <li>Allow all cookies</li>
                  <li>Block third-party cookies</li>
                  <li>Clear all cookies when you close the browser</li>
                  <li>Open a 'private browsing' / 'incognito' session</li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">Cookie Consent</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  When you first visit our website, you may see a cookie consent banner. You can choose to accept or decline non-essential cookies. Your preferences will be remembered for future visits.
                </p>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">Cookie Retention</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The length of time cookies remain on your device depends on whether they are "persistent" or "session" cookies:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li><strong>Session cookies:</strong> These are temporary and are deleted when you close your browser</li>
                <li><strong>Persistent cookies:</strong> These remain on your device until they expire or you delete them</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">Updates to This Cookie Policy</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page with a new "Last updated" date.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">More Information</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                For more information about cookies, including how to see what cookies have been set on your device and how to manage and delete them, visit:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>
                  <a href="https://www.allaboutcookies.org/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                    www.allaboutcookies.org
                  </a>
                </li>
                <li>
                  <a href="https://www.youronlinechoices.eu/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">
                    www.youronlinechoices.eu
                  </a> (for users in the EU)
                </li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have any questions about this Cookie Policy or our use of cookies, please contact us through our website or support channels.
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