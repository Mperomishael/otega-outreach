"use client"

import { useState } from "react"
import { Copy, Check, AlertCircle } from "lucide-react"
import { useLanguage } from "@/components/language-context"
import { useRouter } from "next/navigation"

declare global {
  interface Window {
    FlutterwaveCheckout: any
  }
}

export default function DonatePage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const opayAccount = "8054317419"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(opayAccount)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const validateForm = () => {
    if (!amount || Number.parseFloat(amount) < 2000) {
      setError("Please enter a valid amount (minimum ₦2,000)")
      return false
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }
    if (!name) {
      setError("Please enter your name")
      return false
    }
    return true
  }

  const handleFlutterwavePayment = () => {
    if (!validateForm()) return

    setIsProcessing(true)
    setError("")

    try {
      window.FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-12345abcdef", // Replace with your actual Flutterwave public key
        tx_ref: "OEO-" + Date.now(),
        amount: Number.parseFloat(amount),
        currency: "NGN",
        payment_options: "card, banktransfer, ussd",
        customer: {
          email,
          phone_number: phone,
          name,
        },
        customizations: {
          title: "Otega Evangelical Outreach",
          description: "Donation to support our ministry",
          logo: "https://i.ibb.co/N2dpNgsL/photo-6021658356923614950-y.jpg",
        },
        callback: (response: any) => {
          if (response.status === "successful") {
            router.push("/thank-you?type=donation")
          } else {
            setError("Payment was not successful. Please try again.")
            setIsProcessing(false)
          }
        },
        onclose: () => {
          setIsProcessing(false)
        },
      })
    } catch (error) {
      setError("Payment initialization failed. Please try again later.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Support Our Ministry</h1>

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Left side - Image and description */}
          <div className="md:w-1/2 bg-amber-800 text-white p-6 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">Your Gift Makes a Difference</h2>
            <p className="mb-4">
              Your generous donation helps us reach rural communities across Nigeria with the Gospel of Jesus Christ.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <Check className="mr-2 mt-1 flex-shrink-0" size={18} />
                <span>Support evangelists in the field</span>
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-1 flex-shrink-0" size={18} />
                <span>Provide Bibles and discipleship materials</span>
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-1 flex-shrink-0" size={18} />
                <span>Fund outreach events in rural villages</span>
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-1 flex-shrink-0" size={18} />
                <span>Train new evangelists and church planters</span>
              </li>
            </ul>
            <p className="text-sm italic">
              "And this gospel of the kingdom will be preached in the whole world as a testimony to all nations..."
              <br />- Matthew 24:14
            </p>
          </div>

          {/* Right side - Donation form */}
          <div className="md:w-1/2 p-6">
            <h3 className="text-xl font-semibold mb-4">Make Your Donation</h3>

            {/* OPAY Account Details */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2">Direct Transfer (OPAY)</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Account Number:</p>
                  <p className="font-mono font-medium">{opayAccount}</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-2 text-amber-800 hover:bg-amber-50 rounded-full transition-colors"
                  aria-label="Copy account number"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Account Name: Otega Evangelical Outreach</p>
            </div>

            {/* Flutterwave Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Donation Amount (₦) *
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Minimum ₦2,000"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Optional"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share why you're donating or any prayer requests"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                ></textarea>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                  <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleFlutterwavePayment}
                disabled={isProcessing}
                className="w-full py-3 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors disabled:bg-gray-400"
              >
                {isProcessing ? "Processing..." : "Donate Now with Flutterwave"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
