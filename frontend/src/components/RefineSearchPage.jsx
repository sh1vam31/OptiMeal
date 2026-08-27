import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, Leaf, Dumbbell, Flame, ShieldCheck, Sparkles, Clock, Wallet, RotateCcw, ArrowRight, ShoppingBag, Utensils, Star, Activity } from 'lucide-react';

export default function RefineSearchPage({
  filters,
  onFilterChange,
  items,
  loading,
  onAddToCart,
  onExploreCategory,
  onOpenDishDetail
}) {
  const [localBudget, setLocalBudget] = useState(filters.budget);
  const [localEta, setLocalEta] = useState(filters.eta);
  const [isVeg, setIsVeg] = useState(filters.is_veg);
  const [isHighProtein, setIsHighProtein] = useState(filters.is_high_protein);
  const [isKeto, setIsKeto] = useState(filters.is_keto);
  const [isGlutenFree, setIsGlutenFree] = useState(filters.is_gluten_free);
  const [localCuisines, setLocalCuisines] = useState(filters.cuisines || []);
  const [localMinRating, setLocalMinRating] = useState(filters.min_rating || 3.5);
  const [localMaxCalories, setLocalMaxCalories] = useState(filters.max_calories || 1000);

  // Check if current applied filters are the defaults
  const isDefaultFilters =
    filters.budget === 500 &&
    filters.eta === 30 &&
    !filters.is_veg &&
    !filters.is_high_protein &&
    !filters.is_keto &&
    !filters.is_gluten_free &&
    (!filters.cuisines || filters.cuisines.length === 0) &&
    filters.min_rating === 3.5 &&
    filters.max_calories === 1000;

  const displayLimit = isDefaultFilters ? 60 : 10;

  const isInitialMount = useRef(true);

  // Sync internal state when filters prop updates
  useEffect(() => {
    setLocalBudget(filters.budget);
    setLocalEta(filters.eta);
    setIsVeg(filters.is_veg);
    setIsHighProtein(filters.is_high_protein);
    setIsKeto(filters.is_keto);
    setIsGlutenFree(filters.is_gluten_free);
    setLocalCuisines(filters.cuisines || []);
    setLocalMinRating(filters.min_rating || 3.5);
    setLocalMaxCalories(filters.max_calories || 1000);
  }, [filters.budget, filters.eta, filters.is_veg, filters.is_high_protein, filters.is_keto, filters.is_gluten_free, filters.cuisines, filters.min_rating, filters.max_calories]);

  const applyFilters = () => {
    onFilterChange({
      budget: localBudget,
      eta: localEta,
      is_veg: isVeg,
      is_high_protein: isHighProtein,
      is_keto: isKeto,
      is_gluten_free: isGlutenFree,
      cuisines: localCuisines,
      min_rating: localMinRating,
      max_calories: localMaxCalories,
    });
  };

  const autoRelax = () => {
    const defaults = {
      budget: 500,
      eta: 30,
      is_veg: false,
      is_high_protein: false,
      is_keto: false,
      is_gluten_free: false,
      cuisines: [],
      min_rating: 3.5,
      max_calories: 1000,
    };
    setLocalBudget(defaults.budget);
    setLocalEta(defaults.eta);
    setIsVeg(defaults.is_veg);
    setIsHighProtein(defaults.is_high_protein);
    setIsKeto(defaults.is_keto);
    setIsGlutenFree(defaults.is_gluten_free);
    setLocalCuisines(defaults.cuisines);
    setLocalMinRating(defaults.min_rating);
    setLocalMaxCalories(defaults.max_calories);

    // Apply immediately so it triggers fetching and resets to "All Available Dishes" (60 items)
    onFilterChange(defaults);
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
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Customize Budget, ETA & Dietary Constraints
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
          Adjust the sliders below to personalize your food recommendations. The XGBoost model dynamically reranks dishes matching your budget margin and speed advantage.
        </p>
      </div>

      {/* Main Refine Search Control Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#141820] border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-2xl space-y-6">
        
        {/* Card Header & Auto-Relax */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#E23744]/10 dark:bg-rose-600/20 text-[#E23744] dark:text-rose-400 border border-[#E23744]/20 dark:border-rose-500/30">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900 dark:text-white text-lg">Active Search Constraints</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">Stage 1 SQL Candidate Filtering</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={autoRelax}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 text-gray-700 dark:text-amber-300 border border-gray-200 dark:border-amber-500/30 text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 rounded-xl bg-[#E23744] hover:bg-[#c9303d] text-white border border-transparent text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-[#E23744]/20"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>

        {/* Sliders & Dietary Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. Budget Slider */}
          <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-[#1C2128] border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="refine-budget-slider" className="text-gray-800 dark:text-gray-200 font-extrabold flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Max Budget Limit</span>
              </label>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-black text-sm bg-emerald-50 dark:bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
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
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 border-emerald-600 dark:border-emerald-400 font-black shadow-sm'
                      : 'bg-white dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Delivery Time Slider */}
          <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-[#1C2128] border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="refine-eta-slider" className="text-gray-800 dark:text-gray-200 font-extrabold flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Max Delivery Time</span>
              </label>
              <span className="text-amber-600 dark:text-amber-400 font-mono font-black text-sm bg-amber-50 dark:bg-amber-500/15 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-500/30">
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
                      ? 'bg-amber-500 text-white dark:text-slate-950 border-amber-500 dark:border-amber-400 font-black shadow-sm'
                      : 'bg-white dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {val}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rating and Calories Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 3. Minimum Rating Slider */}
          <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-[#1C2128] border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="refine-rating-slider" className="text-gray-800 dark:text-gray-200 font-extrabold flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Minimum Rating</span>
              </label>
              <span className="text-yellow-600 dark:text-yellow-400 font-mono font-black text-sm bg-yellow-50 dark:bg-yellow-500/15 px-3 py-1 rounded-xl border border-yellow-200 dark:border-yellow-500/30">
                {localMinRating}+ Stars
              </span>
            </div>

            <input
              id="refine-rating-slider"
              type="range"
              min="3.0"
              max="5.0"
              step="0.5"
              value={localMinRating}
              onChange={(e) => setLocalMinRating(Number(e.target.value))}
              className="w-full cursor-pointer accent-yellow-500"
            />

            {/* Quick Chips */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[3.5, 4.0, 4.5, 5.0].map((val) => (
                <button
                  key={val}
                  onClick={() => setLocalMinRating(val)}
                  className={`py-1.5 text-xs font-mono font-bold rounded-xl transition-all border ${
                    localMinRating === val
                      ? 'bg-yellow-500 text-white dark:text-slate-950 border-yellow-500 dark:border-yellow-400 font-black shadow-sm'
                      : 'bg-white dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Max Calories Slider */}
          <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-[#1C2128] border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="refine-calories-slider" className="text-gray-800 dark:text-gray-200 font-extrabold flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Max Calories</span>
              </label>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-black text-sm bg-cyan-50 dark:bg-cyan-500/15 px-3 py-1 rounded-xl border border-cyan-200 dark:border-cyan-500/30">
                &lt;{localMaxCalories} kcal
              </span>
            </div>

            <input
              id="refine-calories-slider"
              type="range"
              min="200"
              max="1200"
              step="50"
              value={localMaxCalories}
              onChange={(e) => setLocalMaxCalories(Number(e.target.value))}
              className="w-full cursor-pointer accent-cyan-500"
            />

            {/* Quick Chips */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[300, 500, 700, 900].map((val) => (
                <button
                  key={val}
                  onClick={() => setLocalMaxCalories(val)}
                  className={`py-1.5 text-xs font-mono font-bold rounded-xl transition-all border ${
                    localMaxCalories === val
                      ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 border-cyan-600 dark:border-cyan-400 font-black shadow-sm'
                      : 'bg-white dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {val}
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
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/50 shadow-sm'
                  : 'bg-white dark:bg-[#1C2128] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Pure Veg</span>
            </button>

            <button
              onClick={() => setIsHighProtein(!isHighProtein)}
              className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                isHighProtein
                  ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/50 shadow-sm'
                  : 'bg-white dark:bg-[#1C2128] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Dumbbell className="w-4 h-4 text-rose-400" />
              <span>High Protein</span>
            </button>

            <button
              onClick={() => setIsKeto(!isKeto)}
              className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                isKeto
                  ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/50 shadow-sm'
                  : 'bg-white dark:bg-[#1C2128] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Keto Diet</span>
            </button>

            <button
              onClick={() => setIsGlutenFree(!isGlutenFree)}
              className={`p-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                isGlutenFree
                  ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/50 shadow-sm'
                  : 'bg-white dark:bg-[#1C2128] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Gluten Free</span>
            </button>
          </div>
        </div>

        {/* Cuisine Preferences Section */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block font-mono">
            Cuisine Preferences
          </span>
          <div className="flex flex-wrap gap-2">
            {["Burgers", "Pizzas", "Rolls & Wraps", "Biryani", "Asian & Bowls", "North Indian", "South Indian", "Desserts", "Beverages"].map(cuisine => (
              <button
                key={cuisine}
                onClick={() => {
                  if (localCuisines.includes(cuisine)) {
                    setLocalCuisines(localCuisines.filter(c => c !== cuisine));
                  } else {
                    setLocalCuisines([...localCuisines, cuisine]);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                  localCuisines.includes(cuisine)
                    ? 'bg-[#E23744]/10 dark:bg-rose-500/20 text-[#E23744] dark:text-rose-300 border-[#E23744]/30 dark:border-rose-500/50 shadow-sm'
                    : 'bg-white dark:bg-[#1C2128] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Utensils className={`w-3.5 h-3.5 ${localCuisines.includes(cuisine) ? 'text-[#E23744] dark:text-rose-400' : 'text-gray-500 dark:text-gray-400'}`} />
                <span>{cuisine}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#E23744]" />
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              {isDefaultFilters ? "All Available Dishes" : "Top 10 AI Recommendations"}
            </h2>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            Filtered under ₹{localBudget} • {localEta}m ETA
          </span>
        </div>

        {/* Live Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.slice(0, displayLimit).map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenDishDetail(item)}
              className="p-4 rounded-2xl bg-white dark:bg-[#141820] border border-gray-200 dark:border-white/10 hover:border-[#E23744]/40 transition-all flex flex-col justify-between space-y-3 group cursor-pointer shadow-sm"
            >
              <div className="space-y-3">
                <div className="h-40 w-full rounded-xl overflow-hidden relative">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 left-2 bg-white/90 p-1 rounded shadow-sm flex items-center justify-center backdrop-blur-md">
                    <div className={`w-3.5 h-3.5 flex items-center justify-center border ${item.is_veg ? 'border-green-600' : 'border-red-600'} rounded-sm`}>
                      <div className={`w-2 h-2 ${item.is_veg ? 'bg-green-600 rounded-full' : 'bg-red-600'} ${item.is_veg ? '' : 'clip-polygon-[50%_0,0_100%,100%_100%] rounded-sm'}`} style={!item.is_veg ? { clipPath: 'polygon(50% 10%, 0% 100%, 100% 100%)', borderRadius: '1px' } : {}} />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white group-hover:text-[#E23744] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">by {item.restaurant_name}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
                <span className="text-base font-black text-gray-900 dark:text-white font-mono">₹{item.price}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(item);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#E23744] hover:bg-[#c9303d] text-white font-bold text-xs transition-all flex items-center gap-1 shadow-sm"
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
