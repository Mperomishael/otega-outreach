"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import CircularLoader from "@/components/ui/circular-loader"

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading, checkingPermission, isAuthorized } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only redirect if we're on the client and not loading
    if (isClient && !loading && !checkingPermission) {
      if (!user) {
        // User is not logged in, redirect to login page
        console.log("User not logged in, redirecting to login")
        router.push("/admin/login")
      } else if (!isAuthorized) {
        // User is logged in but not authorized, redirect to login with error
        console.log("User not authorized, redirecting to login with error")
        router.push("/admin/login?authError=You are not authorized to access this area")
      }
    }
  }, [user, loading, checkingPermission, isAuthorized, router, isClient])

  // Show loading state while checking auth
  if (loading || checkingPermission || !isClient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <CircularLoader size="lg" />
        <p className="mt-4 text-gray-600">Verifying authentication...</p>
      </div>
    )
  }

  // If user is authenticated and authorized, render children
  if (user && isAuthorized) {
    return <>{children}</>
  }

  // This should not be visible as we redirect in the useEffect
  return null
}
