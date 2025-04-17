"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { addDocument, COLLECTIONS, uploadFile } from "@/lib/firebase-service"
import CircularLoader from "@/components/ui/circular-loader"
import RequireAuth from "@/components/admin/require-auth"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default function NewTestimonyPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    testimony: "",
    featured: false,
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
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
        createdAt: new Date(),
      }

      // Save to Firestore
      await addDocument(COLLECTIONS.TESTIMONIES, testimonyData)
      setUploadProgress(100)

      // Redirect to testimonies list
      router.push("/admin/testimonies")
    } catch (error) {
      console.error("Error adding testimony:", error)
      setError("Failed to add testimony. Please try again.")
      setUploadProgress(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Link href="/admin/testimonies" className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold">Add New Testimony</h1>
              </div>

              {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-md">
                  <p>{error}</p>
                </div>
              )}

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name*
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter person's name"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                          Location*
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
                          Testimony*
                        </label>
                        <textarea
                          id="testimony"
                          name="testimony"
                          rows={6}
                          required
                          value={formData.testimony}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter testimony text"
                          disabled={isSubmitting}
                        ></textarea>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="h-4 w-4 text-amber-800 focus:ring-amber-500 border-gray-300 rounded"
                          disabled={isSubmitting}
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                          Feature on homepage
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Person's Photo</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center h-64">
                        {imagePreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Image preview"
                              className="w-full h-full object-contain"
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
                                <span className="mt-2 block text-sm font-medium text-amber-800">Upload a photo</span>
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
                            <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {isSubmitting && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Saving testimony...</p>
                      <CircularLoader size="md" showPercentage percentage={uploadProgress} />
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <Link
                      href="/admin/testimonies"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save Testimony"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RequireAuth>
  )
}
