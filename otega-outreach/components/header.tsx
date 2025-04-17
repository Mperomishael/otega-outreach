"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, Book } from "lucide-react"
import { usePathname } from "next/navigation"
import LanguageSwitcher from "./language-switcher"
import { useLanguage } from "./language-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const { t } = useLanguage()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (isMenuOpen) {
      setOpenDropdown(null)
    }
  }

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { name: t("home"), path: "/" },
    {
      name: t("about"),
      path: "/about",
      dropdown: [
        { name: t("ourMission"), path: "/about" },
        { name: "Our History", path: "/about#history" },
        { name: "Statement of Faith", path: "/about#faith" },
      ],
    },
    {
      name: t("ministries"),
      path: "/ministries",
      dropdown: [
        { name: t("ourEvangelists"), path: "/evangelists" },
        { name: t("testimonies"), path: "/testimonies" },
        { name: "Rural Church Planting", path: "/ministries/church-planting" },
        { name: "Leadership Training", path: "/ministries/leadership" },
      ],
    },
    { name: t("partners"), path: "/partners" },
    { name: t("media"), path: "/media" },
    { name: t("blog"), path: "/blog" },
    { name: t("contact"), path: "/contact" },
    { name: t("donate"), path: "/donate" },
  ]

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Book className="h-8 w-8 text-amber-800 mr-2" />
            <span className="font-bold text-xl text-amber-800">Otega Evangelical Outreach</span>
          </Link>

          <div className="flex items-center">
            {/* Language Switcher */}
            <div className="hidden md:block mr-4">
              <LanguageSwitcher />
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <button
                      className={`flex items-center gap-1 py-2 ${
                        isActive(item.path) ? "text-amber-800 font-medium" : "hover:text-amber-800"
                      }`}
                      onClick={() => toggleDropdown(item.name)}
                    >
                      {item.name}
                      <ChevronDown size={16} />
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      className={`py-2 ${isActive(item.path) ? "text-amber-800 font-medium" : "hover:text-amber-800"}`}
                    >
                      {item.name}
                    </Link>
                  )}

                  {item.dropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden hidden group-hover:block">
                      <div className="py-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.path}
                            className="block px-4 py-2 hover:bg-amber-50 hover:text-amber-800"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="mb-4">
              <LanguageSwitcher />
            </div>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <button
                        className={`flex items-center justify-between w-full py-2 ${
                          isActive(item.path) ? "text-amber-800 font-medium" : ""
                        }`}
                        onClick={() => toggleDropdown(item.name)}
                      >
                        {item.name}
                        <ChevronDown size={16} className={openDropdown === item.name ? "transform rotate-180" : ""} />
                      </button>

                      {openDropdown === item.name && (
                        <div className="pl-4 mt-2 border-l-2 border-amber-200 space-y-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.path}
                              className="block py-2 hover:text-amber-800"
                              onClick={toggleMenu}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.path}
                      className={`block py-2 ${isActive(item.path) ? "text-amber-800 font-medium" : ""}`}
                      onClick={toggleMenu}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
