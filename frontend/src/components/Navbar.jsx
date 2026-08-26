import React from 'react';
import { Utensils, BookOpen, ShoppingBag, Compass, SlidersHorizontal } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, cartCount, onOpenCart }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0D0F12]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 text-white shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Nav Links */}
        <div className="flex items-center space-x-8">
          <div 
            onClick={() => setActiveTab('browse')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 p-2 shadow-lg shadow-rose-600/20 flex items-center justify-center text-white font-black group-hover:scale-105 transition-transform">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white font-mono uppercase">
                INTENT<span className="text-rose-500">EATS</span>
              </span>
            </div>
          </div>

          {/* Navigation Links (Browse, Refine Search, How It Works) */}
          <nav className="hidden md:flex items-center space-x-2 font-bold text-xs">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'browse'
                  ? 'bg-white/10 text-white font-extrabold shadow-sm border border-white/15'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4 text-rose-500" />
              <span>Browse</span>
            </button>

            <button
              onClick={() => setActiveTab('refine_search')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'refine_search'
                  ? 'bg-rose-600/20 text-rose-300 font-extrabold border border-rose-500/40 shadow-sm shadow-rose-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-rose-400" />
              <span>Refine Search</span>
            </button>

            <button
              onClick={() => setActiveTab('how_it_works')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'how_it_works'
                  ? 'bg-white/10 text-white font-extrabold shadow-sm border border-white/15'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>How It Works</span>
            </button>
          </nav>
        </div>

        {/* Right Section: Cart Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-600/30 active:scale-95"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="ml-1 bg-slate-950 text-rose-400 text-[11px] font-mono font-black px-2 py-0.5 rounded-full border border-rose-500/40">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
