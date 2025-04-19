"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus, Search, Star, Check, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { COLLECTIONS, deleteDocument, formatTimestamp, updateDocument } from "@/lib/firebase-service"
import CircularLoader from "@/components/ui/circular-loader"
import RequireAuth from "@/components/admin/require-auth"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { collection, onSnapshot, query } from "firebase/firestore"
import { db } from "@/lib/firebase-config"

interface Testimony {
  id?: string
  name: string
  location: string
  testimony: string
  image?: string
  featured: boolean
  status?: "pending" | "approved" | "rejected"
  createdAt?: any
}

export default function AdminTestimoniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedTestimony, setSelectedTestimony] = useState<Testimony | null>(null)

  useEffect(() => {
    setLoading(true)

    // Create a query without orderBy to avoid index requirement
    const q = query(collection(db, COLLECTIONS.TESTIMONIES))

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
          if (!a.createdAt) return 1
          if (!b.createdAt) return -1
          const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : a.createdAt
          const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt
          return dateB - dateA // Sort in descending order (newest first)
        })

        setTestimonies(items)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching testimonies:", err)
        setError("Failed to load testimonies. Please try again.")
        setLoading(false)
      },
    )

    // Clean up listener on unmount
    return () => unsubscribe()
  }, [])

  const handleDeleteTestimony = async (id?: string) => {
    if (!id) return

    if (confirm("Are you sure you want to delete this testimony? This action cannot be undone.")) {
      try {
        await deleteDocument(COLLECTIONS.TESTIMONIES, id)
        // No need to update state as the listener will handle it
      } catch (err) {
        console.error("Error deleting testimony:", err)
        alert("Failed to delete testimony. Please try again.")
      }
    }
  }

  const handleToggleFeatured = async (id?: string, featured?: boolean) => {
    if (!id) return

    try {
      await updateDocument(COLLECTIONS.TESTIMONIES, id, { featured: !featured })
    } catch (err) {
      console.error("Error updating testimony:", err)
      alert("Failed to update testimony. Please try again.")
    }
  }

  const handleApproveTestimony = async (id?: string) => {
    if (!id) return

    try {
      await updateDocument(COLLECTIONS.TESTIMONIES, id, { status: "approved" })
    } catch (err) {
      console.error("Error approving testimony:", err)
      alert("Failed to approve testimony. Please try again.")
    }
  }

  const handleRejectTestimony = async (id?: string) => {
    if (!id) return

    try {
      await updateDocument(COLLECTIONS.TESTIMONIES, id, { status: "rejected" })
    } catch (err) {
      console.error("Error rejecting testimony:", err)
      alert("Failed to reject testimony. Please try again.")
    }
  }

  const handleViewTestimony = (testimony: Testimony) => {
    setSelectedTestimony(testimony)
  }

  const closeModal = () => {
    setSelectedTestimony(null)
  }

  const filteredTestimonies = testimonies.filter((testimony) => {
    const matchesSearch =
      testimony.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimony.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimony.testimony.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && testimony.status === "pending") ||
      (statusFilter === "approved" && testimony.status === "approved") ||
      (statusFilter === "rejected" && testimony.status === "rejected") ||
      (statusFilter === "featured" && testimony.featured)

    return matchesSearch && matchesStatus
  })

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Testimonies</h1>
                <Link
                  href="/admin/testimonies/new"
                  className="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add New Testimony</span>
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search testimonies..."
                      className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="md:w-64">
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Testimonies</option>
                      <option value="pending">Pending Approval</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="featured">Featured</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <CircularLoader size="lg" label="Loading testimonies..." />
                  </div>
                ) : error ? (
                  <div className="bg-red-100 text-red-700 p-4 rounded-md">
                    <p>{error}</p>
                  </div>
                ) : (
                  <>
                    {filteredTestimonies.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-500 mb-2">No testimonies found</h3>
                        <p className="text-gray-400 mb-6">
                          {searchTerm || statusFilter !== "all"
                            ? "Try adjusting your search criteria"
                            : "Add your first testimony to get started"}
                        </p>
                        <Link
                          href="/admin/testimonies/new"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors"
                        >
                          <Plus size={16} />
                          <span>Add New Testimony</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTestimonies.map((testimony) => (
                          <div key={testimony.id} className="border rounded-lg overflow-hidden">
                            <div className="relative h-48 bg-gray-100">
                              {testimony.image ? (
                                <Image
                                  src={testimony.image || "/placeholder.svg"}
                                  alt={testimony.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-amber-50 text-amber-800">
                                  <Star size={48} />
                                </div>
                              )}
                              {testimony.featured && (
                                <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Featured
                                </div>
                              )}
                              {testimony.status === "pending" && (
                                <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Pending
                                </div>
                              )}
                              {testimony.status === "rejected" && (
                                <div className="absolute top-2 left-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                  Rejected
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-lg">{testimony.name}</h3>
                              <p className="text-sm text-gray-500 mb-2">{testimony.location}</p>
                              <p className="text-gray-700 mb-4 line-clamp-3">{testimony.testimony}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  {testimony.createdAt ? formatTimestamp(testimony.createdAt) : "N/A"}
                                </span>
                                <div className="flex space-x-2">
                                  <button
                                    className="p-1 text-gray-600 hover:text-gray-900"
                                    onClick={() => handleViewTestimony(testimony)}
                                  >
                                    <Search size={16} />
                                  </button>
                                  {testimony.status === "pending" && (
                                    <>
                                      <button
                                        className="p-1 text-green-600 hover:text-green-900"
                                        onClick={() => handleApproveTestimony(testimony.id)}
                                        title="Approve"
                                      >
                                        <Check size={16} />
                                      </button>
                                      <button
                                        className="p-1 text-red-600 hover:text-red-900"
                                        onClick={() => handleRejectTestimony(testimony.id)}
                                        title="Reject"
                                      >
                                        <X size={16} />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    className={`p-1 ${
                                      testimony.featured
                                        ? "text-amber-600 hover:text-amber-900"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                                    onClick={() => handleToggleFeatured(testimony.id, testimony.featured)}
                                    title={testimony.featured ? "Unfeature" : "Feature"}
                                  >
                                    <Star size={16} fill={testimony.featured ? "currentColor" : "none"} />
                                  </button>
                                  <Link
                                    href={`/admin/testimonies/edit/${testimony.id}`}
                                    className="p-1 text-blue-600 hover:text-blue-900"
                                  >
                                    <Edit size={16} />
                                  </Link>
                                  <button
                                    className="p-1 text-red-600 hover:text-red-900"
                                    onClick={() => handleDeleteTestimony(testimony.id)}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Testimony Modal */}
      {selectedTestimony && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">Testimony Details</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="space-y-4">
                {selectedTestimony.image && (
                  <div className="relative h-64 w-full">
                    <Image
                      src={selectedTestimony.image || "/placeholder.svg"}
                      alt={selectedTestimony.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p className="font-medium">{selectedTestimony.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Location</h4>
                  <p>{selectedTestimony.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date Submitted</h4>
                  <p>{selectedTestimony.createdAt ? formatTimestamp(selectedTestimony.createdAt) : "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedTestimony.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedTestimony.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : selectedTestimony.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedTestimony.status || "Approved"}
                    </span>
                    {selectedTestimony.featured && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Testimony</h4>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                    {selectedTestimony.testimony}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t bg-gray-50 space-x-2">
              {selectedTestimony.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleApproveTestimony(selectedTestimony.id)
                      closeModal()
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleRejectTestimony(selectedTestimony.id)
                      closeModal()
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  handleToggleFeatured(selectedTestimony.id, selectedTestimony.featured)
                  closeModal()
                }}
                className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900"
              >
                {selectedTestimony.featured ? "Unfeature" : "Feature"}
              </button>
            </div>
          </div>
        </div>
      )}
    </RequireAuth>
  )
}
