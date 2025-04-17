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

export default function NewVideoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    youtubeUrl: "",
    category: "",
    description: "",
    thumbnail: null as File | null,
  })
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)

  const categories = [
    { id: "crusades", name: "Salvation Crusades" },
    { id: "training", name: "Pastor Training" },
    { id: "testimonies", name: "Testimonies" },
    { id: "outreach", name: "Village Outreach" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({ ...prev, thumbnail: file }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setThumbnailPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: null }))
    setThumbnailPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setUploadProgress(0)

    try {
      // Extract YouTube video ID from URL
      let youtubeId = ""
      const url = formData.youtubeUrl

      if (url.includes("youtube.com/watch?v=")) {
        youtubeId = url.split("v=")[1].split("&")[0]
      } else if (url.includes("youtu.be/")) {
        youtubeId = url.split("youtu.be/")[1].split("?")[0]
      }

      // Create embed URL
      const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : formData.youtubeUrl

      // Get thumbnail URL (either from file upload or YouTube)
      let thumbnailUrl = ""

      if (formData.thumbnail) {
        // Upload custom thumbnail to Firebase Storage
        setUploadProgress(10)
        const filename = `videos/${Date.now()}-${formData.thumbnail.name}`
        thumbnailUrl = await uploadFile(filename, formData.thumbnail)
        setUploadProgress(70)
      } else if (youtubeId) {
        // Use YouTube thumbnail if no custom thumbnail
        thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      } else {
        thumbnailUrl = "/placeholder.svg?height=200&width=350"
      }

      setUploadProgress(80)

      // Prepare data for Firestore
      const videoData = {
        title: formData.title,
        youtubeUrl: embedUrl,
        thumbnail: thumbnailUrl,
        category: formData.category,
        description: formData.description,
        views: 0,
      }

      // Save to Firestore
      await addDocument(COLLECTIONS.VIDEOS, videoData)
      setUploadProgress(100)

      // Redirect to videos list
      router.push("/admin/media/videos")
    } catch (error) {
      console.error("Error adding video:", error)
      setError("Failed to add video. Please try again.")
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
                <Link href="/admin/media/videos" className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold">Add New Video</h1>
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
                          Video Title*
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter video title"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1">
                          YouTube URL*
                        </label>
                        <input
                          type="url"
                          id="youtubeUrl"
                          name="youtubeUrl"
                          required
                          value={formData.youtubeUrl}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="https://www.youtube.com/watch?v=..."
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter the full YouTube URL. The system will automatically convert it to an embed URL.
                        </p>
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
                          placeholder="Enter video description"
                          disabled={isSubmitting}
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                        {thumbnailPreview ? (
                          <div className="relative w-full">
                            <img
                              src={thumbnailPreview || "/placeholder.svg"}
                              alt="Thumbnail preview"
                              className="w-full h-48 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={clearThumbnail}
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
                              <label htmlFor="thumbnail" className="cursor-pointer">
                                <span className="mt-2 block text-sm font-medium text-amber-800">
                                  Upload a thumbnail
                                </span>
                                <input
                                  id="thumbnail"
                                  name="thumbnail"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleThumbnailChange}
                                  disabled={isSubmitting}
                                />
                              </label>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        If no thumbnail is provided, the system will attempt to fetch one from YouTube.
                      </p>
                    </div>
                  </div>

                  {isSubmitting && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Uploading video...</p>
                      <CircularLoader size="md" showPercentage percentage={uploadProgress} />
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <Link
                      href="/admin/media/videos"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save Video"}
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
