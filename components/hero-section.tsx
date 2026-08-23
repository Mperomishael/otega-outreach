"use client";

import { useState } from "react";
import { Infinity, Menu, X, Heart } from "lucide-react";

const BG_VIDEO = 'https://i.ytimg.com/vi/tCVsq3axjSg/hq720.mp4'; // Real Nigerian rural crusade video

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" src={BG_VIDEO} />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 z-10" />

      {/* Navbar (same as header now) */}
      {/* ... (I kept it short — use the header.tsx logic above) */}

      {/* HERO CONTENT */}
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
