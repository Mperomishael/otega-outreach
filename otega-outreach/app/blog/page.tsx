import type { Metadata } from "next"
import BlogClientPage from "./BlogClientPage"

export const metadata: Metadata = {
  title: "Nigerian Rural Revival Stories - Otega Evangelical Outreach Blog",
  description:
    "Read stories of spiritual transformation, Biblical discipleship, and Holy Spirit-powered outreach across rural Nigerian villages.",
}

export default function BlogPage() {
  return <BlogClientPage />
}
