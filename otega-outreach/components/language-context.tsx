"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ur" | "fr"

type Translations = {
  [key in Language]: {
    [key: string]: string
  }
}

// Basic translations for demonstration
const translations: Translations = {
  en: {
    home: "Home",
    about: "About",
    ministries: "Ministries",
    partners: "Partners",
    media: "Media",
    blog: "Blog",
    contact: "Contact",
    prayWithUs: "Pray With Us",
    ourMission: "Our Mission",
    ourEvangelists: "Our Evangelists",
    testimonies: "Testimonies",
    joinUs: "Join Our Spiritual Transformation Movement",
    partnerWithUs: "Partner With Us",
    kingdomImpact: "Our Kingdom Impact",
    villagesReached: "Villages Reached",
    nigerianStates: "Nigerian States",
    pastorsTrained: "Pastors Trained",
    yearsOfMinistry: "Years of Ministry",
  },
  ur: {
    home: "Ọba",
    about: "Kpahen",
    ministries: "Iruiruo",
    partners: "Ihworakugbe",
    media: "Ekuakua",
    blog: "Ebe Nọrọ",
    contact: "Kpọ Mẹ",
    prayWithUs: "Rhe Guọghọ Kugbe",
    ourMission: "Iruo Rẹ Mẹ",
    ourEvangelists: "Ihwo Rẹ Mẹ Ri Evangelisti",
    testimonies: "Iseri",
    joinUs: "Kugbe Kẹ Mẹ Rẹ Ẹgho Rẹ Ẹguọghọ",
    partnerWithUs: "Kugbe Kẹ Mẹ",
    kingdomImpact: "Ọghẹnẹ Rẹ Iruo Rẹ Mẹ",
    villagesReached: "Ẹkọ Ri Mẹ Ruẹ",
    nigerianStates: "Ẹkọ Rẹ Nigeria",
    pastorsTrained: "Pastọ Ri Mẹ Wẹn",
    yearsOfMinistry: "Erọn Rẹ Iruo",
  },
  fr: {
    home: "Accueil",
    about: "À Propos",
    ministries: "Ministères",
    partners: "Partenaires",
    media: "Médias",
    blog: "Blog",
    contact: "Contact",
    prayWithUs: "Priez Avec Nous",
    ourMission: "Notre Mission",
    ourEvangelists: "Nos Évangélistes",
    testimonies: "Témoignages",
    joinUs: "Rejoignez Notre Mouvement de Transformation Spirituelle",
    partnerWithUs: "Devenez Partenaire",
    kingdomImpact: "Notre Impact pour le Royaume",
    villagesReached: "Villages Atteints",
    nigerianStates: "États Nigérians",
    pastorsTrained: "Pasteurs Formés",
    yearsOfMinistry: "Années de Ministère",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
})

export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en")

  // Function to translate text
  const t = (key: string): string => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key]
    }
    // Fallback to English if translation not found
    if (translations.en[key]) {
      return translations.en[key]
    }
    // Return the key itself if no translation exists
    return key
  }

  // Update document language attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}
