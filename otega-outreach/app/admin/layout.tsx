import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/components/admin/auth-provider"

export const metadata: Metadata = {
  title: "Admin Dashboard - Otega Evangelical Outreach",
  description: "Admin dashboard for managing Otega Evangelical Outreach website content",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthProvider>{children}</AuthProvider>
}
