import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { LanguageProvider } from "@/components/language-context"
import WhatsappButton from "@/components/whatsapp-button"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Otega Evangelical Outreach - Reaching Rural Nigeria with the Gospel",
  description:
    "Otega Evangelical Outreach is dedicated to spreading the Gospel in rural areas of Nigeria through evangelism, discipleship, and community development.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsappButton />
        </LanguageProvider>

        {/* Flutterwave Script */}
        <Script src="https://checkout.flutterwave.com/v3.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}


import './globals.css'