"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "./language-context"

export default function EvangelistProfile() {
  const { t } = useLanguage()

  return (
    <section className="container px-4 mx-auto">
      <div className="flex flex-col items-center justify-center mb-8">
        <h2 className="text-2xl font-bold text-center">{t("ourEvangelists")}</h2>
        <p className="text-center text-gray-700">Meet Evangelist Otega Eugene</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/3">
          <div className="relative h-64 w-64 md:h-80 md:w-80 mx-auto rounded-full overflow-hidden">
            <Image
              src="https://i.ibb.co/N2dpNgsL/photo-6021658356923614950-y.jpg"
              alt="Evangelist Otega Eugene, founder of Otega Evangelical Outreach"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="md:w-2/3">
          <h3 className="text-xl font-bold mb-2">Evangelist Otega Eugene</h3>
          <p className="text-amber-800 mb-4">Founder & Lead Evangelist</p>
          <p className="mb-4">
            Evangelist Otega Eugene has dedicated his life to bringing Holy Spirit-powered outreach to the most remote
            villages across Nigeria. With a passion for Biblical discipleship and a heart for the rural church, he has
            led salvation crusades in all 36 Nigerian states.
          </p>
          <blockquote className="italic border-l-4 border-amber-800 pl-4 mb-4">
            "My vision is to see every village in Nigeria transformed by the power of the Gospel, with indigenous
            leaders equipped to sustain spiritual growth for generations to come."
          </blockquote>
          <Link href="/evangelists" className="inline-flex items-center text-amber-800 hover:text-amber-900">
            Read Full Profile →
          </Link>
        </div>
      </div>
    </section>
  )
}
