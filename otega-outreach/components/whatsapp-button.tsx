"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"
import WhatsappChat from "./whatsapp-chat"

export default function WhatsappButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Simulate new message notification after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNewMessage(true)
        setIsAnimating(true)

        // Stop animation after 3 seconds
        setTimeout(() => {
          setIsAnimating(false)
        }, 3000)
      }
    }, 30000)

    return () => clearTimeout(timer)
  }, [isOpen])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (hasNewMessage) {
      setHasNewMessage(false)
    }
  }

  return (
    <>
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:bg-[#1da851] transition-all ${
          isAnimating ? "animate-bounce-subtle" : ""
        }`}
        aria-label="Chat with us"
      >
        <div className="relative">
          <MessageCircle size={28} fill="white" stroke="white" />

          {hasNewMessage && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
              1
            </div>
          )}
        </div>
      </button>

      {isOpen && <WhatsappChat onClose={() => setIsOpen(false)} />}
    </>
  )
}
