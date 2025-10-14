import Link from 'next/link'
import { Zap, Mail, Github, Twitter } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Zap className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white dark:text-gray-100">ImageOCRAI</span>
            </Link>
            <p className="text-gray-400 dark:text-gray-500 mb-4 max-w-md">
              Advanced OCR technology for extracting text from images. Fast, accurate, and secure image-to-text conversion with support for multiple languages and document types.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:support@imageocrai.com" className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-2 text-gray-400 dark:text-gray-500 mb-4 max-w-md text-xs">ImageOCRAI is an independent tool and is not affiliated with, endorsed by, or officially connected to OpenAI, ChatGPT, Google, Anthropic, or any AI model provider. All product and company names are trademarks™ or registered® trademarks of their respective holders.</p>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-white dark:text-gray-100 font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jpg-to-text" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  JPG to Text
                </Link>
              </li>
              <li>
                <Link href="/invoices-ocr" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Invoice OCR
                </Link>
              </li>
              <li>
                <Link href="/receipts-ocr" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Receipt OCR
                </Link>
              </li>
              <li>
                <Link href="/passports-ocr" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Passport OCR
                </Link>
              </li>
              <li>
                <Link href="/ids-ocr" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  ID Card OCR
                </Link>
              </li>
              <li>
                <Link href="/drivers-licenses-ocr" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Drivers License OCR
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-white dark:text-gray-100 font-semibold mb-4"></h3>
            <ul className="space-y-2">
              <li>
                <Link href="/image-ocr-arabic" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Image OCR Arabic
                </Link>
              </li>
              <li>
                <Link href="/image-ocr-chinese" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Image OCR Chinese
                </Link>
              </li>
              <li>
                <Link href="/image-ocr-greek" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Image OCR Greek
                </Link>
              </li>
              <li>
                <Link href="/image-ocr-indian" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Image OCR Indian
                </Link>
              </li>
              <li>
                <Link href="/image-ocr-japanese" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Image OCR Japanese
                </Link>
              </li>
              <li>
                <Link href="/png-to-text" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  PNG Image to Text
                </Link>
              </li>
              <li>
                <Link href="/handwriting-to-text" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Handwriting to Text
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} ImageOCRAI. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                Terms
              </Link>
              <Link href="/cookie-policy" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                Cookies
              </Link>
              <Link href="/refund-policy" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}