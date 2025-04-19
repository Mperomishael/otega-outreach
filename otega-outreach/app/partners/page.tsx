"use client"

import Link from "next/link"
import { Heart, Users, Globe, Copy, Check } from "lucide-react"
import { useLanguage } from "@/components/language-context"
import { useState, useRef } from "react"
import DonationForm from "@/components/donation-form"

export default function PartnersPage() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const accountNumberRef = useRef<HTMLSpanElement>(null)

  const copyAccountNumber = () => {
    if (accountNumberRef.current) {
      const accountNumber = accountNumberRef.current.innerText
      navigator.clipboard.writeText(accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">{t("partners")}</h1>
      <p className="text-center text-gray-700 mb-8">Partnering for Spiritual Revival Across Nigeria</p>

      <div className="text-center mb-12 p-8 bg-amber-50 rounded-lg">
        <p className="italic text-lg">Partner organizations will be displayed here from the admin dashboard.</p>
      </div>

      {/* Donation Section */}
      <div className="my-16">
        <h2 className="text-2xl font-bold text-center mb-8">Support Our Ministry</h2>

        <div className="bg-amber-50 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4">Help Us Reach More Souls in Rural Areas</h3>
              <p className="mb-4">Your support enables us to bring the Gospel to the most remote villages in Nigeria</p>
            </div>
            <div className="w-full md:w-1/3">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">2025 Goal:</span>
                  <span className="text-amber-800 font-bold">63% Funded</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div className="bg-amber-800 h-4 rounded-full" style={{ width: "63%" }}></div>
                </div>
                <p className="text-sm text-gray-600">₦3,150,000 of ₦5,000,000 goal</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-amber-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Heart className="mr-2 text-amber-800" /> Why Your Support Matters
            </h3>
            <p className="mb-4">
              Your generous donation helps us bring Biblical discipleship and Holy Spirit-powered outreach to the most
              remote villages across Nigeria. Together, we can transform rural communities through the power of the
              Gospel.
            </p>
            <div className="space-y-4 mt-6">
              <div className="flex items-start">
                <Users className="mr-3 text-amber-800 flex-shrink-0 mt-1" />
                <p>Train rural pastors in Biblical discipleship methods</p>
              </div>
              <div className="flex items-start">
                <Globe className="mr-3 text-amber-800 flex-shrink-0 mt-1" />
                <p>Expand our outreach to more villages across all 36 Nigerian states</p>
              </div>
              <div className="flex items-start">
                <Heart className="mr-3 text-amber-800 flex-shrink-0 mt-1" />
                <p>Provide resources for sustainable church growth in rural communities</p>
              </div>
            </div>

            {/* Bank Account Details */}
            <div className="mt-8 p-4 bg-white rounded-lg border border-amber-200">
              <h4 className="font-bold mb-2">Direct Bank Transfer</h4>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Account Name:</span> OTEGA EUGENE EGBOYA
                </p>
                <div className="flex items-center justify-between">
                  <p>
                    <span className="font-medium">Account Number:</span>{" "}
                    <span ref={accountNumberRef} className="font-mono">
                      8054317419
                    </span>
                  </p>
                  <button
                    onClick={copyAccountNumber}
                    className="p-1.5 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors"
                    aria-label="Copy account number"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p>
                  <span className="font-medium">Bank:</span> OPAY (PAYCOM)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <DonationForm />
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Become a Partner</h2>
        <p className="mb-6">
          Join us in bringing Biblical discipleship and Holy Spirit-powered outreach to rural Nigerian communities.
          Together, we can create lasting Kingdom impact across Nigeria.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white bg-amber-800 rounded-md hover:bg-amber-900 transition-colors"
        >
          {t("partnerWithUs")}
        </Link>
      </div>
    </div>
  )
}
