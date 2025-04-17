"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, Filter, X } from "lucide-react"
import { collection, onSnapshot, query } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { COLLECTIONS } from "@/lib/firebase-service"
import CircularLoader from "@/components/ui/circular-loader"
import { useLanguage } from "@/components/language-context"

interface Photo {
  id: string
  title: string
  imageUrl: string
  category: string
  description?: string
  createdAt?: any
}

export default function PhotosPage() {
  const { t } = useLanguage()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    // Set up real-time listener for photos
    const photosQuery = query(collection(db, COLLECTIONS.PHOTOS))

    const unsubscribe = onSnapshot(
      photosQuery,
      (snapshot) => {
        const items: Photo[] = []
        const categorySet = new Set<string>()

        snapshot.forEach((doc) => {
          const photoData = { id: doc.id, ...doc.data() } as Photo
          items.push(photoData)

          if (photoData.category) {
            categorySet.add(photoData.category)
          }
        })

        // Sort photos by creation date (newest first)
        items.sort((a, b) => {
          if (!a.createdAt) return 1
          if (!b.createdAt) return -1
          const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : a.createdAt
          const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt
          return dateB - dateA
        })

        setPhotos(items)
        setFilteredPhotos(items)
        setCategories(Array.from(categorySet))
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching photos:", err)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // Filter photos based on search term and selected category
    const filtered = photos.filter((photo) => {
      const matchesSearch =
        photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (photo.description && photo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || photo.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    setFilteredPhotos(filtered)
  }, [searchTerm, selectedCategory, photos])

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">{t("photoGallery")}</h1>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t("searchPhotos")}
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
          <CircularLoader size="lg" label={t("loadingPhotos")} />
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-500 mb-2">{t("noPhotosFound")}</h3>
          <p className="text-gray-400">
            {searchTerm || selectedCategory !== "all" ? t("tryAdjustingSearch") : t("noPhotosYet")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => handlePhotoClick(photo)}
            >
              <Image
                src={photo.imageUrl || "/placeholder.svg?height=300&width=300"}
                alt={photo.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-end">
                <div className="p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                  <h4 className="font-bold text-sm">{photo.title}</h4>
                  {photo.category && <p className="text-xs text-gray-200 capitalize">{photo.category}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={closePhotoModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePhotoModal}
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white rounded-full p-1"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <div className="relative h-[80vh] w-auto">
              <Image
                src={selectedPhoto.imageUrl || "/placeholder.svg"}
                alt={selectedPhoto.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-4 bg-white">
              <h3 className="font-bold text-lg">{selectedPhoto.title}</h3>
              {selectedPhoto.description && <p className="text-gray-700 mt-1">{selectedPhoto.description}</p>}
              {selectedPhoto.category && (
                <p className="text-sm text-gray-500 mt-1 capitalize">{selectedPhoto.category}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
