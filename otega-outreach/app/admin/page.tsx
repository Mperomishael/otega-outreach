"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/admin/auth-provider"
import AdminDashboard from "@/components/admin/admin-dashboard"
import AdminLogin from "@/components/admin/admin-login"
import CircularLoader from "@/components/ui/circular-loader"

export default function AdminPage() {
  const { user, loading, isAuthorized, checkingPermission } = useAuth()
  const router = useRouter()

  if (loading || checkingPermission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularLoader size="lg" label="Authenticating..." />
      </div>
    )
  }

  if (!user || isAuthorized === false) {
    return <AdminLogin />
  }

  if (isAuthorized) {
    return <AdminDashboard />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="mb-6">
          Your email ({user?.email}) is not authorized to access this admin panel. Please contact the administrator for
          assistance.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  )
}
