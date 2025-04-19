"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "./language-context"

export default function HeroSection() {
  const { t } = useLanguage()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const verseRef = useRef<HTMLParagraphElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    // Animate elements sequentially
    const title = titleRef.current
    const verse = verseRef.current
    const description = descriptionRef.current
    const button = buttonRef.current

    if (title && verse && description && button) {
      // Reset initial state
      title.style.opacity = "0"
      title.style.transform = "translateY(20px)"
      verse.style.opacity = "0"
      verse.style.transform = "translateY(20px)"
      description.style.opacity = "0"
      description.style.transform = "translateY(20px)"
      button.style.opacity = "0"
      button.style.transform = "translateY(20px)"

      // Animate title
      setTimeout(() => {
        title.style.transition = "opacity 0.8s ease, transform 0.8s ease"
        title.style.opacity = "1"
        title.style.transform = "translateY(0)"
      }, 300)

      // Animate verse
      setTimeout(() => {
        verse.style.transition = "opacity 0.8s ease, transform 0.8s ease"
        verse.style.opacity = "1"
        verse.style.transform = "translateY(0)"
      }, 800)

      // Animate description
      setTimeout(() => {
        description.style.transition = "opacity 0.8s ease, transform 0.8s ease"
        description.style.opacity = "1"
        description.style.transform = "translateY(0)"
      }, 1300)

      // Animate button
      setTimeout(() => {
        button.style.transition = "opacity 0.8s ease, transform 0.8s ease, background-color 0.3s ease"
        button.style.opacity = "1"
        button.style.transform = "translateY(0)"
      }, 1800)
    }
  }, [])

  return (
    <section className="relative">
      <div className="relative h-[70vh] min-h-[400px] max-h-[600px] w-full">
        <Image
          src="https://i.ibb.co/chhfmg4w/photo-6021658356923614877-y.jpg"
          alt="Otega Outreach ministry in rural Nigerian church"
          fill
          className="object-cover"
          priority
        />

        {/* Dark overlay with 50% opacity */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 z-10">
          <div className="max-w-3xl">
            <h1 ref={titleRef} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-shadow-lg">
              {t("Raising Kingdom Leaders in Nigeria's Villages")}
            </h1>
            <p ref={verseRef} className="text-lg md:text-xl mb-2 italic text-shadow-md">
              Deuteronomy 28:13
            </p>
            <p ref={descriptionRef} className="mb-8 text-lg text-shadow-md">
              {t("Bringing Holy Spirit-powered outreach and Biblical discipleship to rural Nigerian communities")}
            </p>
            <Link
              ref={buttonRef}
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white bg-amber-800 rounded-md hover:bg-amber-900 transition-colors transform hover:scale-105"
            >
              {t("Join Our Next Outreach")} ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
