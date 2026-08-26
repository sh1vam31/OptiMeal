import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, Leaf, Dumbbell, Flame, ShieldCheck, Sparkles, Clock, Wallet, RotateCcw, ArrowRight, ShoppingBag } from 'lucide-react';

export default function RefineSearchPage({
  filters,
  onFilterChange,
  items,
  loading,
  onAddToCart,
  onExploreCategory
}) {
  const [localBudget, setLocalBudget] = useState(filters.budget);
  const [localEta, setLocalEta] = useState(filters.eta);
  const [isVeg, setIsVeg] = useState(filters.is_veg);
  const [isHighProtein, setIsHighProtein] = useState(filters.is_high_protein);
  const [isKeto, setIsKeto] = useState(filters.is_keto);
  const [isGlutenFree, setIsGlutenFree] = useState(filters.is_gluten_free);

  const isInitialMount = useRef(true);

  // Sync internal state when filters prop updates
  useEffect(() => {
    setLocalBudget(filters.budget);
    setLocalEta(filters.eta);
    setIsVeg(filters.is_veg);
    setIsHighProtein(filters.is_high_protein);
    setIsKeto(filters.is_keto);
    setIsGlutenFree(filters.is_gluten_free);
  }, [filters.budget, filters.eta, filters.is_veg, filters.is_high_protein, filters.is_keto, filters.is_gluten_free]);

  // 300ms debounced filter update
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
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-black uppercase text-rose-500 tracking-wider px-2.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            REFINE INTENT SEARCH
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Customize Budget, ETA & Dietary Constraints
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
          Adjust the sliders below to personalize your food recommendations. The XGBoost model dynamically reranks dishes matching your budget margin and speed advantage.
        </p>
      </div>

      {/* Main Refine Search Control Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#141820] border border-white/10 shadow-2xl space-y-6">
        
        {/* Card Header & Auto-Relax */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-lg">Active Search Constraints</h2>
              <p className="text-xs text-gray-400 font-mono">Stage 1 SQL Candidate Filtering</p>
            </div>
          </div>

          <button
            onClick={autoRelax}
            className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Auto-Relax Constraints</span>
          </button>
        </div>

        {/* Sliders & Dietary Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. Budget Slider */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#1C2128] border border-white/5">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="refine-budget-slider" className="text-gray-200 font-extrabold flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Max Budget Limit</span>
              </label>
              <span className="text-emerald-400 font-mono font-black text-sm bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-500/30">
                ₹{localBudget}
              </span>
            </div>

            <input
              id="refine-budget-slider"
              type="range"
              min="50"
              max="1000"
              step="10"
              value={localBudget}
              onChange={(e) => setLocalBudget(Number(e.target.value))}
              className="w-full cursor-pointer accent-emerald-500"
            />

            {/* Quick Chips */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[200, 350, 500, 750].map((val) => (
                <button
                  key={val}
                  onClick={() => setLocalBudget(val)}
                  className={`py-1.5 text-xs font-mono font-bold rounded-xl transition-all border ${
                    localBudget === val
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-sm'
                      : 'bg-gray-800/60 text-gray-400 border-white/5 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Delivery Time Slider */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#1C2128] border border-white/5">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="refine-eta-slider" className="text-gray-200 font-extrabold flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Max Delivery Time</span>
              </label>
              <span className="text-amber-400 font-mono font-black text-sm bg-amber-500/15 px-3 py-1 rounded-xl border border-amber-500/30">
                {localEta} mins
              </span>
            </div>

            <input
              id="refine-eta-slider"
              type="range"
              min="5"
              max="60"
              step="5"
              value={localEta}
              onChange={(e) => setLocalEta(Number(e.target.value))}
              className="w-full cursor-pointer accent-amber-500"
            />

            {/* Quick Chips */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[15, 25, 35, 50].map((val) => (
                <button
                  key={val}
                  onClick={() => setLocalEta(val)}
                  className={`py-1.5 text-xs font-mono font-bold rounded-xl transition-all border ${
                    localEta === val
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm'
                      : 'bg-gray-800/60 text-gray-400 border-white/5 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {val}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dietary Preferences Section */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block font-mono">
            Dietary Preferences
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setIsVeg(!isVeg)}
              className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                isVeg
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md'
                  : 'bg-[#1C2128] text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Pure Veg</span>
            </button>

            <button
              onClick={() => setIsHighProtein(!isHighProtein)}
              className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                isHighProtein
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md'
                  : 'bg-[#1C2128] text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <Dumbbell className="w-4 h-4 text-rose-400" />
              <span>High Protein</span>
            </button>

            <button
              onClick={() => setIsKeto(!isKeto)}
              className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                isKeto
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                  : 'bg-[#1C2128] text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Keto Diet</span>
            </button>

            <button
              onClick={() => setIsGlutenFree(!isGlutenFree)}
              className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                isGlutenFree
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-md'
                  : 'bg-[#1C2128] text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Gluten Free</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-black text-white tracking-tight">
              Matching AI Recommendations ({items.length} dishes)
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            Filtered under ₹{localBudget} • {localEta}m ETA
          </span>
        </div>

        {/* Live Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#141820] border border-white/10 hover:border-rose-500/40 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-3">
                <div className="h-40 w-full rounded-xl overflow-hidden relative">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded bg-slate-950/90 text-rose-400 border border-rose-500/40 font-mono">
                    {item.is_veg ? "🟢 PURE VEG" : "🔴 NON-VEG"}
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-1">by {item.restaurant_name}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-base font-black text-white font-mono">₹{item.price}</span>
                <button
                  onClick={() => onAddToCart(item)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>+ Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
