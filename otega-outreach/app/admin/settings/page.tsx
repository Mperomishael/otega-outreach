"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Save, RefreshCw } from "lucide-react"
import { getDocument, updateDocument, addDocument, COLLECTIONS } from "@/components/admin/firestore-service"
import LoadingSpinner from "@/components/admin/loading-spinner"

interface SiteSettings {
  id?: string
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  socialLinks: {
    facebook: string
    twitter: string
    instagram: string
    youtube: string
  }
  metaKeywords: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Otega Evangelical Outreach",
    siteDescription: "Raising Kingdom Leaders in Nigeria's Villages",
    contactEmail: "info@otegaoutreach.org",
    contactPhone: "+234 814 265 6848",
    contactAddress: "Abuja, Federal Capital Territory, Nigeria",
    socialLinks: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
    },
    metaKeywords:
      "Nigeria rural evangelism, African church empowerment, Gospel outreach in Lagos/Abuja villages, Christian community development Nigeria",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        // Try to get existing settings
        const settingsDoc = await getDocument<SiteSettings>(COLLECTIONS.SETTINGS, "general")

        if (settingsDoc) {
          setSettings(settingsDoc)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
        setMessage({ type: "error", text: "Failed to load settings. Using defaults." })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      // Handle nested properties (e.g., socialLinks.facebook)
      const [parent, child] = name.split(".")
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof SiteSettings],
          [child]: value,
        },
      }))
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      if (settings.id) {
        // Update existing settings
        await updateDocument(COLLECTIONS.SETTINGS, settings.id, settings)
      } else {
        // Create new settings document with ID "general"
        await addDocument(COLLECTIONS.SETTINGS, { ...settings, id: "general" })
      }

      setMessage({ type: "success", text: "Settings saved successfully!" })
    } catch (error) {
      console.error("Error saving settings:", error)
      setMessage({ type: "error", text: "Failed to save settings. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Site Settings</h1>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-md ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          <p>{message.text}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-medium border-b pb-2">General Information</h2>

              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <textarea
                  id="siteDescription"
                  name="siteDescription"
                  rows={3}
                  value={settings.siteDescription}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>

              <div>
                <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Keywords
                </label>
                <textarea
                  id="metaKeywords"
                  name="metaKeywords"
                  rows={3}
                  value={settings.metaKeywords}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Comma-separated keywords for SEO"
                ></textarea>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium border-b pb-2">Contact Information</h2>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="contactAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Address
                </label>
                <input
                  type="text"
                  id="contactAddress"
                  name="contactAddress"
                  value={settings.contactAddress}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium border-b pb-2">Social Media Links</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="socialLinks.facebook" className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  id="socialLinks.facebook"
                  name="socialLinks.facebook"
                  value={settings.socialLinks.facebook}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="socialLinks.twitter" className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  id="socialLinks.twitter"
                  name="socialLinks.twitter"
                  value={settings.socialLinks.twitter}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="socialLinks.instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  id="socialLinks.instagram"
                  name="socialLinks.instagram"
                  value={settings.socialLinks.instagram}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="socialLinks.youtube" className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube
                </label>
                <input
                  type="url"
                  id="socialLinks.youtube"
                  name="socialLinks.youtube"
                  value={settings.socialLinks.youtube}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              <span>Reset</span>
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-900 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
