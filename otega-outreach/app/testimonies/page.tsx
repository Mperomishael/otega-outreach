import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Testimonies - Otega Evangelical Outreach",
  description:
    "Hear powerful testimonies of spiritual transformation and Kingdom impact from our outreach in rural Nigerian villages.",
}

export default function TestimoniesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Testimonies</h1>
      <p className="text-center text-gray-700 mb-8">Stories of Spiritual Transformation Across Rural Nigeria</p>

      <div className="text-center mb-12 p-8 bg-amber-50 rounded-lg">
        <p className="italic text-lg">Testimonies will be displayed here from the admin dashboard.</p>
      </div>

      <div className="mt-12 bg-amber-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Share Your Testimony</h2>
        <p className="mb-4">
          Has Otega Evangelical Outreach impacted your life or community? We'd love to hear how God has worked through
          our ministry in your village.
        </p>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="location" className="block mb-1 font-medium">
              Village/City
            </label>
            <input
              type="text"
              id="location"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Where are you from?"
            />
          </div>
          <div>
            <label htmlFor="testimony" className="block mb-1 font-medium">
              Your Testimony
            </label>
            <textarea
              id="testimony"
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Share how God has worked in your life through our ministry"
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-700 text-white font-medium rounded-md hover:bg-amber-800 transition-colors"
          >
            Submit Testimony
          </button>
        </form>
      </div>
    </div>
  )
}
