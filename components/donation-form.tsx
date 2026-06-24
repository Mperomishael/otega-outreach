"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Copy, Check, CreditCard, Building, AlertCircle } from "lucide-react"
import { addDocument, COLLECTIONS } from "@/lib/firebase-service"
import CircularLoader from "@/components/ui/circular-loader"

interface DonationFormProps {
  className?: string
}

export default function DonationForm({ className }: DonationFormProps) {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "flutterwave">("bank")
  const [currency, setCurrency] = useState<"NGN" | "USD" | "EUR">("NGN")
  const [amount, setAmount] = useState<number>(2000)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const accountNumberRef = useRef<HTMLSpanElement>(null)

  const handleAmountSelect = (value: number) => {
    setAmount(value)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setCustomAmount(value)
    if (value) {
      setAmount(Number.parseInt(value))
    } else {
      setAmount(0)
    }
  }

  const copyAccountNumber = () => {
    if (accountNumberRef.current) {
      const accountNumber = accountNumberRef.current.innerText
      navigator.clipboard.writeText(accountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (amount < 2000) {
      setError("Minimum donation amount is ₦2,000")
      return
    }

    if (paymentMethod === "bank") {
      try {
        setLoading(true)
        setError("")

        // Record the donation in Firestore
        await addDocument(COLLECTIONS.DONATIONS, {
          name,
          email,
          phone,
          amount,
          currency,
          message,
          paymentMethod: "bank_transfer",
          status: "pending",
          createdAt: new Date(),
        })

        // Redirect to thank you page
        router.push("/thank-you")
      } catch (err) {
        console.error("Error recording donation:", err)
        setError("Failed to process your donation. Please try again.")
      } finally {
        setLoading(false)
      }
    } else {
      // Flutterwave integration
      try {
        setLoading(true)
        setError("")

        // Record the donation intent in Firestore
        const donationRef = await addDocument(COLLECTIONS.DONATIONS, {
          name,
          email,
          phone,
          amount,
          currency,
          message,
          paymentMethod: "flutterwave",
          status: "initiated",
          createdAt: new Date(),
        })

        // Initialize Flutterwave
        if (typeof window !== "undefined" && window.FlutterwaveCheckout) {
          window.FlutterwaveCheckout({
            public_key: "FLWPUBK-030389f1ed30fe03d109060051d21888-X",
            tx_ref: `OEO-${Date.now()}-${donationRef.id}`,
            amount,
            currency,
            payment_options: "card,banktransfer",
            customer: {
              email,
              phone_number: phone,
              name,
            },
            customizations: {
              title: "Otega Evangelical Outreach",
              description: "Donation to support our ministry",
              logo: "https://otegaevangelicaloutreach.org/logo.png",
            },
            callback: async (response: any) => {
              // Update the donation record with payment details
              try {
                await addDocument(COLLECTIONS.DONATIONS, {
                  id: donationRef.id,
                  transactionId: response.transaction_id,
                  status: response.status === "successful" ? "completed" : "failed",
                  paymentDetails: response,
                  updatedAt: new Date(),
                })

                // Redirect to thank you page
                router.push("/thank-you")
              } catch (updateErr) {
                console.error("Error updating donation record:", updateErr)
              }
            },
            onclose: () => {
              setLoading(false)
            },
          })
        } else {
          throw new Error("Flutterwave not available")
        }
      } catch (err) {
        console.error("Error processing Flutterwave payment:", err)
        setError("Failed to initialize payment. Please try again or use bank transfer.")
        setLoading(false)
      }
    }
  }

  const currencySymbol = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
  }

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      <h3 className="text-xl font-bold mb-4 text-center">Make a Donation</h3>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle size={18} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`flex items-center justify-center gap-2 p-3 rounded-md border ${
                  paymentMethod === "bank"
                    ? "border-amber-800 bg-amber-50 text-amber-800"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setPaymentMethod("bank")}
              >
                <Building size={18} />
                <span>Bank Transfer</span>
              </button>
              <button
                type="button"
                className={`flex items-center justify-center gap-2 p-3 rounded-md border ${
                  paymentMethod === "flutterwave"
                    ? "border-amber-800 bg-amber-50 text-amber-800"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setPaymentMethod("flutterwave")}
              >
                <CreditCard size={18} />
                <span>Card Payment</span>
              </button>
            </div>
          </div>

          {paymentMethod === "bank" && (
            <div className="bg-amber-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Bank Transfer Details</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Account Name:</span> OTEGA EUGENE EGBOYA
                </p>
                <p className="flex items-center justify-between">
                  <span>
                    <span className="font-medium">Account Number:</span> <span ref={accountNumberRef}>8054317419</span>
                  </span>
                  <button
                    type="button"
                    onClick={copyAccountNumber}
                    className="p-1 text-amber-800 hover:text-amber-900"
                    aria-label="Copy account number"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </p>
                <p>
                  <span className="font-medium">Bank Name:</span> OPAY (PAYCOM)
                </p>
              </div>
              <p className="mt-3 text-xs text-gray-600">
                Please include your name as reference when making the transfer.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className={`p-2 rounded-md border ${
                  currency === "NGN"
                    ? "border-amber-800 bg-amber-50 text-amber-800"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setCurrency("NGN")}
              >
                Naira (₦)
              </button>
              <button
                type="button"
                className={`p-2 rounded-md border ${
                  currency === "USD"
                    ? "border-amber-800 bg-amber-50 text-amber-800"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setCurrency("USD")}
              >
                US Dollar ($)
              </button>
              <button
                type="button"
                className={`p-2 rounded-md border ${
                  currency === "EUR"
                    ? "border-amber-800 bg-amber-50 text-amber-800"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => setCurrency("EUR")}
              >
                Euro (€)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Donation Amount</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                type="button"
                className={`p-2 rounded-md border ${
                  amount === 2000 && !customAmount
                    ? "border-amber-800 bg-amber-50 text-amber-800"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleAmountSelect(2000)}
              >
                {currencySymbol[currency]}2,000
              </button>
              <button
                type="button"
                className={`p-2 rounded-md border ${
                  amount === 5000 && !customAmount
                    ? "border-amber-800 bg-amber-50 text-amber-800"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleAmountSelect(5000)}
              >
                {currencySymbol[currency]}5,000
              </button>
              <button
                type="button"
                className={`p-2 rounded-md border ${
                  amount === 10000 && !customAmount
                    ? "border-amber-800 bg-amber-50 text-amber-800"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => handleAmountSelect(10000)}
              >
                {currencySymbol[currency]}10,000
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{currencySymbol[currency]}</span>
              <input
                type="text"
                placeholder="Custom Amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="w-full p-2 pl-8 border border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Minimum donation: {currencySymbol[currency]}2,000</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
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
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message (Optional)
            </label>
            <textarea
              id="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Share why you're donating or any prayer requests"
            ></textarea>
          </div>
        </div>

        {paymentMethod === "flutterwave" && (
          <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800 flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>You'll be redirected to Flutterwave's secure payment page to complete your donation.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || amount < 2000}
          className="w-full py-3 bg-amber-800 text-white rounded-md hover:bg-amber-900 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <CircularLoader size="sm" color="white" /> Processing...
            </>
          ) : (
            <>{paymentMethod === "bank" ? "Confirm Donation" : "Proceed to Payment"}</>
          )}
        </button>
      </form>
    </div>
  )
}
