'use client';

import HeroSection from "@/components/hero-section";
import FeaturedMedia from "@/components/featured-media";
import TestimoniesSection from "@/components/testimonies-section";
import PartnersSection from "@/components/partners-section";
import HomeGallery from "@/components/home-gallery";
import { Gift, Handshake } from "lucide-react";

export default function Home() {
  return (
    <>
      <HeroSection />

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Raising Kingdom Leaders in Nigeria's Villages through Holy Spirit-powered outreach, salvation crusades, and Biblical discipleship.
            </p>
          </div>

          {/* Liquid-glass cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="liquid-glass p-8 rounded-3xl">
              <Gift className="h-8 w-8 text-amber-800 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Support Our Programs</h3>
              <p className="text-gray-600">Your donations help us reach more villages.</p>
              <button className="mt-6 bg-amber-800 text-white px-8 py-3 rounded-2xl">Donate Now</button>
            </div>
            <div className="liquid-glass p-8 rounded-3xl">
              <Handshake className="h-8 w-8 text-amber-800 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Evangelistic Partnership</h3>
              <p className="text-gray-600">Join hands to spread the Gospel.</p>
              <button className="mt-6 bg-amber-800 text-white px-8 py-3 rounded-2xl">Partner With Us</button>
            </div>
            <div className="liquid-glass p-8 rounded-3xl">
              <svg className="h-8 w-8 text-amber-800 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V7a2 2 0 0 1-2 2H3Z" />
              </svg>
              <h3 className="text-2xl font-semibold mb-2">Prayer Requests</h3>
              <p className="text-gray-600">Submit your prayer requests.</p>
              <button className="mt-6 bg-amber-800 text-white px-8 py-3 rounded-2xl">Submit Request</button>
            </div>
          </div>

          <FeaturedMedia />
          <HomeGallery />
          <TestimoniesSection />
          <PartnersSection />
        </div>
      </section>
    </>
  );
}
