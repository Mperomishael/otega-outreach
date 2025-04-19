"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  type Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { useAuth } from "@/components/admin/auth-provider"
import RequireAuth from "@/components/admin/require-auth"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import CircularLoader from "@/components/ui/circular-loader"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: Timestamp
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchNotifications()
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return

    try {
      setLoading(true)
      const notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid || "admin"),
        orderBy("createdAt", "desc"),
      )

      const notificationsSnapshot = await getDocs(notificationsQuery)
      const notificationsList: Notification[] = []

      notificationsSnapshot.forEach((doc) => {
        notificationsList.push({ id: doc.id, ...doc.data() } as Notification)
      })

      setNotifications(notificationsList)
    } catch (err) {
      console.error("Error fetching notifications:", err)
      setError("Failed to load notifications. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), {
        read: true,
      })

      // Update local state
      setNotifications(
        notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      )
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notifications", id))

      // Update local state
      setNotifications(notifications.filter((notification) => notification.id !== id))
    } catch (err) {
      console.error("Error deleting notification:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((notification) => !notification.read)

      // Update each unread notification
      for (const notification of unreadNotifications) {
        await updateDoc(doc(db, "notifications", notification.id), {
          read: true,
        })
      }

      // Update local state
      setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
    }
  }

  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp) return ""

    const date = timestamp.toDate()
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bell className="h-6 w-6 text-amber-800" />
                  <h1 className="text-2xl font-bold">Notifications</h1>
                </div>

                {notifications.some((notification) => !notification.read) && (
                  <button onClick={markAllAsRead} className="text-sm text-amber-800 hover:text-amber-900">
                    Mark all as read
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-md">
                  <p>{error}</p>
                </div>
              )}

              <div className="bg-white p-6 rounded-lg shadow-sm">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <CircularLoader size="md" label="Loading notifications..." />
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`py-4 ${!notification.read ? "bg-amber-50" : ""}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                              <p className="text-sm text-gray-500">{formatTimestamp(notification.createdAt)}</p>
                            </div>
                            <p className="mt-1 text-gray-600">{notification.message}</p>
                          </div>
                          <div className="ml-4 flex space-x-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-green-600 hover:text-green-800"
                                title="Mark as read"
                              >
                                <Check size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Delete notification"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
                    <p className="mt-1 text-gray-500">You don't have any notifications at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </RequireAuth>
  )
}
