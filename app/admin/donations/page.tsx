"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, Trash2, Search, Target } from "lucide-react"
import {
  getDocuments,
  COLLECTIONS,
  deleteDocument,
  updateDocument,
  formatTimestamp,
  addDocument,
} from "@/lib/firebase-service"
import CircularLoader from "@/components/ui/circular-loader"
import RequireAuth from "@/components/admin/require-auth"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { collection, onSnapshot, query } from "firebase/firestore"
import { db } from "@/lib/firebase-config"

interface Donation {
  id?: string
  name: string
  email: string
  amount: number
  currency: string
  message?: string
  status: "pending" | "completed" | "failed"
  createdAt?: any
}

interface DonationTarget {
  id?: string
  current: number
  target: number
  title: string
  description?: string
  startDate?: any
  endDate?: any
}

export default function AdminDonationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [donations, setDonations] = useState<Donation[]>([])
  const [donationTarget, setDonationTarget] = useState<DonationTarget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditingTarget, setIsEditingTarget] = useState(false)
  const [targetFormData, setTargetFormData] = useState({
    target: 0,
    title: "",
    description: "",
  })

  useEffect(() => {
    // Fetch donation target
    const fetchDonationTarget = async () => {
      try {
        const target = await getDocuments(COLLECTIONS.DONATION_TARGETS)
        if (target.length > 0) {
          setDonationTarget(target[0])
          setTargetFormData({
            target: target[0].target || 0,
            title: target[0].title || "",
            description: target[0].description || "",
          })
        }
      } catch (err) {
        console.error("Error fetching donation target:", err)
      }
    }

    fetchDonationTarget()
  }, [])

  useEffect(() => {
    // Set up real-time listener for donations
    const q = query(collection(db, COLLECTIONS.DONATIONS))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Donation[] = []
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Donation)
        })

        // Sort donations client-side by createdAt date
        items.sort((a, b) => {
          if (!a.createdAt) return 1
          if (!b.createdAt) return -1
          const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : a.createdAt
          const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt
          return dateB - dateA // Sort in descending order (newest first)
        })

        setDonations(items)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching donations:", err)
        setError("Failed to load donations. Please try again.")
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const handleDeleteDonation = async (id?: string) => {
    if (!id) return

    if (confirm("Are you sure you want to delete this donation record? This action cannot be undone.")) {
      try {
        await deleteDocument(COLLECTIONS.DONATIONS, id)
      } catch (err) {
        console.error("Error deleting donation:", err)
        alert("Failed to delete donation. Please try again.")
      }
    }
  }

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTargetFormData((prev) => ({
      ...prev,
      [name]: name === "target" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleTargetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (donationTarget?.id) {
        // Update existing target
        await updateDocument(COLLECTIONS.DONATION_TARGETS, donationTarget.id, {
          ...targetFormData,
          updatedAt: new Date(),
        })
      } else {
        // Create new target
        await addDocument(COLLECTIONS.DONATION_TARGETS, {
          ...targetFormData,
          current: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }

      // Refresh donation target
      const targets = await getDocuments(COLLECTIONS.DONATION_TARGETS)
      if (targets.length > 0) {
        setDonationTarget(targets[0])
      }

      setIsEditingTarget(false)
    } catch (err) {
      console.error("Error updating donation target:", err)
      alert("Failed to update donation target. Please try again.")
    }
  }

  const calculateTotalDonations = () => {
    return donations.filter((d) => d.status === "completed").reduce((sum, donation) => sum + donation.amount, 0)
  }

  const filteredDonations = donations.filter((donation) => {
    return (
      donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.message && donation.message.toLowerCase().includes(searchTerm.toLowerCase()))
    )
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
                <h1 className="text-2xl font-bold">Donations</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium">Donation Records</h2>
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search donations..."
                        className="pl-10 p-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <CircularLoader size="lg" label="Loading donations..." />
                    </div>
                  ) : error ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md">
                      <p>{error}</p>
                    </div>
                  ) : (
                    <>
                      {filteredDonations.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                          <h3 className="text-lg font-medium text-gray-500 mb-2">No donations found</h3>
                          <p className="text-gray-400">
                            {searchTerm
                              ? "Try adjusting your search criteria"
                              : "Donations made through the website will appear here"}
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Donor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Amount
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
                              {filteredDonations.map((donation) => (
                                <tr key={donation.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{donation.name}</div>
                                      <div className="text-sm text-gray-500">{donation.email}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                      {donation.currency === "NGN" ? "₦" : "$"}
                                      {donation.amount.toLocaleString()}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {donation.createdAt ? formatTimestamp(donation.createdAt) : "N/A"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        donation.status === "completed"
                                          ? "bg-green-100 text-green-800"
                                          : donation.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {donation.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                      <button
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => handleDeleteDonation(donation.id)}
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

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium">Donation Target</h2>
                    <button
                      onClick={() => setIsEditingTarget(!isEditingTarget)}
                      className="text-amber-800 hover:text-amber-900"
                    >
                      <Edit size={18} />
                    </button>
                  </div>

                  {isEditingTarget ? (
                    <form onSubmit={handleTargetSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Campaign Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={targetFormData.title}
                          onChange={handleTargetChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter campaign title"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
                          Target Amount (₦)
                        </label>
                        <input
                          type="number"
                          id="target"
                          name="target"
                          value={targetFormData.target}
                          onChange={handleTargetChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter target amount"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={targetFormData.description}
                          onChange={handleTargetChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter campaign description"
                        ></textarea>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingTarget(false)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-amber-800 text-white rounded-md hover:bg-amber-900"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      {donationTarget ? (
                        <div className="space-y-4">
                          <h3 className="font-medium text-lg">{donationTarget.title || "Current Campaign"}</h3>

                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-amber-100 text-amber-800">
                                  Progress
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-amber-800">
                                  {donationTarget.target > 0
                                    ? Math.round((donationTarget.current / donationTarget.target) * 100)
                                    : 0}
                                  %
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-amber-200">
                              <div
                                style={{
                                  width: `${
                                    donationTarget.target > 0
                                      ? Math.min(
                                          Math.round((donationTarget.current / donationTarget.target) * 100),
                                          100,
                                        )
                                      : 0
                                  }%`,
                                }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-800"
                              ></div>
                            </div>
                          </div>

                          <div className="flex justify-between text-sm">
                            <div>
                              <p className="text-gray-500">Current</p>
                              <p className="font-bold text-lg">₦{donationTarget.current.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-500">Target</p>
                              <p className="font-bold text-lg">₦{donationTarget.target.toLocaleString()}</p>
                            </div>
                          </div>

                          {donationTarget.description && (
                            <div className="mt-4 text-sm text-gray-700">
                              <p>{donationTarget.description}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Target className="h-12 w-12 text-amber-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-700 mb-2">No donation target set</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Set a donation target to track progress on your fundraising campaigns
                          </p>
                          <button
                            onClick={() => setIsEditingTarget(true)}
                            className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900"
                          >
                            Set Target
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium mb-2">Donation Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Donations</span>
                        <span className="font-medium">₦{calculateTotalDonations().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of Donors</span>
                        <span className="font-medium">{donations.filter((d) => d.status === "completed").length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RequireAuth>
  )
}
