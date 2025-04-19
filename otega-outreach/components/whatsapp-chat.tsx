"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Send, X, ChevronRight } from "lucide-react"
import PrayerRequestModal from "./prayer-request-modal"

// FAQ questions and answers
const FAQ_ITEMS = [
  {
    question: "What is Otega Evangelical Outreach?",
    answer:
      "Otega Evangelical Outreach is a ministry dedicated to spreading the Gospel across Nigeria through evangelism, prayer, and community outreach programs.",
  },
  {
    question: "How can I join the ministry?",
    answer:
      "You can join our ministry by attending our events, becoming a volunteer, or partnering with us financially. Visit our 'Partners' page for more information.",
  },
  {
    question: "Where are your upcoming events?",
    answer:
      "Our upcoming events are listed on our homepage and regularly updated. You can also subscribe to our newsletter to stay informed about future events.",
  },
  {
    question: "Submit Prayer Request",
    answer: "I'd be happy to help you submit a prayer request. Please fill out the form that appears.",
    special: "prayer-request",
  },
  {
    question: "How can I donate to the ministry?",
    answer:
      "You can donate to our ministry through our 'Donate' page. We accept online payments via Flutterwave and direct bank transfers to our OPAY account.",
  },
]

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ type: string; text: string; isNew?: boolean }>>([])
  const [inputEnabled, setInputEnabled] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [showPrayerModal, setShowPrayerModal] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [hasNewMessages, setHasNewMessages] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        setMessages([
          { type: "bot", text: "Hello! 👋 Welcome to Otega Evangelical Outreach. How can I help you today?" },
        ])
        setIsTyping(false)
      }, 1500)
    }

    if (isOpen) {
      setHasNewMessages(false)
    }
  }, [isOpen, messages.length])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  const handleFaqClick = (question: string, answer: string, special?: string) => {
    // Add user question
    setMessages((prev) => [...prev, { type: "user", text: question }])

    // Show typing indicator
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, { type: "bot", text: answer, isNew: true }])

      // Handle special actions
      if (special === "prayer-request") {
        setTimeout(() => {
          setShowPrayerModal(true)
        }, 500)
      }
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: inputValue }])

    // Clear input
    setInputValue("")

    // Show typing indicator
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "I'm connecting you to our evangelist. You'll be redirected to WhatsApp to continue the conversation.",
          isNew: true,
        },
      ])

      // Redirect to WhatsApp after a short delay
      setTimeout(() => {
        const encodedMessage = encodeURIComponent(inputValue)
        window.open(`https://wa.me/2348131003708?text=${encodedMessage}`, "_blank")
      }, 1500)
    }, 1500)
  }

  const enableDirectChat = () => {
    setInputEnabled(true)

    // Show typing indicator
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "You're now connected to talk directly with our evangelist. Type your message and click send. You'll be redirected to WhatsApp to continue the conversation.",
          isNew: true,
        },
      ])
    }, 1500)
  }

  const handlePrayerRequestClose = () => {
    setShowPrayerModal(false)

    // Show typing indicator
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Thank you for submitting your prayer request. Our prayer team will be praying for you. Is there anything else I can help you with?",
          isNew: true,
        },
      ])
    }, 1000)
  }

  return (
    <>
      {/* Chat button with notification indicator */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 flex items-center justify-center animate-gentle-bounce"
        aria-label="Open WhatsApp Chat"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4c-4.38 0-7.93 3.55-7.93 7.93a7.9 7.9 0 0 0 1.07 3.98L4 20l4.18-1.1a7.9 7.9 0 0 0 3.87 1c4.38 0 7.93-3.55 7.93-7.93a7.86 7.86 0 0 0-2.38-5.65zM12.05 18.2a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.43-.16-.25a6.6 6.6 0 0 1-1.01-3.49c0-3.64 2.97-6.6 6.6-6.6a6.56 6.56 0 0 1 4.66 1.93 6.56 6.56 0 0 1 1.93 4.66c0 3.64-2.97 6.6-6.6 6.6zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.07-.32-.1-.45.1-.13.2-.5.64-.62.77-.11.13-.23.15-.43.05a5.4 5.4 0 0 1-1.6-.99c-.59-.51-.99-1.15-1.1-1.34-.12-.2 0-.3.09-.4.08-.08.2-.22.3-.33.1-.1.13-.18.2-.3.07-.13.03-.24-.02-.33-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.33-.45-.34h-.38c-.13 0-.35.05-.53.25-.18.2-.7.69-.7 1.67 0 .99.72 1.94.82 2.08.1.13 1.4 2.13 3.39 2.99.47.2.84.33 1.13.42.48.15.91.13 1.25.08.38-.06 1.17-.48 1.33-.94.17-.46.17-.86.12-.94-.05-.08-.19-.13-.4-.23z" />
        </svg>
        {hasNewMessages && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            1
          </span>
        )}
      </button>

      {/* WhatsApp chat interface */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] max-h-[90vh] flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="bg-green-600 text-white p-4 flex items-center">
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden relative">
                  <Image
                    src="https://i.ibb.co/N2dpNgsL/photo-6021658356923614950-y.jpg"
                    alt="Evangelist"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Otega Evangelical Outreach</h3>
                <p className="text-xs text-green-100">Online</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-green-200"
                aria-label="Close chat"
              >
                <X size={24} />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#e5ded8]">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-3 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      msg.type === "user" ? "bg-[#dcf8c6] text-gray-800" : "bg-white text-gray-800"
                    } ${msg.isNew ? "animate-fade-in-up" : ""}`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-right text-xs text-gray-500 mt-1">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start mb-3">
                  <div className="bg-white rounded-lg px-4 py-2 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ suggestions */}
              {!inputEnabled && messages.length > 0 && !isTyping && (
                <div className="mt-4 animate-fade-in">
                  <p className="text-sm text-gray-600 mb-2">Frequently Asked Questions:</p>
                  {FAQ_ITEMS.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleFaqClick(item.question, item.answer, item.special)}
                      className="w-full text-left mb-2 bg-white rounded-lg p-3 shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm">{item.question}</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  ))}
                  <button
                    onClick={enableDirectChat}
                    className="w-full text-left mt-4 bg-green-100 text-green-800 rounded-lg p-3 shadow-sm hover:bg-green-200 transition-colors flex items-center justify-between font-medium"
                  >
                    <span>Talk to Evangelist Directly</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <div className="p-3 bg-[#f0f0f0] flex items-center">
              <input
                type="text"
                placeholder={inputEnabled ? "Type a message..." : "Select a question above..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={!inputEnabled}
                className="flex-1 rounded-full py-2 px-4 focus:outline-none bg-white disabled:bg-gray-100"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputEnabled}
                className={`ml-2 rounded-full p-2 ${
                  inputEnabled ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"
                }`}
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prayer Request Modal */}
      {showPrayerModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold text-amber-700">Prayer Request</h2>
              <button onClick={() => setShowPrayerModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <PrayerRequestModal onClose={handlePrayerRequestClose} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
