"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useLanguage } from "./language-context"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { COLLECTIONS } from "@/lib/firebase-service"
import CircularLoader from "@/components/ui/circular-loader"

interface Testimony {
  id: string
  name: string
  location: string
  testimony: string
  image?: string
  featured: boolean
  createdAt?: any // Add createdAt to the Testimony interface
}

export default function TestimoniesSection() {
  const { t } = useLanguage()
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Create a query for featured testimonies without orderBy to avoid index requirement
    const q = query(collection(db, COLLECTIONS.TESTIMONIES), where("featured", "==", true))

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Testimony[] = []
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Testimony)
        })

        // Sort testimonies client-side by createdAt date
        items.sort((a, b) => {
          // Handle cases where createdAt might be missing
          if (!a.createdAt) return 1
          if (!b.createdAt) return -1

          // Convert Firestore timestamps to milliseconds for comparison
          const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : a.createdAt
          const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt

          return dateB - dateA // Sort in descending order (newest first)
        })

        setTestimonies(items)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching testimonies:", err)
        setLoading(false)
      },
    )

    // Clean up listener on unmount
    return () => unsubscribe()
  }, [])

  const nextTestimony = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonies.length)
  }

  const prevTestimony = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonies.length) % testimonies.length)
  }

  if (loading) {
    return (
      <section className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">{t("testimonies")}</h2>
          <div className="flex justify-center">
            <CircularLoader size="lg" />
          </div>
        </div>
      </section>
    )
  }

  if (testimonies.length === 0) {
    return null // Don't show the section if no testimonies
  }

  return (
    <section className="bg-amber-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">{t("testimonies")}</h2>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {testimonies.map((testimony, index) => (
              <div
                key={testimony.id}
                className={`transition-opacity duration-500 ${
                  index === currentIndex ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
              >
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-24 h-24 relative rounded-full overflow-hidden flex-shrink-0">
                      {testimony.image ? (
                        <Image
                          src={testimony.image || "/placeholder.svg"}
                          alt={testimony.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-amber-200 flex items-center justify-center">
                          <Star className="text-amber-800" size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-gray-700 mb-4 italic">{testimony.testimony}</p>
                      <div>
                        <h3 className="font-bold text-lg">{testimony.name}</h3>
                        <p className="text-gray-500">{testimony.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {testimonies.length > 1 && (
              <>
                <button
                  onClick={prevTestimony}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white rounded-full p-2 shadow-md text-amber-800 hover:bg-amber-50"
                  aria-label="Previous testimony"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextTestimony}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white rounded-full p-2 shadow-md text-amber-800 hover:bg-amber-50"
                  aria-label="Next testimony"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {testimonies.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {testimonies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-amber-800" : "bg-amber-300"}`}
                  aria-label={`Go to testimony ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
