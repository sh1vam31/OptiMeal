import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, Leaf, Dumbbell, Flame, ShieldCheck, Sparkles, Clock, Wallet, RotateCcw } from 'lucide-react';

export default function ControlPanel({ filters, onFilterChange }) {
  const [localBudget, setLocalBudget] = useState(filters.budget);
  const [localEta, setLocalEta] = useState(filters.eta);
  const [isVeg, setIsVeg] = useState(filters.is_veg);
  const [isHighProtein, setIsHighProtein] = useState(filters.is_high_protein);
  const [isKeto, setIsKeto] = useState(filters.is_keto);
  const [isGlutenFree, setIsGlutenFree] = useState(filters.is_gluten_free);

  const isInitialMount = useRef(true);

  // Sync internal state when filters prop updates externally
  useEffect(() => {
    setLocalBudget(filters.budget);
    setLocalEta(filters.eta);
    setIsVeg(filters.is_veg);
    setIsHighProtein(filters.is_high_protein);
    setIsKeto(filters.is_keto);
    setIsGlutenFree(filters.is_gluten_free);
  }, [filters.budget, filters.eta, filters.is_veg, filters.is_high_protein, filters.is_keto, filters.is_gluten_free]);

  // 300ms debounced filter changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onFilterChange({
        budget: localBudget,
        eta: localEta,
        is_veg: isVeg,
        is_high_protein: isHighProtein,
        is_keto: isKeto,
        is_gluten_free: isGlutenFree,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [localBudget, localEta, isVeg, isHighProtein, isKeto, isGlutenFree]);

  const autoRelax = () => {
    setLocalBudget(750);
    setLocalEta(45);
    setIsVeg(false);
    setIsHighProtein(false);
    setIsKeto(false);
    setIsGlutenFree(false);
  };

  return (
    <div className="w-full bg-[#141820] border border-white/10 p-5 rounded-2xl shadow-xl space-y-4 mb-6">
      
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <h2 className="font-black text-white text-base tracking-wide">Refine Intent Search</h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={autoRelax}
            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Auto-Relax Constraints</span>
          </button>
        </div>
      </div>

      {/* Grid of Sliders & Dietary Pills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        
        {/* 1. Budget Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="top-budget-slider" className="text-gray-300 font-bold flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Max Budget</span>
            </label>
            <span className="text-emerald-400 font-mono font-black text-xs bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
              ₹{localBudget}
            </span>
          </div>

          <input
            id="top-budget-slider"
            type="range"
            min="50"
            max="1000"
            step="10"
            value={localBudget}
            onChange={(e) => setLocalBudget(Number(e.target.value))}
            className="w-full cursor-pointer accent-emerald-500"
          />
        </div>

        {/* 2. Delivery Time Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="top-eta-slider" className="text-gray-300 font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Max Delivery Time</span>
            </label>
            <span className="text-amber-400 font-mono font-black text-xs bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
              {localEta} mins
            </span>
          </div>

          <input
            id="top-eta-slider"
            type="range"
            min="5"
            max="60"
            step="5"
            value={localEta}
            onChange={(e) => setLocalEta(Number(e.target.value))}
            className="w-full cursor-pointer accent-amber-500"
          />
        </div>

        {/* 3. Dietary Filter Pills (Span 2 cols on lg) */}
        <div className="lg:col-span-2 space-y-2">
          <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block">
            Dietary Preferences
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsVeg(!isVeg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isVeg
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md'
                  : 'bg-gray-800/60 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pure Veg</span>
            </button>

            <button
              onClick={() => setIsHighProtein(!isHighProtein)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isHighProtein
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md'
                  : 'bg-gray-800/60 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5 text-rose-400" />
              <span>High Protein</span>
            </button>

            <button
              onClick={() => setIsKeto(!isKeto)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isKeto
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                  : 'bg-gray-800/60 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Keto</span>
            </button>

            <button
              onClick={() => setIsGlutenFree(!isGlutenFree)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isGlutenFree
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-md'
                  : 'bg-gray-800/60 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Gluten Free</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
