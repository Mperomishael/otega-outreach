"use client"

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  increment,
  setDoc,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "./firebase-config"

// Collection names
export const COLLECTIONS = {
  EVANGELISTS: "evangelists",
  TESTIMONIES: "testimonies",
  PRAYER_REQUESTS: "prayerRequests",
  PHOTOS: "photos",
  VIDEOS: "videos",
  BLOG_POSTS: "blogPosts",
  DONATIONS: "donations",
  SETTINGS: "settings",
  NOTIFICATIONS: "notifications",
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

// Helper function to format timestamps
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A"

  try {
    // Handle Firestore Timestamp objects
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate()
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    }

    // Handle date strings
    if (typeof timestamp === "string") {
      const date = new Date(timestamp)
      if (!isNaN(date.getTime())) {
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(date)
      }
    }

    // Handle date objects
    if (timestamp instanceof Date) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(timestamp)
    }

    return String(timestamp)
  } catch (error) {
    console.error("Error formatting timestamp:", error)
    return "Invalid date"
  }
}

// Evangelists
export const addEvangelist = async (evangelistData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.EVANGELISTS), {
      ...evangelistData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, ...evangelistData }
  } catch (error) {
    console.error("Error adding evangelist:", error)
    throw error
  }
}

export const getEvangelists = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.EVANGELISTS), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting evangelists:", error)
    throw error
  }
}

export const getEvangelist = async (id) => {
  try {
    const docRef = doc(db, COLLECTIONS.EVANGELISTS, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error("Evangelist not found")
    }
  } catch (error) {
    console.error("Error getting evangelist:", error)
    throw error
  }
}

export const updateEvangelist = async (id, evangelistData) => {
  try {
    const docRef = doc(db, COLLECTIONS.EVANGELISTS, id)
    await updateDoc(docRef, {
      ...evangelistData,
      updatedAt: serverTimestamp(),
    })
    return { id, ...evangelistData }
  } catch (error) {
    console.error("Error updating evangelist:", error)
    throw error
  }
}

export const deleteEvangelist = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.EVANGELISTS, id))
    return id
  } catch (error) {
    console.error("Error deleting evangelist:", error)
    throw error
  }
}

// Testimonies
export const addTestimony = async (testimonyData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.TESTIMONIES), {
      ...testimonyData,
      approved: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, ...testimonyData }
  } catch (error) {
    console.error("Error adding testimony:", error)
    throw error
  }
}

export const getTestimonies = async (onlyApproved = false) => {
  try {
    let q
    if (onlyApproved) {
      q = query(collection(db, COLLECTIONS.TESTIMONIES), where("approved", "==", true), orderBy("createdAt", "desc"))
    } else {
      q = query(collection(db, COLLECTIONS.TESTIMONIES), orderBy("createdAt", "desc"))
    }
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting testimonies:", error)
    throw error
  }
}

export const approveTestimony = async (id) => {
  try {
    const docRef = doc(db, COLLECTIONS.TESTIMONIES, id)
    await updateDoc(docRef, {
      approved: true,
      updatedAt: serverTimestamp(),
    })
    return id
  } catch (error) {
    console.error("Error approving testimony:", error)
    throw error
  }
}

export const deleteTestimony = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.TESTIMONIES, id))
    return id
  } catch (error) {
    console.error("Error deleting testimony:", error)
    throw error
  }
}

// Prayer Requests
export const addPrayerRequest = async (prayerRequestData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PRAYER_REQUESTS), {
      ...prayerRequestData,
      status: "new",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, ...prayerRequestData }
  } catch (error) {
    console.error("Error adding prayer request:", error)
    throw error
  }
}

export const getPrayerRequests = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.PRAYER_REQUESTS), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting prayer requests:", error)
    throw error
  }
}

export const updatePrayerRequestStatus = async (id, status) => {
  try {
    const docRef = doc(db, COLLECTIONS.PRAYER_REQUESTS, id)
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    })
    return id
  } catch (error) {
    console.error("Error updating prayer request status:", error)
    throw error
  }
}

export const deletePrayerRequest = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PRAYER_REQUESTS, id))
    return id
  } catch (error) {
    console.error("Error deleting prayer request:", error)
    throw error
  }
}

// Photos
export const addPhoto = async (photoData, file) => {
  try {
    // Upload image to storage
    const storageRef = ref(storage, `photos/${Date.now()}_${file.name}`)
    await uploadBytes(storageRef, file)
    const imageUrl = await getDownloadURL(storageRef)

    // Add document to Firestore
    const docRef = await addDoc(collection(db, COLLECTIONS.PHOTOS), {
      ...photoData,
      imageUrl,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, ...photoData, imageUrl }
  } catch (error) {
    console.error("Error adding photo:", error)
    throw error
  }
}

export const getPhotos = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.PHOTOS), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting photos:", error)
    throw error
  }
}

export const getFeaturedPhotos = async (count = 6) => {
  try {
    const q = query(collection(db, COLLECTIONS.PHOTOS), orderBy("createdAt", "desc"), limit(count))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting featured photos:", error)
    throw error
  }
}

export const incrementPhotoViews = async (id) => {
  try {
    const docRef = doc(db, COLLECTIONS.PHOTOS, id)
    await updateDoc(docRef, {
      views: increment(1),
      updatedAt: serverTimestamp(),
    })
    return id
  } catch (error) {
    console.error("Error incrementing photo views:", error)
    throw error
  }
}

export const deletePhoto = async (id, imageUrl) => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, COLLECTIONS.PHOTOS, id))

    // Delete from Storage
    if (imageUrl) {
      const storageRef = ref(storage, imageUrl)
      await deleteObject(storageRef)
    }
    return id
  } catch (error) {
    console.error("Error deleting photo:", error)
    throw error
  }
}

// Videos
export const addVideo = async (videoData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.VIDEOS), {
      ...videoData,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, ...videoData }
  } catch (error) {
    console.error("Error adding video:", error)
    throw error
  }
}

export const getVideos = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.VIDEOS), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting videos:", error)
    throw error
  }
}

export const getFeaturedVideos = async (count = 3) => {
  try {
    const q = query(collection(db, COLLECTIONS.VIDEOS), orderBy("createdAt", "desc"), limit(count))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting featured videos:", error)
    throw error
  }
}

export const incrementVideoViews = async (id) => {
  try {
    const docRef = doc(db, COLLECTIONS.VIDEOS, id)
    await updateDoc(docRef, {
      views: increment(1),
      updatedAt: serverTimestamp(),
    })
    return id
  } catch (error) {
    console.error("Error incrementing video views:", error)
    throw error
  }
}

export const deleteVideo = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.VIDEOS, id))
    return id
  } catch (error) {
    console.error("Error deleting video:", error)
    throw error
  }
}

// Blog Posts
export const addBlogPost = async (blogPostData, featuredImage = null) => {
  try {
    let imageUrl = null

    // Upload featured image if provided
    if (featuredImage) {
      const storageRef = ref(storage, `blog/${Date.now()}_${featuredImage.name}`)
      await uploadBytes(storageRef, featuredImage)
      imageUrl = await getDownloadURL(storageRef)
    }

    // Add document to Firestore
    const docRef = await addDoc(collection(db, COLLECTIONS.BLOG_POSTS), {
      ...blogPostData,
      featuredImage: imageUrl,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return { id: docRef.id, ...blogPostData, featuredImage: imageUrl }
  } catch (error) {
    console.error("Error adding blog post:", error)
    throw error
  }
}

export const getBlogPosts = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.BLOG_POSTS), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting blog posts:", error)
    throw error
  }
}

export const getBlogPost = async (id) => {
  try {
    const docRef = doc(db, COLLECTIONS.BLOG_POSTS, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error("Blog post not found")
    }
  } catch (error) {
    console.error("Error getting blog post:", error)
    throw error
  }
}

export const updateBlogPost = async (id, blogPostData, featuredImage = null) => {
  try {
    const updateData = { ...blogPostData }

    // Upload new featured image if provided
    if (featuredImage) {
      const storageRef = ref(storage, `blog/${Date.now()}_${featuredImage.name}`)
      await uploadBytes(storageRef, featuredImage)
      updateData.featuredImage = await getDownloadURL(storageRef)
    }

    // Update document in Firestore
    const docRef = doc(db, COLLECTIONS.BLOG_POSTS, id)
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    })
    return { id, ...updateData }
  } catch (error) {
    console.error("Error updating blog post:", error)
    throw error
  }
}

export const incrementBlogPostViews = async (id) => {
  try {
    const docRef = doc(db, COLLECTIONS.BLOG_POSTS, id)
    await updateDoc(docRef, {
      views: increment(1),
      updatedAt: serverTimestamp(),
    })
    return id
  } catch (error) {
    console.error("Error incrementing blog post views:", error)
    throw error
  }
}

export const deleteBlogPost = async (id, featuredImage = null) => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, COLLECTIONS.BLOG_POSTS, id))

    // Delete featured image from Storage if exists
    if (featuredImage) {
      const storageRef = ref(storage, featuredImage)
      await deleteObject(storageRef)
    }
    return id
  } catch (error) {
    console.error("Error deleting blog post:", error)
    throw error
  }
}

// Donations
export const addDonation = async (donationData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.DONATIONS), {
      ...donationData,
      createdAt: serverTimestamp(),
    })
    return { id: docRef.id, ...donationData }
  } catch (error) {
    console.error("Error adding donation:", error)
    throw error
  }
}

export const getDonations = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.DONATIONS), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting donations:", error)
    throw error
  }
}

// Settings
export const updateSettings = async (settingsData) => {
  try {
    // Use a fixed document ID for settings
    const settingsId = "global"
    const docRef = doc(db, COLLECTIONS.SETTINGS, settingsId)

    // Check if settings document exists
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      // Update existing settings
      await updateDoc(docRef, {
        ...settingsData,
        updatedAt: serverTimestamp(),
      })
    } else {
      // Create new settings document
      await setDoc(docRef, {
        ...settingsData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    return { id: settingsId, ...settingsData }
  } catch (error) {
    console.error("Error updating settings:", error)
    throw error
  }
}

export const getSettings = async () => {
  try {
    const settingsId = "global"
    const docRef = doc(db, COLLECTIONS.SETTINGS, settingsId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      // Return default settings if none exist
      return { id: settingsId, theme: "light" }
    }
  } catch (error) {
    console.error("Error getting settings:", error)
    throw error
  }
}

// Notifications
export const addNotification = async (notificationData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
      ...notificationData,
      read: false,
      createdAt: serverTimestamp(),
    })
    return { id: docRef.id, ...notificationData }
  } catch (error) {
    console.error("Error adding notification:", error)
    throw error
  }
}

export const getNotifications = async (onlyUnread = false) => {
  try {
    let q
    if (onlyUnread) {
      q = query(collection(db, COLLECTIONS.NOTIFICATIONS), where("read", "==", false), orderBy("createdAt", "desc"))
    } else {
      q = query(collection(db, COLLECTIONS.NOTIFICATIONS), orderBy("createdAt", "desc"))
    }
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting notifications:", error)
    throw error
  }
}

export const markNotificationAsRead = async (id) => {
  try {
    const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, id)
    await updateDoc(docRef, {
      read: true,
      updatedAt: serverTimestamp(),
    })
    return id
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

export const deleteNotification = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id))
    return id
  } catch (error) {
    console.error("Error deleting notification:", error)
    throw error
  }
}
