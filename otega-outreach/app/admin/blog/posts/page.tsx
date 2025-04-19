"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, Search, Filter, ArrowUpDown, Eye } from "lucide-react"
import { getDocuments, deleteDocument, COLLECTIONS } from "@/lib/firebase-service"
import RequireAuth from "@/components/admin/require-auth"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import LoadingSpinner from "@/components/admin/loading-spinner"

interface BlogPost {
  id: string
  title: string
  summary: string
  content: string
  imageUrl: string
  published: boolean
  author: string
  views: number
  createdAt: any
}

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [publishedFilter, setPublishedFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    setLoading(true)
    setError("")
    try {
      const fetchedPosts = await getDocuments<BlogPost>(COLLECTIONS.BLOG_POSTS)

      // Sort posts by createdAt date (newest first by default)
      const sortedPosts = fetchedPosts.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
        return sortOrder === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
      })

      setPosts(sortedPosts)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      setError("Failed to load blog posts. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      setIsDeleting(true)
      try {
        await deleteDocument(COLLECTIONS.BLOG_POSTS, id)
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))
      } catch (error) {
        console.error("Error deleting blog post:", error)
        setError("Failed to delete blog post. Please try again.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc"
    setSortOrder(newOrder)

    // Re-sort the current posts
    setPosts((prevPosts) =>
      [...prevPosts].sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
        return newOrder === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
      }),
    )
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPublished =
      publishedFilter === "all" ||
      (publishedFilter === "published" && post.published) ||
      (publishedFilter === "draft" && !post.published)
    return matchesSearch && matchesPublished
  })

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown date"

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold">Blog Posts</h1>
              <Link
                href="/admin/blog/new"
                className="flex items-center gap-2 bg-amber-800 text-white px-4 py-2 rounded-md hover:bg-amber-900 transition-colors"
              >
                <Plus size={18} />
                <span>Add New Post</span>
              </Link>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
                <p>{error}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-4 border-b">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search blog posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        value={publishedFilter}
                        onChange={(e) => setPublishedFilter(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none bg-white"
                      >
                        <option value="all">All Posts</option>
                        <option value="published">Published</option>
                        <option value="draft">Drafts</option>
                      </select>
                    </div>
                    <button
                      onClick={toggleSortOrder}
                      className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <ArrowUpDown size={18} />
                      <span className="hidden sm:inline">{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <LoadingSpinner />
                  <p className="mt-4 text-gray-500">Loading blog posts...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No blog posts found. Create your first post to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 mr-3">
                                <Image
                                  src={post.imageUrl || "/placeholder.svg"}
                                  alt={post.title}
                                  width={40}
                                  height={40}
                                  className="rounded object-cover"
                                />
                              </div>
                              <div className="max-w-xs">
                                <div className="text-sm font-medium text-gray-900 truncate">{post.title}</div>
                                <div className="text-sm text-gray-500 truncate">{post.summary}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(post.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Eye size={14} className="mr-1 text-gray-400" />
                              {post.views || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/admin/blog/edit/${post.id}`}
                                className="text-amber-800 hover:text-amber-900"
                              >
                                <Edit size={18} />
                              </Link>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                disabled={isDeleting}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </RequireAuth>
  )
}
