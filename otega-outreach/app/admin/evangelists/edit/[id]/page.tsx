"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { getDocument, updateDocument, COLLECTIONS, uploadFile } from "@/lib/firebase-service"
import CircularLoader from "@/components/ui/circular-loader"
import RequireAuth from "@/components/admin/require-auth"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/components/admin/auth-provider"

interface Evangelist {
  id?: string
  name: string
  role: string
  region: string
  bio: string
  email: string
  phone: string
  status: string
  image: string
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
  }
}

export default function EditEvangelistPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const evangelistId = params.id as string

  const [formData, setFormData] = useState<Evangelist>({
    name: "",
    role: "",
    region: "",
    bio: "",
    email: "",
    phone: "",
    status: "active",
    image: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
  })

  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    const fetchEvangelist = async () => {
      try {
        setIsLoading(true)
        const evangelist = await getDocument<Evangelist>(COLLECTIONS.EVANGELISTS, evangelistId)

        if (evangelist) {
          setFormData(evangelist)
          setImagePreview(evangelist.image)
        } else {
          setError("Evangelist not found")
        }
      } catch (err) {
        console.error("Error fetching evangelist:", err)
        setError("Failed to load evangelist data")
      } finally {
        setIsLoading(false)
      }
    }

    if (evangelistId) {
      fetchEvangelist()
    }
  }, [evangelistId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setProfileImage(null)
    setImagePreview(formData.image) // Reset to original image
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setUploadProgress(0)

    try {
      // Validate form
      if (!formData.name || !formData.role || !formData.region) {
        throw new Error("Please fill in all required fields")
      }

      const updatedData = { ...formData }

      // Upload new profile image if provided
      if (profileImage) {
        setUploadProgress(10)
        const filename = `evangelists/${Date.now()}-${profileImage.name}`
        const imageUrl = await uploadFile(filename, profileImage)
        updatedData.image = imageUrl
        setUploadProgress(70)
      }

      // Update in Firestore
      updatedData.updatedAt = new Date()
      await updateDocument(COLLECTIONS.EVANGELISTS, evangelistId, updatedData)
      setUploadProgress(100)

      // Redirect to evangelists list
      router.push("/admin/evangelists")
    } catch (error) {
      console.error("Error updating evangelist:", error)
      setError(error instanceof Error ? error.message : "Failed to update evangelist. Please try again.")
      setUploadProgress(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-gray-100">
          <AdminHeader />
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1 p-6 flex items-center justify-center">
              <CircularLoader size="lg" label="Loading evangelist data..." />
            </main>
          </div>
        </div>
      </RequireAuth>
    )
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
                <Link href="/admin/evangelists" className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold">Edit Evangelist</h1>
              </div>

              {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-md">
                  <p>{error}</p>
                </div>
              )}

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name*
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter evangelist's full name"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                          Role/Title*
                        </label>
                        <input
                          type="text"
                          id="role"
                          name="role"
                          required
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="e.g. Regional Evangelist, Lead Pastor"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                          Region/Area*
                        </label>
                        <input
                          type="text"
                          id="region"
                          name="region"
                          required
                          value={formData.region}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="e.g. Lagos & Southwest, Nationwide"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                          Biography
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={5}
                          value={formData.bio}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter evangelist's biography and ministry experience"
                          disabled={isSubmitting}
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="email@example.com"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="+234 800 000 0000"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Social Media</label>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="facebook" className="block text-xs text-gray-500 mb-1">
                              Facebook
                            </label>
                            <input
                              type="text"
                              id="facebook"
                              name="socialMedia.facebook"
                              value={formData.socialMedia.facebook}
                              onChange={handleChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="https://facebook.com/username"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label htmlFor="twitter" className="block text-xs text-gray-500 mb-1">
                              Twitter
                            </label>
                            <input
                              type="text"
                              id="twitter"
                              name="socialMedia.twitter"
                              value={formData.socialMedia.twitter}
                              onChange={handleChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="https://twitter.com/username"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label htmlFor="instagram" className="block text-xs text-gray-500 mb-1">
                              Instagram
                            </label>
                            <input
                              type="text"
                              id="instagram"
                              name="socialMedia.instagram"
                              value={formData.socialMedia.instagram}
                              onChange={handleChange}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="https://instagram.com/username"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          disabled={isSubmitting}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Profile Image (Recommended: 300x300px)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                          {imagePreview ? (
                            <div className="relative w-full">
                              <img
                                src={imagePreview || "/placeholder.svg"}
                                alt="Profile image preview"
                                className="w-full h-48 object-cover rounded-md"
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
                                <label htmlFor="profileImage" className="cursor-pointer">
                                  <span className="mt-2 block text-sm font-medium text-amber-800">
                                    Upload profile image
                                  </span>
                                  <input
                                    id="profileImage"
                                    name="profileImage"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleImageChange}
                                    disabled={isSubmitting}
                                    ref={fileInputRef}
                                  />
                                </label>
                              </div>
                              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isSubmitting && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Updating evangelist profile...</p>
                      <CircularLoader size="md" showPercentage percentage={uploadProgress} />
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <Link
                      href="/admin/evangelists"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Update Evangelist"}
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
