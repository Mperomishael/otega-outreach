"use client"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiYjJZXi1TTNkjXqeZV4QbXQjlbHDG9dU",
  authDomain: "otega-evangelical-outreach.firebaseapp.com",
  projectId: "otega-evangelical-outreach",
  storageBucket: "otega-evangelical-outreach.appspot.com",
  messagingSenderId: "1098979571490",
  appId: "1:1098979571490:web:9a9d3ec02be3f8b9a8d3a5",
  measurementId: "G-VQPB2DLDL0",
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
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// Authorized admin emails - ensure this includes the correct email
export const AUTHORIZED_EMAILS = ["otegaevangelicaloutreach@gmail.com", "empiredigitalsworldwide@gmail.com"]

export { app, auth, db, storage }
