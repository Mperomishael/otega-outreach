"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, Settings, LogOut, Book, Menu } from "lucide-react"
import { useAuth } from "./auth-provider"
import { collection, onSnapshot, query, where, orderBy, limit, type Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase-config"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: Timestamp
}

export default function AdminHeader() {
  const { user, signOut } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    if (!user) return

    // Set up listener for notifications
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid || "admin"),
      orderBy("createdAt", "desc"),
      limit(10),
    )

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsList: Notification[] = []
      snapshot.forEach((doc) => {
        notificationsList.push({ id: doc.id, ...doc.data() } as Notification)
      })

      setNotifications(notificationsList)
      setUnreadCount(notificationsList.filter((n) => !n.read).length)
    })

    return () => unsubscribe()
  }, [user])

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    if (showUserMenu) setShowUserMenu(false)
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
    if (showNotifications) setShowNotifications(false)
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp) return ""

    const date = timestamp.toDate()
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMins / 60)
    const diffDays = Math.round(diffHours / 24)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin" className="flex items-center">
                <Book className="h-8 w-8 text-amber-800" />
                <span className="ml-2 text-xl font-bold text-gray-900">Admin Dashboard</span>
              </Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Notifications */}
            <div className="relative ml-3">
              <button
                type="button"
                className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={toggleNotifications}
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1 divide-y divide-gray-100">
                    <div className="px-4 py-2 flex justify-between items-center">
                      <h3 className="text-sm font-medium">Notifications</h3>
                      <button className="text-xs text-amber-800 hover:text-amber-900">Mark all as read</button>
                    </div>

                    {notifications.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? "bg-amber-50" : ""}`}
                          >
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500">{formatTimestamp(notification.createdAt)}</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-gray-500">No notifications yet</p>
                      </div>
                    )}

                    <div className="px-4 py-2 text-center">
                      <Link href="/admin/notifications" className="text-xs text-amber-800 hover:text-amber-900">
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="relative ml-3">
              <Link
                href="/admin/settings"
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <Settings className="h-6 w-6" />
              </Link>
            </div>

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <button
                type="button"
                className="flex items-center max-w-xs rounded-full text-sm focus:outline-none"
                onClick={toggleUserMenu}
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 relative">
                  <Image
                    src="https://i.ibb.co/N2dpNgsL/photo-6021658356923614950-y.jpg"
                    alt="Admin"
                    fill
                    className="object-cover"
                  />
                </div>
              </button>

              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <p className="font-medium">{user?.displayName || "Administrator"}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <hr />
                    <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 relative">
                  <Image
                    src="https://i.ibb.co/N2dpNgsL/photo-6021658356923614950-y.jpg"
                    alt="Admin"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.displayName || "Administrator"}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
              <div className="ml-auto flex space-x-2">
                <button
                  type="button"
                  className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={toggleNotifications}
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <Link
                  href="/admin/settings"
                  className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <Settings className="h-6 w-6" />
                </Link>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/admin/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Your Profile
              </Link>
              <Link
                href="/admin/settings"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Settings
              </Link>
              <button
                onClick={signOut}
                className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile notifications */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 overflow-hidden sm:hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={toggleNotifications}></div>
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto">
                  <div className="py-6 px-4 bg-amber-800 sm:px-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-white">Notifications</h2>
                      <button
                        type="button"
                        className="rounded-md text-white hover:text-gray-200 focus:outline-none"
                        onClick={toggleNotifications}
                      >
                        <span className="sr-only">Close panel</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className={`px-4 py-4 ${!notification.read ? "bg-amber-50" : ""}`}>
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500">{formatTimestamp(notification.createdAt)}</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-12 text-center">
                        <p className="text-gray-500">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
