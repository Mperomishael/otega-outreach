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

export default function NewPhotoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)

  const categories = [
    { id: "crusades", name: "Salvation Crusades" },
    { id: "training", name: "Pastor Training" },
    { id: "outreach", name: "Village Outreach" },
    { id: "testimonies", name: "Testimonies" },
    { id: "events", name: "Events" },
    { id: "other", name: "Other" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, GIF, WEBP)")
        return
      }

      setError("")
      setFormData((prev) => ({ ...prev, image: file }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image) {
      setError("Please select an image to upload")
      return
    }

    setIsSubmitting(true)
    setError("")
    setUploadProgress(0)

    try {
      // Upload image to Firebase Storage
      setUploadProgress(10)
      const filename = `photos/${Date.now()}-${formData.image.name}`
      const imageUrl = await uploadFile(filename, formData.image)
      setUploadProgress(70)

      // Prepare data for Firestore
      const photoData = {
        title: formData.title,
        imageUrl: imageUrl,
        category: formData.category,
        description: formData.description,
        createdAt: new Date(),
      }

      // Save to Firestore
      await addDocument(COLLECTIONS.PHOTOS, photoData)
      setUploadProgress(100)

      // Redirect to photos list
      router.push("/admin/media/photos")
    } catch (error) {
      console.error("Error adding photo:", error)
      setError("Failed to add photo. Please try again.")
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
                <Link href="/admin/media/photos" className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold">Add New Photo</h1>
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
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Photo Title*
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter photo title"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                          Category*
                        </label>
                        <select
                          id="category"
                          name="category"
                          required
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          disabled={isSubmitting}
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={4}
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter photo description"
                          disabled={isSubmitting}
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Photo Image*</label>
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
                                  required
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
                      <p className="text-sm font-medium text-gray-700 mb-1">Uploading photo...</p>
                      <CircularLoader size="md" showPercentage percentage={uploadProgress} />
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <Link
                      href="/admin/media/photos"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.image}
                      className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save Photo"}
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
