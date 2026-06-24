"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Camera } from "lucide-react"
import { collection, getDocs, query, limit } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import CircularLoader from "@/components/ui/circular-loader"

interface Photo {
  id: string
  title: string
  imageUrl: string
  description?: string
  category?: string
  createdAt?: any
}

export default function HomeGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setLoading(true)
        const photosQuery = query(collection(db, "photos"), limit(6))

        const querySnapshot = await getDocs(photosQuery)
        const photosList: Photo[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<Photo, "id">
          photosList.push({
            id: doc.id,
            ...data,
          })
        })

        // Sort client-side by createdAt if available
        photosList.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0
          return b.createdAt.seconds - a.createdAt.seconds
        })

        setPhotos(photosList)
      } catch (err) {
        console.error("Error fetching photos:", err)
        setError("Failed to load gallery photos")
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  if (loading) {
    return (
      <section className="container px-4 mx-auto py-8">
        <h2 className="text-2xl font-bold text-center mb-6">Photo Gallery</h2>
        <div className="flex justify-center py-10">
          <CircularLoader />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="container px-4 mx-auto py-8">
        <h2 className="text-2xl font-bold text-center mb-6">Photo Gallery</h2>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">{error}</div>
      </section>
    )
  }

  if (photos.length === 0) {
    return null // Don't show the section if there are no photos
  }

  return (
    <section className="container px-4 mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Photo Gallery</h2>
        <Link href="/media/photos" className="text-amber-800 hover:text-amber-900 flex items-center gap-1">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group overflow-hidden rounded-lg">
            <div className="aspect-square relative">
              <Image
                src={photo.imageUrl || "/placeholder.svg?height=400&width=400"}
                alt={photo.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white font-medium text-sm md:text-base truncate">{photo.title}</h3>
              {photo.category && <p className="text-white/80 text-xs truncate capitalize">{photo.category}</p>}
            </div>
            <div className="absolute top-2 right-2 bg-amber-800/80 text-white p-1 rounded-full">
              <Camera size={16} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
