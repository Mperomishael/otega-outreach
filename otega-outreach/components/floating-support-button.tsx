"use client"

import { useState } from "react"
import { MessageSquare, X } from "lucide-react"
import PrayerRequestModal from "./prayer-request-modal"

export default function FloatingSupportButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex items-center justify-center w-14 h-14 bg-amber-800 text-white rounded-full shadow-lg hover:bg-amber-900 transition-all duration-300 animate-gentle-pulse"
        aria-label="Submit Prayer Request"
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div className="p-6">
              <PrayerRequestModal onClose={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
