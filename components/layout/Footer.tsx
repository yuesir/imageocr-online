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
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-white dark:text-gray-100 font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Image OCR
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Business Card OCR
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Invoice OCR
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  ID Card OCR
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Receipt OCR
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-white dark:text-gray-100 font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors">
                  Cookie Policy
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}