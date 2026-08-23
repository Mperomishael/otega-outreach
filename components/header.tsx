"use client";

import { useState } from "react";
import { ChevronDown, Infinity, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./language-switcher";

const navLinks = [
  { label: 'Home', active: true },
  { label: 'About', dropdown: true },
  { label: 'Ministries' },
  { label: 'Partners' },
  { label: 'Media' },
  { label: 'Contact' },
  { label: 'Donate' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen) setOpenDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 text-white text-2xl font-medium">
          <Infinity size={28} strokeWidth={1.5} className="text-green-400" />
          <span>Otega</span>
        </div>

        {/* Desktop Nav Pill */}
        <div className="hidden md:flex items-center gap-1 liquid-glass rounded-3xl px-3 py-3">
          {navLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => link.dropdown && toggleDropdown(link.label)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-2xl text-sm transition-all ${
                link.active || openDropdown === link.label
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
              {link.dropdown && <ChevronDown size={14} className={`transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button onClick={toggleMenu} className="md:hidden liquid-glass p-3 rounded-2xl text-white">
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-[76px] left-4 right-4 z-50 md:hidden liquid-glass rounded-3xl p-6 flex flex-col gap-4">
            {navLinks.map((link, i) => (
              <button key={i} className="flex items-center justify-between w-full px-6 py-4 rounded-2xl text-lg hover:bg-white/10 transition-colors">
                {link.label}
                {link.dropdown && <ChevronDown size={18} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
