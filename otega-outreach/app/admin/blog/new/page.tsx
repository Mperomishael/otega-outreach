"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { addDocument, COLLECTIONS, uploadFile } from "@/lib/firebase-service"
import dynamic from "next/dynamic"
import CircularLoader from "@/components/ui/circular-loader"
import RequireAuth from "@/components/admin/require-auth"

// Import the rich text editor dynamically to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/admin/rich-text-editor"), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-md flex items-center justify-center">Loading editor...</div>,
})

export default function NewBlogPost() {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    published: true,
  })
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
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
      setCoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setCoverImage(null)
    setCoverImagePreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setUploadProgress(0)

    try {
      let imageUrl = "/placeholder.svg?height=800&width=1200"

      // If there's a cover image, upload it to Firebase Storage
      if (coverImage) {
        setUploadProgress(10)
        const filename = `blog/${Date.now()}-${coverImage.name}`
        imageUrl = await uploadFile(filename, coverImage)
        setUploadProgress(70)
      }

      // Add the blog post to Firestore
      const blogData = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        imageUrl,
        published: formData.published,
        author: "Admin",
        views: 0,
        createdAt: new Date(),
      }

      setUploadProgress(90)
      await addDocument(COLLECTIONS.BLOG_POSTS, blogData)
      setUploadProgress(100)

      // Redirect to blog posts list
      router.push("/admin/blog/posts")
    } catch (error) {
      console.error("Error creating blog post:", error)
      setError("Failed to create blog post. Please try again.")
      setUploadProgress(0)
    } finally {
      setLoading(false)
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
                <Link href="/admin/blog/posts" className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold">Create New Blog Post</h1>
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
                          Blog Title*
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter blog post title"
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                          Summary*
                        </label>
                        <textarea
                          id="summary"
                          name="summary"
                          required
                          rows={3}
                          value={formData.summary}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter a brief summary of the blog post"
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="published"
                          className="flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                          <input
                            type="checkbox"
                            id="published"
                            name="published"
                            checked={formData.published}
                            onChange={handleChange}
                            className="rounded text-amber-800 focus:ring-amber-800"
                            disabled={loading}
                          />
                          Publish immediately
                        </label>
                        <p className="text-xs text-gray-500 mt-1">If unchecked, the post will be saved as a draft.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center h-48">
                        {coverImagePreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={coverImagePreview || "/placeholder.svg"}
                              alt="Cover preview"
                              className="w-full h-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={clearImage}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                              disabled={loading}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-2">
                              <label htmlFor="coverImage" className="cursor-pointer">
                                <span className="mt-2 block text-sm font-medium text-amber-800">
                                  Upload a cover image
                                </span>
                                <input
                                  id="coverImage"
                                  name="coverImage"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleImageChange}
                                  disabled={loading}
                                />
                              </label>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content*</label>
                    <RichTextEditor value={formData.content} onChange={handleContentChange} />
                  </div>

                  {loading && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Creating blog post...</p>
                      <CircularLoader size="md" showPercentage percentage={uploadProgress} />
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <Link
                      href="/admin/blog/posts"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={loading || !formData.title || !formData.summary || !formData.content}
                      className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 disabled:opacity-50"
                    >
                      {loading ? "Creating..." : "Create Blog Post"}
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
