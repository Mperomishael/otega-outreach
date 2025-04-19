import HeroSection from "@/components/hero-section"
import FeaturedMedia from "@/components/featured-media"
import TestimoniesSection from "@/components/testimonies-section"
import PartnersSection from "@/components/partners-section"
import HomeGallery from "@/components/home-gallery"
import { Gift, Handshake } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <HeroSection />
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Raising Kingdom Leaders in Nigeria's Villages through Holy Spirit-powered outreach, salvation crusades,
              and Biblical discipleship programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="bg-amber-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-amber-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support Our Programs</h3>
              <p className="text-gray-600 mb-4">
                Your generous donations help us reach more villages and transform more lives across Nigeria.
              </p>
              <Link
                href="/donate"
                className="inline-block bg-amber-800 text-white px-4 py-2 rounded-md hover:bg-amber-900 transition-colors"
              >
                Donate Now
              </Link>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-8 w-8 text-amber-800" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Evangelical Partnership</h3>
              <p className="text-gray-600 mb-4">
                Join hands with us to spread the Gospel and empower rural churches across Nigeria.
              </p>
              <Link
                href="/partners"
                className="inline-block bg-amber-800 text-white px-4 py-2 rounded-md hover:bg-amber-900 transition-colors"
              >
                Partner With Us
              </Link>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-8 w-8 text-amber-800"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Prayer Requests</h3>
              <p className="text-gray-600 mb-4">
                Submit your prayer requests and our team of intercessors will stand with you in faith.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-amber-800 text-white px-4 py-2 rounded-md hover:bg-amber-900 transition-colors"
              >
                Submit Request
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FeaturedMedia />
      <HomeGallery />
      <TestimoniesSection />
      <PartnersSection />
    </>
  )
}
