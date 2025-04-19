"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Users, Video, FileText, MessageSquare, DollarSign, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import AdminHeader from "./admin-header"
import AdminSidebar from "./admin-sidebar"
import CircularLoader from "@/components/ui/circular-loader"
import { getDocuments, COLLECTIONS } from "@/lib/firebase-service"

interface DashboardStat {
  name: string
  value: number | string
  icon: React.ReactNode
  loading: boolean
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStat[]>([
    { name: "Total Videos", value: 0, icon: <Video className="text-blue-500" />, loading: true },
    { name: "Blog Posts", value: 0, icon: <FileText className="text-green-500" />, loading: true },
    { name: "Prayer Requests", value: 0, icon: <MessageSquare className="text-purple-500" />, loading: true },
    { name: "Donations", value: "₦0", icon: <DollarSign className="text-amber-500" />, loading: true },
  ])
  const [recentActivities, setRecentActivities] = useState<{ action: string; time: string }[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch videos count
        const videos = await getDocuments(COLLECTIONS.VIDEOS)

        // Fetch blog posts count
        const blogPosts = await getDocuments(COLLECTIONS.BLOG_POSTS)

        // Fetch prayer requests count
        const prayerRequests = await getDocuments(COLLECTIONS.PRAYER_REQUESTS)

        // Fetch donations
        const donations = await getDocuments(COLLECTIONS.DONATIONS)
        const totalDonations = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0)

        // Update stats
        setStats([
          { name: "Total Videos", value: videos.length, icon: <Video className="text-blue-500" />, loading: false },
          {
            name: "Blog Posts",
            value: blogPosts.length,
            icon: <FileText className="text-green-500" />,
            loading: false,
          },
          {
            name: "Prayer Requests",
            value: prayerRequests.length,
            icon: <MessageSquare className="text-purple-500" />,
            loading: false,
          },
          {
            name: "Donations",
            value: `₦${totalDonations.toLocaleString()}`,
            icon: <DollarSign className="text-amber-500" />,
            loading: false,
          },
        ])

        // Create recent activities from all collections
        const allActivities = [
          ...prayerRequests.map((pr) => ({
            action: `New prayer request: ${pr.name}`,
            time: pr.createdAt ? new Date(pr.createdAt.seconds * 1000).toLocaleString() : "Unknown",
            timestamp: pr.createdAt ? pr.createdAt.seconds : 0,
          })),
          ...donations.map((d) => ({
            action: `Donation received: ₦${d.amount}`,
            time: d.createdAt ? new Date(d.createdAt.seconds * 1000).toLocaleString() : "Unknown",
            timestamp: d.createdAt ? d.createdAt.seconds : 0,
          })),
          ...videos.map((v) => ({
            action: `New video uploaded: ${v.title}`,
            time: v.createdAt ? new Date(v.createdAt.seconds * 1000).toLocaleString() : "Unknown",
            timestamp: v.createdAt ? v.createdAt.seconds : 0,
          })),
          ...blogPosts.map((bp) => ({
            action: `Blog post published: ${bp.title}`,
            time: bp.createdAt ? new Date(bp.createdAt.seconds * 1000).toLocaleString() : "Unknown",
            timestamp: bp.createdAt ? bp.createdAt.seconds : 0,
          })),
        ]

        // Sort by timestamp (most recent first) and take the first 5
        const sortedActivities = allActivities
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 5)
          .map(({ action, time }) => ({ action, time }))

        setRecentActivities(
          sortedActivities.length > 0 ? sortedActivities : [{ action: "No recent activities", time: "N/A" }],
        )
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                | {currentTime.toLocaleTimeString()}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Welcome back, {user?.displayName || "Administrator"}!</h2>
              <p className="text-gray-600">
                This is your admin dashboard for managing the Otega Evangelical Outreach website. Use the navigation
                menu to manage different aspects of the site.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.name}</p>
                      {stat.loading ? <CircularLoader size="sm" /> : <p className="text-2xl font-bold">{stat.value}</p>}
                    </div>
                    <div className="p-3 bg-gray-50 rounded-full">{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Recent Activities</h2>
                  <button className="text-sm text-amber-800">View All</button>
                </div>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <CircularLoader label="Loading activities..." />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100">
                        <div className="p-2 bg-amber-50 rounded-full">
                          <TrendingUp size={16} className="text-amber-800" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Quick Actions</h2>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/admin/blog/new"
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <FileText size={18} />
                    <span>Create New Blog Post</span>
                  </Link>
                  <Link
                    href="/admin/media/videos/new"
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Video size={18} />
                    <span>Upload New Video</span>
                  </Link>
                  <Link
                    href="/admin/prayer-requests"
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <MessageSquare size={18} />
                    <span>View Prayer Requests</span>
                  </Link>
                  <Link
                    href="/admin/evangelists"
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Users size={18} />
                    <span>Manage Evangelists</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Calendar size={18} />
                    <span>Schedule Outreach</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
