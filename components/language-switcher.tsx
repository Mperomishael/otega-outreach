"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { useLanguage } from "./language-context"

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: "en", name: "English" },
    { code: "ur", name: "Urhobo" },
    { code: "fr", name: "French" },
  ]

  const handleLanguageChange = (langCode: "en" | "ur" | "fr") => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  const getCurrentLanguageName = () => {
    const lang = languages.find((l) => l.code === language)
    return lang ? lang.name : "English"
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-amber-50 transition-colors"
        aria-label="Change language"
      >
        <Globe size={18} />
        <span>{getCurrentLanguageName()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-50">
          <ul className="py-1">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleLanguageChange(lang.code as "en" | "ur" | "fr")}
                  className={`block w-full text-left px-4 py-2 hover:bg-amber-50 ${
                    language === lang.code ? "bg-amber-100 font-medium" : ""
                  }`}
                >
                  {lang.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
