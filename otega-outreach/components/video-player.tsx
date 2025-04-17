"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface VideoPlayerProps {
  videoId: string
  title: string
  onClose?: () => void
  autoPlay?: boolean
}

export default function VideoPlayer({ videoId, title, onClose, autoPlay = false }: VideoPlayerProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Extract YouTube video ID from various formats
  const getYouTubeId = (url: string): string => {
    if (!url) return ""

    // If it's already an ID (no slashes or dots)
    if (!/[/.]/.test(url)) return url

    // Try to extract from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)

    return match && match[2].length === 11 ? match[2] : ""
  }

  const extractedVideoId = getYouTubeId(videoId)

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  useEffect(() => {
    // Add body class to prevent scrolling when modal is open
    if (isOpen) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }

    // Cleanup
    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium text-lg truncate">{title}</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close video"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative pt-[56.25%]">
          {" "}
          {/* 16:9 aspect ratio */}
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${extractedVideoId}?rel=0${autoPlay ? "&autoplay=1" : ""}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}
