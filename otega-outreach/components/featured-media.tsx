"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, ArrowRight } from "lucide-react"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import CircularLoader from "@/components/ui/circular-loader"
import VideoPlayer from "./video-player"

interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  videoUrl: string
  date: string
  featured: boolean
}

export default function FeaturedMedia() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true)
        const videosQuery = query(
          collection(db, "videos"),
          where("featured", "==", true),
          orderBy("date", "desc"),
          limit(3),
        )

        const querySnapshot = await getDocs(videosQuery)
        const videosList: Video[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<Video, "id">
          videosList.push({
            id: doc.id,
            ...data,
            date: data.date ? new Date(data.date.toDate()).toLocaleDateString() : "No date",
          })
        })

        setVideos(videosList)
      } catch (err) {
        console.error("Error fetching videos:", err)
        setError("Failed to load featured videos")
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video)
  }

  if (loading) {
    return (
      <section className="bg-amber-50 py-12">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Featured Media</h2>
          <div className="flex justify-center">
            <CircularLoader />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-amber-50 py-12">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Featured Media</h2>
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">{error}</div>
        </div>
      </section>
    )
  }

  if (videos.length === 0) {
    return null // Don't show the section if there are no videos
  }

  return (
    <section className="bg-amber-50 py-12">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Media</h2>
          <Link href="/media/videos" className="text-amber-800 hover:text-amber-900 flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative aspect-video cursor-pointer group" onClick={() => handlePlayVideo(video)}>
                <Image
                  src={video.thumbnailUrl || "/placeholder.svg?height=720&width=1280"}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-amber-800 flex items-center justify-center">
                    <Play size={24} className="text-white ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2 line-clamp-1">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                <button
                  onClick={() => handlePlayVideo(video)}
                  className="text-amber-800 hover:text-amber-900 text-sm font-medium flex items-center gap-1"
                >
                  Watch Video <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo.videoUrl}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  )
}
