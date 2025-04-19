import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Otega Evangelical Outreach</h3>
            <p className="mb-4">Raising Kingdom Leaders in Nigeria's Villages – Deuteronomy 28:13</p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-white" aria-label="Facebook">
                <Facebook />
              </Link>
              <Link href="https://twitter.com" className="hover:text-white" aria-label="Twitter">
                <Twitter />
              </Link>
              <Link href="https://instagram.com" className="hover:text-white" aria-label="Instagram">
                <Instagram />
              </Link>
              <Link href="https://youtube.com" className="hover:text-white" aria-label="YouTube">
                <Youtube />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/evangelists" className="hover:text-white">
                  Our Evangelist
                </Link>
              </li>
              <li>
                <Link href="/testimonies" className="hover:text-white">
                  Testimonies
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-white">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Our Ministries</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ministries/salvation-crusades" className="hover:text-white">
                  Salvation Crusades
                </Link>
              </li>
              <li>
                <Link href="/ministries/church-planting" className="hover:text-white">
                  Rural Church Planting
                </Link>
              </li>
              <li>
                <Link href="/ministries/leadership" className="hover:text-white">
                  Leadership Development
                </Link>
              </li>
              <li>
                <Link href="/ministries/community" className="hover:text-white">
                  Community Development
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Rural Revival Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="not-italic space-y-2">
              <p>Headquarters: Abuja, Nigeria</p>
              <p>Serving All 36 States</p>
              <p className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+2348131003708" className="hover:text-white">
                  +234 813 100 3708
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:otegaevangelicaloutreach@gmail.com" className="hover:text-white">
                  otegaevangelicaloutreach@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Otega Evangelical Outreach. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/privacy-policy" className="hover:text-white mx-2">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white mx-2">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
