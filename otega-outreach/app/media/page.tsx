import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, ImageIcon } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Media Gallery - Otega Evangelical Outreach",
  description:
    "View photos and videos from our salvation crusades and Biblical discipleship programs across rural Nigeria.",
}

export default function MediaPage() {
  // Sample data - this would come from your admin dashboard
  const videos = [
  
  const mediaCategories = [
    { id: "all", name: "All Media" },
    { id: "crusades", name: "Salvation Crusades" },
    { id: "training", name: "Pastor Training" },
    { id: "outreach", name: "Village Outreach" },
    { id: "testimonies", name: "Testimonies" },
  ]

    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Media Gallery</h1>
      <p className="text-center text-gray-700 mb-8">Documenting God's Work Across Rural Nigeria</p>

      <Tabs defaultValue="videos" className="w-full mb-12">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Play size={16} />
            Videos
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <ImageIcon size={16} />
            Photos
          </TabsTrigger>
        </TabsList>

        <div className="flex overflow-x-auto pb-4 mb-6 gap-2">
          {mediaCategories.map((category) => (
            <button
              key={category.id}
              className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full whitespace-nowrap hover:bg-amber-200 transition-colors"
            >
              {category.name}
            </button>
          ))}
        </div>

        <TabsContent value="videos" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-video relative">
                  <iframe
                    src={video.youtubeUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{video.title}</h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{video.date}</span>
                    <span className="capitalize">{video.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 italic">
              
            </p>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="space-y-8">
          <div className="grid md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image src={photo.imageUrl || ""} alt={photo.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1">{photo.title}</h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{photo.date}</span>
                    <span className="capitalize">{photo.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 italic">
            
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
