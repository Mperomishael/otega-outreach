"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import CircularLoader from "@/components/ui/circular-loader"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  date: string
  author: string
  slug: string
  category: string
  content: string
  published: boolean
}

interface Category {
  name: string
  count: number
}

export default function BlogClientPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        setLoading(true)
        const blogQuery = query(
          collection(db, "blog"),
          where("published", "==", true),
          orderBy("date", "desc"),
          limit(10),
        )

        const querySnapshot = await getDocs(blogQuery)
        const posts: BlogPost[] = []
        const categoryMap = new Map<string, number>()

        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<BlogPost, "id">
          const post = {
            id: doc.id,
            ...data,
            date: data.date ? new Date(data.date.toDate()).toLocaleDateString() : "No date",
          }
          posts.push(post as BlogPost)

          // Count categories
          if (data.category) {
            const currentCount = categoryMap.get(data.category) || 0
            categoryMap.set(data.category, currentCount + 1)
          }
        })

        setBlogPosts(posts)

        // Create categories array with counts
        const categoriesArray: Category[] = [{ name: "All", count: posts.length }]
        categoryMap.forEach((count, name) => {
          categoriesArray.push({ name, count })
        })
        setCategories(categoriesArray)
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError("Failed to load blog posts. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Nigerian Rural Revival Stories</h1>
      <p className="text-center text-gray-700 mb-8">
        Stories of Kingdom Impact and Spiritual Transformation Across Rural Nigeria
      </p>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 text-center">{error}</div>}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <CircularLoader />
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={post.imageUrl || "/placeholder.svg?height=400&width=600"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-amber-800 text-white px-3 py-1 text-sm">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                    <div className="flex items-center text-sm text-gray-600 mb-3 gap-4">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        {post.author}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-amber-800 hover:text-amber-900"
                    >
                      Read More <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-amber-50 rounded-lg">
              <h3 className="text-xl font-medium text-amber-800 mb-2">No Blog Posts Yet</h3>
              <p className="text-gray-600">
                Our team is working on creating inspiring content. Check back soon for stories of our outreach work!
              </p>
            </div>
          )}

          {blogPosts.length > 0 && (
            <div className="mt-8 text-center">
              <button className="px-6 py-2 border border-amber-800 text-amber-800 rounded-md hover:bg-amber-50 transition-colors">
                Load More Posts
              </button>
            </div>
          )}
        </div>

        <div className="md:w-1/4">
          <div className="bg-amber-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4 border-b border-amber-200 pb-2">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name} className="flex justify-between items-center">
                  <Link href={`/blog/category/${category.name.toLowerCase()}`} className="hover:text-amber-800">
                    {category.name}
                  </Link>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">{category.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="mb-4 text-sm">
              Stay updated with the latest stories of Holy Spirit-powered outreach and spiritual transformation from our
              work in rural Nigerian villages.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter your email address"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-amber-800 text-white font-medium rounded-md hover:bg-amber-900 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
