"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Calendar, Eye } from "lucide-react"
import { getVideos } from "@/lib/firebase-service"
import CircularLoader from "@/components/ui/circular-loader"

export default function VideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const searchParams = useSearchParams()
  const categoryParam = searchParams?.get("category")

  const categories = [
    { id: "all", name: "All Videos" },
    { id: "crusades", name: "Salvation Crusades" },
    { id: "training", name: "Pastor Training" },
    { id: "outreach", name: "Village Outreach" },
    { id: "testimonies", name: "Testimonies" },
  ]

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const videosData = await getVideos()
        setVideos(videosData)
      } catch (err) {
        console.error("Error fetching videos:", err)
        setError("Failed to load videos. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  useEffect(() => {
    if (categoryParam && categories.some((cat) => cat.id === categoryParam)) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  const filteredVideos =
    selectedCategory === "all" ? videos : videos.filter((video) => video.category === selectedCategory)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <CircularLoader size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Video Gallery</h1>
      <p className="text-center text-gray-700 mb-8">Watch our ministry in action across rural Nigeria</p>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? "bg-amber-700 text-white"
                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No videos found in this category.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video relative">
                <iframe
                  src={video.youtubeUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {video.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {video.views || 0} views
                  </span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs capitalize">
                    {video.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
