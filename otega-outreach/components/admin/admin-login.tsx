"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import CircularLoader from "@/components/ui/circular-loader"

export default function AdminLogin() {
  const { signInWithGoogle, sendEmailLink, emailLinkSent, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const authError = searchParams?.get("authError")

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      setStatusMessage("Authenticating with Google...")
      await signInWithGoogle()
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      setError(error.message || "Failed to sign in with Google. Please try again.")
      setStatusMessage(null)
    }
  }

  const handleEmailLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      setError(null)
      setStatusMessage("Sending authentication link...")
      await sendEmailLink(email)
      setStatusMessage("Authentication link sent! Please check your email.")
    } catch (error: any) {
      console.error("Email link sign-in error:", error)
      if (error.message.includes("not authorized")) {
        setError("This email is not authorized to access the admin area.")
      } else {
        setError(error.message || "Failed to send sign-in link. Please try again.")
      }
      setStatusMessage(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-800">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
        </div>

        {/* Display auth error from URL parameter */}
        {authError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{authError}</p>
          </div>
        )}

        {/* Display error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Display status message */}
        {statusMessage && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">
            <p>{statusMessage}</p>
          </div>
        )}

        {emailLinkSent ? (
          <div className="text-center p-4 bg-green-50 rounded-lg mb-4">
            <h3 className="font-medium text-green-700 mb-2">Email Link Sent!</h3>
            <p className="text-gray-600">
              Please check your email for the sign-in link. The link will expire after 24 hours.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70"
              >
                {loading ? (
                  <CircularLoader size="sm" className="mr-2" />
                ) : (
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Sign in with Google
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign in with email</span>
              </div>
            </div>

            <form onSubmit={handleEmailLinkSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70"
                >
                  {loading ? <CircularLoader size="sm" className="mr-2" /> : null}
                  Send Sign-in Link
                </button>
              </div>
            </form>
          </>
        )}

        <div className="mt-6 text-center text-xs text-gray-600">
          <p>Only authorized administrators can access this area.</p>
          <p className="mt-1">
            If you need access, please contact{" "}
            <a href="mailto:otegaevangelicaloutreach@gmail.com" className="text-amber-600 hover:text-amber-500">
              otegaevangelicaloutreach@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
