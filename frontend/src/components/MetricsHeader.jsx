import React from 'react';
import { Utensils, MapPin, ShoppingBag, Search, Sparkles } from 'lucide-react';

export default function MetricsHeader({ cartCount, onOpenCart }) {
  return (
    <header className="zomato-card sticky top-0 z-40 px-4 py-3 border-b border-gray-200 dark:border-white/10 shadow-xl backdrop-blur-md mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Location Indicator */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E23744] p-2 shadow-lg shadow-[#E23744]/20 flex items-center justify-center text-white font-black">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">OptiMeal</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  AI Recommender
                </span>
              </div>
            </div>
          </div>

          {/* Location Delivery Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-white/10 text-xs">
            <MapPin className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-200">Deliver to Home</span>
            <span className="text-gray-400">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">&lt;30 mins</span>
          </div>
        </div>

        {/* Right Section: Shopping Basket */}
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          aria-label="View shopping cart"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart</span>
          {cartCount > 0 ? (
            <span className="ml-1 bg-slate-950 text-emerald-400 text-[11px] font-mono font-black px-2 py-0.5 rounded-full border border-emerald-500/40 animate-bounce">
              {cartCount}
            </span>
          ) : (
            <span className="text-[11px] opacity-75 font-mono">(0)</span>
          )}
        </button>
      </div>
    </header>
  );
}
