"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth"
import { auth } from "@/lib/firebase-config"
import { AUTHORIZED_EMAILS } from "@/lib/firebase-config"
import type { Firestore } from "firebase/firestore"
import { db } from "@/lib/firebase-config"

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  checkingPermission: boolean
  isAuthorized: boolean | null
  signInWithGoogle: () => Promise<void>
  sendEmailLink: (email: string) => Promise<void>
  signInWithEmail: (email: string) => Promise<void>
  logOut: () => Promise<void>
  emailLinkSent: boolean
  emailForSignIn: string
  setEmailForSignIn: (email: string) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  checkingPermission: true,
  isAuthorized: null,
  signInWithGoogle: async () => {},
  sendEmailLink: async () => {},
  signInWithEmail: async () => {},
  logOut: async () => {},
  emailLinkSent: false,
  emailForSignIn: "",
  setEmailForSignIn: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkingPermission, setCheckingPermission] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [emailLinkSent, setEmailLinkSent] = useState(false)
  const [emailForSignIn, setEmailForSignIn] = useState("")

  // Check if user is authorized
  const checkAuthorization = (user: FirebaseUser | null) => {
    if (!user) {
      setIsAuthorized(false)
      return false
    }

    console.log("Checking authorization for:", user.email)
    console.log("Authorized emails:", AUTHORIZED_EMAILS)

    const authorized = AUTHORIZED_EMAILS.includes(user.email || "")
    console.log("Is authorized:", authorized)

    setIsAuthorized(authorized)
    return authorized
  }

  useEffect(() => {
    // Get stored email from localStorage on component mount
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("emailForSignIn")
      if (storedEmail) {
        setEmailForSignIn(storedEmail)
      }

      if (auth) {
        // Check if the URL contains an email sign-in link
        if (isSignInWithEmailLink(auth, window.location.href)) {
          // Get the email from localStorage (saved when sending the link)
          let email = window.localStorage.getItem("emailForSignIn")

          if (!email) {
            // If email is not in localStorage, prompt the user
            email = window.prompt("Please provide your email for confirmation")
          }

          if (email) {
            setLoading(true)
            // Sign in with the email link
            signInWithEmailLink(auth, email, window.location.href)
              .then((result) => {
                // Clear the email from storage
                window.localStorage.removeItem("emailForSignIn")
                // Clear the URL to remove the sign-in link
                window.history.replaceState({}, document.title, window.location.pathname)
                setUser(result.user)
                checkAuthorization(result.user)
              })
              .catch((error) => {
                console.error("Error signing in with email link:", error)
              })
              .finally(() => {
                setLoading(false)
                setCheckingPermission(false)
              })
          }
        }

        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log("Auth state changed:", user?.email)
          setUser(user)
          checkAuthorization(user)
          setLoading(false)
          setCheckingPermission(false)
        })

        return () => unsubscribe()
      }
    }
  }, [])

  const signInWithGoogle = async () => {
    if (typeof window !== "undefined" && auth) {
      try {
        setLoading(true)
        const googleProvider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, googleProvider)
        setUser(result.user)
        const isAuthorized = checkAuthorization(result.user)

        if (!isAuthorized) {
          // If not authorized, sign out immediately
          await signOut(auth)
          throw new Error("Email not authorized")
        }
      } catch (error) {
        console.error("Error signing in with Google:", error)
        throw error
      } finally {
        setLoading(false)
      }
    }
  }

  const sendEmailLink = async (email: string) => {
    if (typeof window !== "undefined" && auth) {
      try {
        setLoading(true)

        // First check if the email is authorized
        if (!AUTHORIZED_EMAILS.includes(email)) {
          console.error("Email not in authorized list:", email)
          throw new Error("Email not authorized")
        }

        const actionCodeSettings = {
          url: window.location.href,
          handleCodeInApp: true,
        }

        await sendSignInLinkToEmail(auth, email, actionCodeSettings)

        // Save the email in localStorage to use it later when signing in
        window.localStorage.setItem("emailForSignIn", email)
        setEmailForSignIn(email)
        setEmailLinkSent(true)
      } catch (error) {
        console.error("Error sending email link:", error)
        throw error
      } finally {
        setLoading(false)
      }
    }
  }

  const signInWithEmail = async (email: string) => {
    if (typeof window !== "undefined" && auth) {
      try {
        setLoading(true)
        // This function is for completing the email link sign-in process
        // The actual sign-in happens in the useEffect when the link is clicked
        console.log("Attempting to sign in with email:", email)
      } catch (error) {
        console.error("Error signing in with email:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const logOut = async () => {
    if (typeof window !== "undefined" && auth) {
      try {
        setLoading(true)
        await signOut(auth)
        setUser(null)
        setIsAuthorized(false)
      } catch (error) {
        console.error("Error signing out:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        checkingPermission,
        isAuthorized,
        signInWithGoogle,
        sendEmailLink,
        signInWithEmail,
        logOut,
        emailLinkSent,
        emailForSignIn,
        setEmailForSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const getDb = (): Firestore | null => {
  return db
}
