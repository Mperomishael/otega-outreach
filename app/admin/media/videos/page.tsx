"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Trash2, Search, Filter, ArrowUpDown, Play, Eye } from "lucide-react"
import { getDocuments, deleteDocument, COLLECTIONS } from "@/lib/firebase-service"
import RequireAuth from "@/components/admin/require-auth"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import LoadingSpinner from "@/components/admin/loading-spinner"

interface Video {
  id: string
  title: string
  youtubeUrl: string
  thumbnail: string
  category: string
  description: string
  views: number
  createdAt: any
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isDeleting, setIsDeleting] = useState(false)

  const categories = [
    { id: "", name: "All Categories" },
    { id: "crusades", name: "Salvation Crusades" },
    { id: "training", name: "Pastor Training" },
    { id: "testimonies", name: "Testimonies" },
    { id: "outreach", name: "Village Outreach" },
  ]

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    setLoading(true)
    setError("")
    try {
      const fetchedVideos = await getDocuments<Video>(COLLECTIONS.VIDEOS)

      // Sort videos by createdAt date (newest first by default)
      const sortedVideos = fetchedVideos.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
        return sortOrder === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
      })

      setVideos(sortedVideos)
    } catch (error) {
      console.error("Error fetching videos:", error)
      setError("Failed to load videos. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVideo = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      setIsDeleting(true)
      try {
        await deleteDocument(COLLECTIONS.VIDEOS, id)
        setVideos((prevVideos) => prevVideos.filter((video) => video.id !== id))
      } catch (error) {
        console.error("Error deleting video:", error)
        setError("Failed to delete video. Please try again.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc"
    setSortOrder(newOrder)

    // Re-sort the current videos
    setVideos((prevVideos) =>
      [...prevVideos].sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
        return newOrder === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
      }),
    )
  }

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown date"

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold">Video Gallery</h1>
              <Link
                href="/admin/media/videos/new"
                className="flex items-center gap-2 bg-amber-800 text-white px-4 py-2 rounded-md hover:bg-amber-900 transition-colors"
              >
                <Plus size={18} />
                <span>Add New Video</span>
              </Link>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
                <p>{error}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-4 border-b">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search videos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none bg-white"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={toggleSortOrder}
                      className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <ArrowUpDown size={18} />
                      <span className="hidden sm:inline">{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <LoadingSpinner />
                  <p className="mt-4 text-gray-500">Loading videos...</p>
                </div>
              ) : filteredVideos.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No videos found. Add your first video to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      className="border rounded-md overflow-hidden bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="relative h-48 group">
                        <Image
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-amber-800 rounded-full p-3">
                            <Play size={24} className="text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 truncate">{video.title}</h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                            {categories.find((c) => c.id === video.category)?.name || video.category}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(video.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{video.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <Eye size={14} className="mr-1" />
                            {video.views || 0} views
                          </div>
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </RequireAuth>
  )
}
