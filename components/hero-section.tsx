'use client';

import { useState } from 'react';
import { ChevronDown, Infinity, Menu, X, Heart } from 'lucide-react';

const BG_VIDEO = 'https://i.ytimg.com/vi/tCVsq3axjSg/hq720.mp4'; // Real Nigerian rural gospel crusade video

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video - FULL SCREEN LOOPING */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={BG_VIDEO}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 z-10" />

      {/* Navbar - liquid-glass exactly as prompt */}
      <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 sm:px-8 py-6">
        <div className="flex items-center gap-3 text-white text-xl font-medium">
          <Infinity size={26} strokeWidth={1.5} className="text-green-400" />
          <span>Otega</span>
        </div>

        <div className="hidden md:flex items-center gap-1 liquid-glass rounded-3xl px-3 py-3">
          {[
            { label: 'Home', active: true },
            { label: 'Wellness', dropdown: true },
            { label: 'Routine' },
            { label: 'Our Team' },
          ].map((link, i) => (
            <button
              key={i}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-2xl text-sm transition-all ${
                link.active ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
              {link.dropdown && <ChevronDown size={14} className="mt-0.5" />}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="liquid-glass px-6 py-3 rounded-3xl text-sm font-medium text-white hover:bg-white/10 transition-colors">
            Log in
          </button>
          <a href="#contact" className="bg-white text-black px-8 py-3 rounded-3xl text-sm font-medium hover:bg-green-400 transition-colors">
            Begin Now
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden liquid-glass p-3 rounded-2xl text-white z-40"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[76px] left-4 right-4 z-50 md:hidden liquid-glass rounded-3xl p-6 flex flex-col gap-4">
          {[...].map((link, i) => (
            <button key={i} className="flex items-center justify-between w-full px-6 py-4 rounded-2xl text-lg hover:bg-white/10 transition-colors">
              {link.label}
            </button>
          ))}
          <div className="pt-6 border-t border-white/10 flex gap-4">
            <button className="flex-1 liquid-glass py-4 rounded-3xl text-sm font-medium">Log in</button>
            <a href="#contact" className="flex-1 bg-white text-black py-4 rounded-3xl text-sm font-medium text-center">Begin Now</a>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-20 pt-32 pb-40 px-6 sm:px-12 max-w-4xl mx-auto text-center">
        <h1 className="text-white text-6xl sm:text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tighter mb-8">
          Reaching out to the world<br />to share Christ’s Love
        </h1>
        <p className="text-white/70 text-xl sm:text-2xl max-w-2xl mx-auto mb-12">
          The Gospel in every village, every heart — Jesus is calling you home.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#contact" className="bg-white text-black text-lg font-medium px-10 py-5 rounded-3xl hover:bg-green-400 transition-all shadow-2xl shadow-green-500/30">
            Begin Your Journey Today
          </a>
          <button className="liquid-glass text-white text-lg font-medium px-10 py-5 rounded-3xl hover:bg-white/10 transition-all">
            Watch Our Latest Crusade
          </button>
        </div>
      </div>
    </div>
  );
}
