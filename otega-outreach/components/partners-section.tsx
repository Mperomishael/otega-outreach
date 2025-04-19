"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Handshake } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import CircularLoader from "@/components/ui/circular-loader"

interface Partner {
  id: string
  name: string
  logo: string
  website: string
  description: string
}

export default function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPartners() {
      try {
        const partnersCollection = collection(db, "partners")
        const partnersSnapshot = await getDocs(partnersCollection)

        const partnersList: Partner[] = []
        partnersSnapshot.forEach((doc) => {
          partnersList.push({
            id: doc.id,
            ...(doc.data() as Omit<Partner, "id">),
          })
        })

        setPartners(partnersList)
      } catch (error) {
        console.error("Error fetching partners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Handshake className="h-12 w-12 text-amber-800" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Ministry Partners</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are blessed to partner with these organizations and churches who share our vision for reaching the
            unreached in Nigeria.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <CircularLoader size="lg" label="Loading partners..." />
          </div>
        ) : partners.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {partners.map((partner) => (
              <Link
                key={partner.id}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center"
              >
                <div className="h-16 w-full relative mb-4">
                  <Image
                    src={partner.logo || "/placeholder.svg?height=100&width=200"}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-center font-medium text-gray-900">{partner.name}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No partners found. Check back soon!</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/partners"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-800 hover:bg-amber-900"
          >
            Become a Partner
          </Link>
        </div>
      </div>
    </section>
  )
}
