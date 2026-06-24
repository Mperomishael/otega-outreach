"use client"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB30iJ7xaBE7c0EoX4wBVhjW-xewwaXNg0",
  authDomain: "otega-outreach.firebaseapp.com",
  projectId: "otega-outreach",
  storageBucket: "otega-outreach.firebasestorage.app",
  messagingSenderId: "943328346091",
  appId: "1:943328346091:web:1c5400d2998e48459063ae"
}

// Initialize Firebase
let app
let auth
let db
let storage

// Only initialize Firebase on the client side
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)

    // Set persistence to local for better user experience
    // This helps maintain the session even if the page is refreshed
    auth.setPersistence("local").catch((error) => {
      console.error("Error setting auth persistence:", error)
    })
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

export const AUTHORIZED_EMAILS = [
  "otegaevangelicaloutreach@gmail.com",
  "empiredigitalsworldwide@gmail.com",
  "letstalk2@mishael@gmail.com",
  "otegaconcept@gmail.com",   // ← Added
  // Add any additional authorized emails here
]

export { app, auth, db, storage }
