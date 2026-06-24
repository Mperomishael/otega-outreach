"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  Video,
  MessageSquare,
  Users,
  DollarSign,
  Settings,
  ChevronDown,
  ChevronRight,
  Calendar,
  Star,
} from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    media: true,
    blog: true,
  })

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home size={18} />,
      path: "/admin",
      exact: true,
    },
    {
      title: "Media",
      icon: <Video size={18} />,
      key: "media",
      submenu: [
        {
          title: "Videos",
          path: "/admin/media/videos",
        },
        {
          title: "Photos",
          path: "/admin/media/photos",
        },
      ],
    },
    {
      title: "Blog",
      icon: <FileText size={18} />,
      key: "blog",
      submenu: [
        {
          title: "All Posts",
          path: "/admin/blog/posts",
        },
        {
          title: "Add New Post",
          path: "/admin/blog/new",
        },
        {
          title: "Categories",
          path: "/admin/blog/categories",
        },
      ],
    },
    {
      title: "Testimonies",
      icon: <Star size={18} />,
      path: "/admin/testimonies",
    },
    {
      title: "Prayer Requests",
      icon: <MessageSquare size={18} />,
      path: "/admin/prayer-requests",
    },
    {
      title: "Evangelists",
      icon: <Users size={18} />,
      path: "/admin/evangelists",
    },
    {
      title: "Donations",
      icon: <DollarSign size={18} />,
      path: "/admin/donations",
    },
    {
      title: "Outreach Schedule",
      icon: <Calendar size={18} />,
      path: "/admin/outreach",
    },
    {
      title: "Settings",
      icon: <Settings size={18} />,
      path: "/admin/settings",
    },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden md:block">
      <div className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            if (item.submenu) {
              return (
                <div key={item.key} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm rounded-md ${
                      isActive(item.path || "") ? "bg-amber-50 text-amber-800" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </div>
                    {expandedMenus[item.key] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  {expandedMenus[item.key] && (
                    <div className="pl-10 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.path}
                          href={subitem.path}
                          className={`block px-4 py-2 text-sm rounded-md ${
                            isActive(subitem.path) ? "bg-amber-50 text-amber-800" : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.path}
                href={item.path || "#"}
                className={`flex items-center px-4 py-2 text-sm rounded-md ${
                  isActive(item.path || "") && (item.exact ? pathname === item.path : true)
                    ? "bg-amber-50 text-amber-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
