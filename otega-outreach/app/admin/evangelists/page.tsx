"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import CircularLoader from "@/components/ui/circular-loader"

interface Evangelist {
  id: string
  name: string
  role: string
  region: string
  image: string
  status: string
}

export default function AdminEvangelistsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [evangelists, setEvangelists] = useState<Evangelist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function fetchEvangelists() {
      try {
        setLoading(true)
        const evangelistsCollection = collection(db, "evangelists")
        const evangelistsSnapshot = await getDocs(evangelistsCollection)

        const evangelistsList: Evangelist[] = []
        evangelistsSnapshot.forEach((doc) => {
          evangelistsList.push({
            id: doc.id,
            ...(doc.data() as Omit<Evangelist, "id">),
          })
        })

        setEvangelists(evangelistsList)
      } catch (err) {
        console.error("Error fetching evangelists:", err)
        setError("Failed to load evangelists. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvangelists()
  }, [])

  const handleDeleteEvangelist = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this evangelist?")) {
      try {
        setIsDeleting(true)
        await deleteDoc(doc(db, "evangelists", id))
        setEvangelists(evangelists.filter((evangelist) => evangelist.id !== id))
      } catch (err) {
        console.error("Error deleting evangelist:", err)
        setError("Failed to delete evangelist. Please try again.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const filteredEvangelists = evangelists.filter((evangelist) =>
    evangelist.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Evangelists</h1>
        <Link
          href="/admin/evangelists/new"
          className="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors"
        >
          <Plus size={16} />
          <span>Add New Evangelist</span>
        </Link>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search evangelists..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <CircularLoader />
          </div>
        ) : (
          <>
            {filteredEvangelists.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evangelist
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Region
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEvangelists.map((evangelist) => (
                      <tr key={evangelist.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden">
                              <Image
                                src={evangelist.image || "/placeholder.svg?height=300&width=300"}
                                alt={evangelist.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{evangelist.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evangelist.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evangelist.region}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              evangelist.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {evangelist.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/evangelists/edit/${evangelist.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteEvangelist(evangelist.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No evangelists found. Add your first evangelist to get started.</p>
                <Link
                  href="/admin/evangelists/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add New Evangelist</span>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
