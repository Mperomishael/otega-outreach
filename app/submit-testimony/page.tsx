"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { addDocument, COLLECTIONS, uploadFile } from "@/lib/firebase-service"
import CircularLoader from "@/components/ui/circular-loader"
import { useLanguage } from "@/components/language-context"

export default function SubmitTestimonyPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    testimony: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setUploadProgress(0)

    try {
      // Validate form
      if (!formData.name || !formData.location || !formData.testimony) {
        throw new Error("Please fill in all required fields")
      }

      // Upload image if provided
      let imageUrl = ""
      if (image) {
        setUploadProgress(10)
        const filename = `testimonies/${Date.now()}-${image.name}`
        imageUrl = await uploadFile(filename, image)
        setUploadProgress(70)
      }

      // Prepare data for Firestore
      const testimonyData = {
        ...formData,
        image: imageUrl,
        featured: false, // Admin will decide if it should be featured
        status: "pending", // Pending admin approval
        createdAt: new Date(),
      }

      // Save to Firestore
      await addDocument(COLLECTIONS.TESTIMONIES, testimonyData)
      setUploadProgress(100)
      setSuccess(true)
    } catch (error) {
      console.error("Error submitting testimony:", error)
      setError("Failed to submit testimony. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-amber-800 hover:text-amber-900">
            <ArrowLeft size={16} className="mr-2" />
            {t("backToHome")}
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">{t("shareYourTestimony")}</h1>
          <p className="text-gray-600">{t("testimonyIntro")}</p>
        </div>

        {success ? (
          <div className="bg-green-100 text-green-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{t("testimonySubmitted")}</h2>
            <p className="mb-4">{t("testimonyThankYou")}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setSuccess(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {t("submitAnotherTestimony")}
              </button>
              <Link href="/" className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900">
                {t("backToHome")}
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("location")}*
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="City, State"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="testimony" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("yourTestimony")}*
                </label>
                <textarea
                  id="testimony"
                  name="testimony"
                  rows={6}
                  required
                  value={formData.testimony}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder={t("testimonyPlaceholder")}
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("yourPhoto")}</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <div className="relative w-full max-w-xs mx-auto">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Image preview"
                        className="w-full h-48 object-contain"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        disabled={isSubmitting}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="image" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-amber-800">{t("uploadPhoto")}</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                            disabled={isSubmitting}
                          />
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{t("photoRequirements")}</p>
                    </div>
                  )}
                </div>
              </div>

              {isSubmitting && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">{t("submittingTestimony")}</p>
                  <CircularLoader size="md" showPercentage percentage={uploadProgress} />
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 disabled:opacity-50"
                >
                  {isSubmitting ? t("submitting") : t("submitTestimony")}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
