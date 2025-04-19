"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "./language-context"
import { addDocument, COLLECTIONS } from "@/lib/firebase-service"
import CircularLoader from "@/components/ui/circular-loader"

export default function PrayerRequestForm() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    request: "",
    isPrivate: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      // Validate form
      if (!formData.name || !formData.request) {
        throw new Error("Please fill in all required fields")
      }

      // Save to Firestore
      await addDocument(COLLECTIONS.PRAYER_REQUESTS, {
        ...formData,
        status: "new",
        createdAt: new Date(),
      })

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        request: "",
        isPrivate: false,
      })
    } catch (error) {
      console.error("Error submitting prayer request:", error)
      setError("Failed to submit prayer request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">{t("submitPrayerRequest")}</h3>

      {success ? (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
          <p>{t("prayerRequestSubmitted")}</p>
          <p className="text-sm mt-2">{t("prayerRequestThankYou")}</p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900"
          >
            {t("submitAnotherRequest")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
              <p>{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t("fullName")}*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              {t("phone")}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-1">
              {t("prayerRequest")}*
            </label>
            <textarea
              id="request"
              name="request"
              rows={4}
              required
              value={formData.request}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isSubmitting}
              placeholder={t("prayerRequestPlaceholder")}
            ></textarea>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="h-4 w-4 text-amber-800 focus:ring-amber-500 border-gray-300 rounded"
              disabled={isSubmitting}
            />
            <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
              {t("keepRequestPrivate")}
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <CircularLoader size="sm" className="mr-2" />
                {t("submitting")}
              </span>
            ) : (
              t("submitRequest")
            )}
          </button>
        </form>
      )}
    </div>
  )
}
