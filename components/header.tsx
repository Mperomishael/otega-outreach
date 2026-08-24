"use client";

import { useState } from "react";
import { ChevronDown, Infinity, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./language-switcher";
import { useLanguage } from "./language-context";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { t } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) setOpenDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const navItems = [
    { name: t("home"), path: "/" },
    { name: t("about"), path: "/about", dropdown: [
      { name: t("ourMission"), path: "/about" },
      { name: "Our History", path: "/about#history" },
      { name: "Statement of Faith", path: "/about#faith" },
    ]},
    { name: t("ministries"), path: "/ministries", dropdown: [
      { name: t("ourEvangelists"), path: "/evangelists" },
      { name: t("testimonies"), path: "/testimonies" },
      { name: "Rural Church Planting", path: "/ministries/church-planting" },
      { name: "Leadership Training", path: "/ministries/leadership" },
    ]},
    { name: t("partners"), path: "/partners" },
    { name: t("media"), path: "/media" },
    { name: t("blog"), path: "/blog" },
    { name: t("contact"), path: "/contact" },
    { name: t("donate"), path: "/donate" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white text-2xl font-medium">
          <Infinity size={28} strokeWidth={1.5} className="text-green-400" />
          <span>Otega Evangelical Outreach</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 liquid-glass rounded-3xl px-3 py-3">
          {navItems.map((item, i) => (
            <div key={i} className="relative group">
              {item.dropdown ? (
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-2xl text-sm transition-all ${
                    openDropdown === item.name ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                  <ChevronDown size={14} className={`transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link href={item.path} className="flex items-center gap-1.5 px-5 py-2 rounded-2xl text-sm transition-all text-white/70 hover:text-white hover:bg-white/5">
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        <button onClick={toggleMenu} className="md:hidden liquid-glass p-3 rounded-2xl text-white">
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-[76px] left-4 right-4 z-50 md:hidden liquid-glass rounded-3xl p-6 flex flex-col gap-4">
          {navItems.map((item, i) => (
            <button key={i} className="flex items-center justify-between w-full px-6 py-4 rounded-2xl text-lg hover:bg-white/10 transition-colors">
              {item.name}
              {item.dropdown && <ChevronDown size={18} />}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
