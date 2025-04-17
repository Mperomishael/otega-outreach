"use client"

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  setDoc,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "./firebase-config"

// Collection names
export const COLLECTIONS = {
  VIDEOS: "videos",
  PHOTOS: "photos",
  BLOG_POSTS: "blogPosts",
  TESTIMONIES: "testimonies",
  EVANGELISTS: "evangelists",
  PARTNERS: "partners",
  PRAYER_REQUESTS: "prayerRequests",
  DONATIONS: "donations",
  SETTINGS: "settings",
  OUTREACH: "outreach",
}

// Generic type for Firestore data
export interface FirestoreData {
  id?: string
  [key: string]: any
}

// Add a document to a collection
export const addDocument = async <T extends FirestoreData>(collectionName: string, data: T): Promise<string> => {
  if (!db) throw new Error("Firestore not initialized")

  // Add timestamp
  const dataWithTimestamp = {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  const docRef = await addDoc(collection(db, collectionName), dataWithTimestamp)
  return docRef.id
}

// Add a document with a specific ID
export const setDocument = async <T extends FirestoreData>(
  collectionName: string,
  docId: string,
  data: T,
): Promise<void> => {
  if (!db) throw new Error("Firestore not initialized")

  // Add timestamp
  const dataWithTimestamp = {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  await setDoc(doc(db, collectionName, docId), dataWithTimestamp)
}

// Update a document
export const updateDocument = async <T extends FirestoreData>(
  collectionName: string,
  docId: string,
  data: Partial<T>,
): Promise<void> => {
  if (!db) throw new Error("Firestore not initialized")

  // Add updated timestamp
  const dataWithTimestamp = {
    ...data,
    updatedAt: Timestamp.now(),
  }

  const docRef = doc(db, collectionName, docId)
  await updateDoc(docRef, dataWithTimestamp)
}

// Delete a document
export const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
  if (!db) throw new Error("Firestore not initialized")

  const docRef = doc(db, collectionName, docId)
  await deleteDoc(docRef)
}

// Get a document by ID
export const getDocument = async <T extends FirestoreData>(
  collectionName: string,
  docId: string,
): Promise<T | null> => {
  if (!db) throw new Error("Firestore not initialized")

  const docRef = doc(db, collectionName, docId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T
  } else {
    return null
  }
}

// Get all documents from a collection
export const getDocuments = async <T extends FirestoreData>(collectionName: string): Promise<T[]> => {
  if (!db) throw new Error("Firestore not initialized")

  const querySnapshot = await getDocs(collection(db, collectionName))
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
}

// Query documents with filters
export const queryDocuments = async <T extends FirestoreData>(
  collectionName: string,
  filters: { field: string; operator: "==" | "!=" | ">" | ">=" | "<" | "<="; value: any }[],
  orderByField?: string,
  orderDirection?: "asc" | "desc",
  limitCount?: number,
): Promise<T[]> => {
  if (!db) throw new Error("Firestore not initialized")

  let q = collection(db, collectionName)

  // Apply filters
  filters.forEach((filter) => {
    q = query(q, where(filter.field, filter.operator, filter.value))
  })

  // Apply ordering if specified
  if (orderByField) {
    q = query(q, orderBy(orderByField, orderDirection || "asc"))
  }

  // Apply limit if specified
  if (limitCount) {
    q = query(q, limit(limitCount))
  }

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
}

// Upload a file to Firebase Storage
export const uploadFile = async (path: string, file: File): Promise<string> => {
  if (!storage) throw new Error("Firebase Storage not initialized")

  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return await getDownloadURL(storageRef)
}

// Delete a file from Firebase Storage
export const deleteFile = async (path: string): Promise<void> => {
  if (!storage) throw new Error("Firebase Storage not initialized")

  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

// Convert Firestore timestamp to date string
export const formatTimestamp = (timestamp: Timestamp | any): string => {
  if (!timestamp) return "N/A"

  try {
    let date: Date
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate()
    } else if (timestamp.seconds && timestamp.nanoseconds) {
      // Handle cases where timestamp is an object with seconds and nanoseconds
      date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
    } else {
      // Attempt to create a Date object directly if it's a number
      date = new Date(timestamp)
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting timestamp:", error)
    return "Invalid Date"
  }
}
