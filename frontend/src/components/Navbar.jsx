import React from 'react';
import { Utensils, BookOpen, ShoppingBag, Compass, SlidersHorizontal, Moon, Sun } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, cartCount, onOpenCart, isDarkMode, setIsDarkMode }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0D0F12]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 py-3 text-gray-900 dark:text-white shadow-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Nav Links */}
        <div className="flex items-center space-x-8">
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#E23744] p-2 shadow-lg shadow-[#E23744]/20 flex items-center justify-center text-white font-black group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-gray-900 dark:text-white font-mono uppercase">
                OPTI<span className="text-[#E23744]">MEAL</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2 font-bold text-xs">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'landing'
                  ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-extrabold shadow-sm border border-gray-200 dark:border-white/15'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <Utensils className="w-4 h-4 text-[#E23744]" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'browse'
                  ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-extrabold shadow-sm border border-gray-200 dark:border-white/15'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4 text-[#E23744]" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => setActiveTab('refine_search')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'refine_search'
                  ? 'bg-[#E23744]/10 dark:bg-rose-600/20 text-[#E23744] dark:text-rose-300 font-extrabold border border-[#E23744]/20 dark:border-rose-500/40 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-[#E23744]" />
              <span>Refine Search</span>
            </button>

            <button
              onClick={() => setActiveTab('how_it_works')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'how_it_works'
                  ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-extrabold shadow-sm border border-gray-200 dark:border-white/15'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>About</span>
            </button>
          </nav>
        </div>

        {/* Right Section: Theme Toggle & Cart Button */}
        <div className="flex items-center space-x-3">
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-[#141820] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E23744] hover:bg-[#c9303d] text-white font-extrabold text-xs transition-all shadow-lg shadow-[#E23744]/30 active:scale-95"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="ml-1 bg-white text-[#E23744] text-[11px] font-mono font-black px-2 py-0.5 rounded-full border border-white/40">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
