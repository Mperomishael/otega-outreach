"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Play, Search, Filter } from "lucide-react"
import { collection, onSnapshot, query } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { COLLECTIONS } from "@/lib/firebase-service"
import CircularLoader from "@/components/ui/circular-loader"
import VideoPlayer from "@/components/video-player"
import { useLanguage } from "@/components/language-context"

interface Video {
  id: string
  title: string
  youtubeUrl: string
  thumbnail: string
  category: string
  description?: string
  createdAt?: any
}

export default function VideosPage() {
  const { t } = useLanguage()
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)

  useEffect(() => {
    // Set up real-time listener for videos
    const videosQuery = query(collection(db, COLLECTIONS.VIDEOS))

    const unsubscribe = onSnapshot(
      videosQuery,
      (snapshot) => {
        const items: Video[] = []
        const categorySet = new Set<string>()

        snapshot.forEach((doc) => {
          const videoData = { id: doc.id, ...doc.data() } as Video
          items.push(videoData)

          if (videoData.category) {
            categorySet.add(videoData.category)
          }
        })

        // Sort videos by creation date (newest first)
        items.sort((a, b) => {
          if (!a.createdAt) return 1
          if (!b.createdAt) return -1
          const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : a.createdAt
          const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt
          return dateB - dateA
        })

        setVideos(items)
        setFilteredVideos(items)
        setCategories(Array.from(categorySet))
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching videos:", err)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // Filter videos based on search term and selected category
    const filtered = videos.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || video.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    setFilteredVideos(filtered)
  }, [searchTerm, selectedCategory, videos])

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
    setShowVideoPlayer(true)
  }

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false)
    setSelectedVideo(null)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">{t("videoGallery")}</h1>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("searchVideos")}
              className="pl-10 w-full p-3 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {categories.length > 0 && (
            <div className="md:w-64">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <select
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">{t("allCategories")}</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <CircularLoader size="lg" label={t("loadingVideos")} />
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-500 mb-2">{t("noVideosFound")}</h3>
          <p className="text-gray-400">
            {searchTerm || selectedCategory !== "all" ? t("tryAdjustingSearch") : t("noVideosYet")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative aspect-video">
                <Image
                  src={video.thumbnail || "/placeholder.svg?height=200&width=350"}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleVideoClick(video)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-amber-800 bg-opacity-80 rounded-full p-3 text-white hover:bg-opacity-100 transition-all transform hover:scale-110">
                    <Play size={24} fill="white" />
                  </div>
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-bold mb-1">{video.title}</h4>
                <p className="text-sm text-gray-500 capitalize mb-2">{video.category}</p>
                {video.description && <p className="text-sm text-gray-700 line-clamp-2">{video.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoPlayer && selectedVideo && <VideoPlayer video={selectedVideo} onClose={closeVideoPlayer} />}
    </div>
  )
}
