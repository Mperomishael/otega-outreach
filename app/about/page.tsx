import type { Metadata } from "next"
import NigeriaMap from "@/components/nigeria-map"

export const metadata: Metadata = {
  title: "About Otega Evangelical Outreach - Our Mission in Rural Nigeria",
  description:
    "Serving 100+ Villages Since 2015 – Equipping the Body of Christ in Rural Nigeria through Holy Spirit-powered outreach and Biblical discipleship.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">About Our Ministry</h1>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="mb-4">
            Otega Evangelical Outreach is dedicated to empowering rural churches across Nigeria through Holy
            Spirit-powered outreach, Biblical discipleship, and leadership development.
          </p>
          <p className="mb-4">
            Since 2015, we have been serving over 100 villages, equipping the Body of Christ in rural Nigeria to bring
            spiritual transformation and Kingdom impact to their communities.
          </p>
          <p className="font-semibold text-amber-700">
            "Raising Kingdom Leaders in Nigeria's Villages – Deuteronomy 28:13"
          </p>
        </div>
        <div className="flex justify-center">
          <NigeriaMap />
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-amber-50 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Biblical Foundation</h3>
            <p>Grounded in Scripture, we ensure all our teachings and practices align with God's Word.</p>
          </div>
          <div className="p-6 bg-amber-50 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Indigenous Leadership</h3>
            <p>We believe in raising local leaders who understand their communities' unique needs.</p>
          </div>
          <div className="p-6 bg-amber-50 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Sustainable Ministry</h3>
            <p>Creating self-sustaining churches that continue to grow and impact their villages.</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Our History</h2>
        <div className="relative pl-8 border-l-2 border-amber-700">
          <div className="mb-8 relative">
            <div className="absolute -left-10 w-6 h-6 bg-amber-700 rounded-full"></div>
            <h3 className="text-xl font-bold">2015: Ministry Founded</h3>
            <p>Otega Evangelical Outreach began with a vision to reach the most remote villages in Nigeria.</p>
          </div>
          <div className="mb-8 relative">
            <div className="absolute -left-10 w-6 h-6 bg-amber-700 rounded-full"></div>
            <h3 className="text-xl font-bold">2017: First Leadership Training</h3>
            <p>Launched our first Biblical discipleship program for rural pastors in 5 states.</p>
          </div>
          <div className="mb-8 relative">
            <div className="absolute -left-10 w-6 h-6 bg-amber-700 rounded-full"></div>
            <h3 className="text-xl font-bold">2019: Expanded to 20 States</h3>
            <p>Our salvation crusades and outreach programs reached 20 Nigerian states.</p>
          </div>
          <div className="relative">
            <div className="absolute -left-10 w-6 h-6 bg-amber-700 rounded-full"></div>
            <h3 className="text-xl font-bold">2025: Serving All 36 States</h3>
            <p>
              Today, we have a presence in all 36 Nigerian states, bringing spiritual transformation to rural
              communities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
