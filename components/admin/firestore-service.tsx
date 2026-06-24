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
} from "firebase/firestore"
import { getDb } from "./auth-provider"

// Generic type for Firestore data
export interface FirestoreData {
  id?: string
  [key: string]: any
}

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
}

// Add a document to a collection
export const addDocument = async <T extends FirestoreData>(collectionName: string, data: T): Promise<string> => {
  const db = getDb()
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

// Update a document
export const updateDocument = async <T extends FirestoreData>(
  collectionName: string,
  docId: string,
  data: Partial<T>,
): Promise<void> => {
  const db = getDb()
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
  const db = getDb()
  if (!db) throw new Error("Firestore not initialized")

  const docRef = doc(db, collectionName, docId)
  await deleteDoc(docRef)
}

// Get a document by ID
export const getDocument = async <T extends FirestoreData>(
  collectionName: string,
  docId: string,
): Promise<T | null> => {
  const db = getDb()
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
  const db = getDb()
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
  const db = getDb()
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
