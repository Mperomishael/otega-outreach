"use client"

import type React from "react"

import { useState } from "react"
import { X, Send, Check } from "lucide-react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { COLLECTIONS } from "@/lib/firebase-service"
import { useLanguage } from "./language-context"

interface PrayerRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitSuccess?: () => void
}

export default function PrayerRequestModal({ isOpen, onClose, onSubmitSuccess }: PrayerRequestModalProps) {
  const { t } = useLanguage()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [request, setRequest] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!name || !request) {
      setError("Please provide your name and prayer request")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Add prayer request to Firestore
      await addDoc(collection(db, COLLECTIONS.PRAYER_REQUESTS), {
        name,
        email,
        phone,
        request,
        status: "new",
        createdAt: serverTimestamp(),
      })

      // Show success message
      setSuccess(true)

      // Reset form
      setName("")
      setEmail("")
      setPhone("")
      setRequest("")

      // Close modal after delay
      setTimeout(() => {
        onClose()
        if (onSubmitSuccess) {
          onSubmitSuccess()
        }
      }, 2000)
    } catch (err) {
      console.error("Error submitting prayer request:", err)
      setError("Failed to submit prayer request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{t("submitPrayerRequest")}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check size={24} className="text-green-600" />
            </div>
            <h4 className="text-xl font-medium text-gray-900 mb-2">{t("prayerRequestReceived")}</h4>
            <p className="text-gray-600">{t("prayerRequestConfirmation")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t("yourName")} *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t("email")}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t("phone")}
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-1">
                {t("prayerRequest")} *
              </label>
              <textarea
                id="request"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={4}
                required
              ></textarea>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("submitting")}
                </span>
              ) : (
                <span className="flex items-center">
                  <Send size={18} className="mr-2" />
                  {t("submitRequest")}
                </span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
