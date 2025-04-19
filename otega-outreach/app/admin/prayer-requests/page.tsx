"use client"

import { useState, useEffect } from "react"
import { Trash2, Search, Filter, Mail, Check, X } from "lucide-react"
import { COLLECTIONS, deleteDocument, formatTimestamp, updateDocument } from "@/lib/firebase-service"
import CircularLoader from "@/components/ui/circular-loader"
import RequireAuth from "@/components/admin/require-auth"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { collection, onSnapshot, query } from "firebase/firestore"
import { db } from "@/lib/firebase-config"

interface PrayerRequest {
  id?: string
  name: string
  email?: string
  phone?: string
  request: string
  isPrivate: boolean
  status: "new" | "in-progress" | "completed"
  createdAt?: any
  adminNotes?: string
}

export default function AdminPrayerRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null)
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    setLoading(true)

    // Create a query without orderBy to avoid index requirement
    const q = query(collection(db, COLLECTIONS.PRAYER_REQUESTS))

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: PrayerRequest[] = []
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as PrayerRequest)
        })

        // Sort prayer requests client-side by createdAt date
        items.sort((a, b) => {
          if (!a.createdAt) return 1
          if (!b.createdAt) return -1
          const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : a.createdAt
          const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt
          return dateB - dateA // Sort in descending order (newest first)
        })

        setPrayerRequests(items)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching prayer requests:", err)
        setError("Failed to load prayer requests. Please try again.")
        setLoading(false)
      },
    )

    // Clean up listener on unmount
    return () => unsubscribe()
  }, [])

  const handleDeleteRequest = async (id?: string) => {
    if (!id) return

    if (confirm("Are you sure you want to delete this prayer request? This action cannot be undone.")) {
      try {
        await deleteDocument(COLLECTIONS.PRAYER_REQUESTS, id)
        // No need to update state as the listener will handle it
      } catch (err) {
        console.error("Error deleting prayer request:", err)
        alert("Failed to delete prayer request. Please try again.")
      }
    }
  }

  const handleStatusChange = async (id: string | undefined, status: "new" | "in-progress" | "completed") => {
    if (!id) return

    try {
      await updateDocument(COLLECTIONS.PRAYER_REQUESTS, id, { status })
    } catch (err) {
      console.error("Error updating prayer request status:", err)
      alert("Failed to update status. Please try again.")
    }
  }

  const handleViewRequest = (request: PrayerRequest) => {
    setSelectedRequest(request)
    setAdminNotes(request.adminNotes || "")
  }

  const handleCloseModal = () => {
    setSelectedRequest(null)
    setAdminNotes("")
  }

  const handleSaveNotes = async () => {
    if (!selectedRequest?.id) return

    try {
      await updateDocument(COLLECTIONS.PRAYER_REQUESTS, selectedRequest.id, { adminNotes })
      alert("Notes saved successfully")
    } catch (err) {
      console.error("Error saving admin notes:", err)
      alert("Failed to save notes. Please try again.")
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredRequests = prayerRequests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.request.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.email && request.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (request.phone && request.phone.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

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
                <h1 className="text-2xl font-bold">Prayer Requests</h1>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search prayer requests..."
                      className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    <select
                      className="p-2 border border-gray-300 rounded-md"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <CircularLoader size="lg" label="Loading prayer requests..." />
                  </div>
                ) : error ? (
                  <div className="bg-red-100 text-red-700 p-4 rounded-md">
                    <p>{error}</p>
                  </div>
                ) : (
                  <>
                    {filteredRequests.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-500 mb-2">No prayer requests found</h3>
                        <p className="text-gray-400">
                          {searchTerm || statusFilter !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "Prayer requests submitted through the website will appear here"}
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Request
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
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
                            {filteredRequests.map((request) => (
                              <tr key={request.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{request.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {request.email && (
                                        <a href={`mailto:${request.email}`} className="flex items-center text-blue-600">
                                          <Mail size={12} className="mr-1" />
                                          {request.email}
                                        </a>
                                      )}
                                      {request.phone && <div>{request.phone}</div>}
                                    </div>
                                    {request.isPrivate && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                        Private
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900 line-clamp-2">{request.request}</div>
                                  <button
                                    onClick={() => handleViewRequest(request)}
                                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                  >
                                    View full request
                                  </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {request.createdAt ? formatTimestamp(request.createdAt) : "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                                      request.status,
                                    )}`}
                                  >
                                    {request.status === "new"
                                      ? "New"
                                      : request.status === "in-progress"
                                        ? "In Progress"
                                        : "Completed"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    {request.status === "new" && (
                                      <button
                                        onClick={() => handleStatusChange(request.id, "in-progress")}
                                        className="text-yellow-600 hover:text-yellow-900"
                                        title="Mark as In Progress"
                                      >
                                        <Mail size={18} />
                                      </button>
                                    )}
                                    {request.status === "in-progress" && (
                                      <button
                                        onClick={() => handleStatusChange(request.id, "completed")}
                                        className="text-green-600 hover:text-green-900"
                                        title="Mark as Completed"
                                      >
                                        <Check size={18} />
                                      </button>
                                    )}
                                    <button
                                      className="text-red-600 hover:text-red-900"
                                      onClick={() => handleDeleteRequest(request.id)}
                                      title="Delete Request"
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
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Prayer Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">Prayer Request Details</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">From</h4>
                  <p className="font-medium">{selectedRequest.name}</p>
                  {selectedRequest.email && (
                    <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 text-sm">
                      {selectedRequest.email}
                    </a>
                  )}
                  {selectedRequest.phone && <p className="text-sm">{selectedRequest.phone}</p>}
                  {selectedRequest.isPrivate && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                      Private
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date Submitted</h4>
                  <p>{selectedRequest.createdAt ? formatTimestamp(selectedRequest.createdAt) : "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, "new")}
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        selectedRequest.status === "new"
                          ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                          : "bg-gray-100 text-gray-800 hover:bg-blue-50"
                      }`}
                    >
                      New
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, "in-progress")}
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        selectedRequest.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                          : "bg-gray-100 text-gray-800 hover:bg-yellow-50"
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, "completed")}
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        selectedRequest.status === "completed"
                          ? "bg-green-100 text-green-800 border-2 border-green-300"
                          : "bg-gray-100 text-gray-800 hover:bg-green-50"
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Prayer Request</h4>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">{selectedRequest.request}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Admin Notes</h4>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Add private notes about this prayer request..."
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </RequireAuth>
  )
}
