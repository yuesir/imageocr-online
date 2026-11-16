import Link from 'next/link'
import { Zap, Mail, Github, Twitter } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#141413]  text-[#C9C2B4] ">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Zap className="h-8 w-8 text-[#E77B5C]" />
              <span className="text-2xl font-bold text-white ">ImageOCRAI</span>
            </Link>
            <p className="text-[#C9C2B4]  mb-4 max-w-md">
              Advanced OCR technology for extracting text from images. Fast, accurate, and secure image-to-text conversion with support for multiple languages and document types.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#C9C2B4]  hover:text-[#E77B5C]  transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#C9C2B4]  hover:text-[#E77B5C]  transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:support@imageocrai.com" className="text-[#C9C2B4]  hover:text-[#E77B5C]  transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-2 text-[#C9C2B4]  mb-4 max-w-md text-xs">ImageOCRAI is an independent tool and is not affiliated with, endorsed by, or officially connected to OpenAI, ChatGPT, Google, Anthropic, or any AI model provider. All product and company names are trademarks™ or registered® trademarks of their respective holders.</p>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-white  font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jpg-to-text" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  JPG to Text
                </Link>
              </li>
              <li>
                <Link href="/invoices-ocr" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  Invoice OCR
                </Link>
              </li>
              <li>
                <Link href="/receipts-ocr" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  Receipt OCR
                </Link>
              </li>
              <li>
                <Link href="/passports-ocr" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  Passport OCR
                </Link>
              </li>
              <li>
                <Link href="/ids-ocr" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  ID Card OCR
                </Link>
              </li>
              <li>
                <Link href="/drivers-licenses-ocr" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  Drivers License OCR
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-white  font-semibold mb-4">More tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/image-ocr-arabic" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  Image OCR Arabic
                </Link>
              </li>
              <li>
                <Link href="/image-ocr-chinese" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  Image OCR Chinese
                </Link>
              </li>
              <li>
                <Link href="/image-ocr-greek" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  Image OCR Greek
                </Link>
              </li>
              <li>
                <Link href="/image-ocr-indian" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  Image OCR Indian
                </Link>
              </li>
              <li>
                <Link href="/image-ocr-japanese" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  Image OCR Japanese
                </Link>
              </li>
              <li>
                <Link href="/png-to-text" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  PNG Image to Text
                </Link>
              </li>
              <li>
                <Link href="/handwriting-to-text" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                  Handwriting to Text
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border  mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#C9C2B4]  text-sm mb-4 md:mb-0">
              © {currentYear} ImageOCRAI. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                Terms
              </Link>
              <Link href="/cookie-policy" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                Cookies
              </Link>
              <Link href="/refund-policy" className="text-[#C9C2B4]  hover:text-white  transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}