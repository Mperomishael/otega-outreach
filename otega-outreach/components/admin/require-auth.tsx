"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import AdminLogin from "./admin-login"
import CircularLoader from "@/components/ui/circular-loader"

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading, checkingPermission, isAuthorized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not loading and not authorized, redirect to login
    if (!loading && !checkingPermission && user && !isAuthorized) {
      router.push("/admin?authError=You%20are%20not%20authorized%20to%20access%20this%20area")
    }
  }, [loading, checkingPermission, user, isAuthorized, router])

  // Show loading state
  if (loading || checkingPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <CircularLoader size="lg" />
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show login
  if (!user) {
    return <AdminLogin />
  }

  // If authenticated but not authorized
  if (!isAuthorized) {
    return <AdminLogin />
  }

  // If authenticated and authorized, show children
  return <>{children}</>
}
