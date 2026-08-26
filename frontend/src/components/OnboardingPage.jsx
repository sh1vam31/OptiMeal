import React, { useState } from 'react';
import { Utensils, Plus, Check, ArrowRight, Lock, RotateCcw, Moon, Sun } from 'lucide-react';

const PERSONAS = [
  {
    id: 'spicy',
    title: 'Spicy & Flavorful',
    desc: 'Rich gravies, biryanis, and fiery schezwan spices.',
    icon: '🌶️',
    category: 'North Indian'
  },
  {
    id: 'protein',
    title: 'Fitness & High Protein',
    desc: 'Grilled protein, salmon poke bowls, and clean macros.',
    icon: '💪',
    category: 'Healthy & Salads'
  },
  {
    id: 'comfort',
    title: 'Cheesy & Comforting',
    desc: 'Smash burgers, 4-cheese pizzas, and loaded wraps.',
    icon: '🍔',
    category: 'Burgers'
  },
  {
    id: 'express',
    title: 'Express Quick Lunch',
    desc: 'Crispy dosas, idli sambar, and steamed dim sums in <25m.',
    icon: '⚡',
    category: 'South Indian'
  },
  {
    id: 'sweet',
    title: 'Sweet & Indulgent',
    desc: 'Baked cheesecake, macarons, lava cake, and boba tea.',
    icon: '🍨',
    category: 'Desserts'
  }
];

export default function OnboardingPage({
  seedItems = [],
  onGenerateRecommendations,
  isDarkMode,
  setIsDarkMode
}) {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [selectedSeedIds, setSelectedSeedIds] = useState([]);

  // Filter dishes dynamically if a persona is selected
  const displayDishes = seedItems.filter((item) => {
    if (!selectedPersona) return true;
    if (selectedPersona.id === 'spicy') {
      return item.category === 'North Indian' || item.category === 'Biryani' || item.category === 'Asian & Bowls';
    } else if (selectedPersona.id === 'protein') {
      return item.is_high_protein || item.category === 'Healthy & Salads';
    } else if (selectedPersona.id === 'comfort') {
      return item.category === 'Burgers' || item.category === 'Pizzas' || item.category === 'Rolls & Wraps';
    } else if (selectedPersona.id === 'express') {
      return item.category === 'South Indian' || item.eta_mins <= 25;
    } else if (selectedPersona.id === 'sweet') {
      return item.category === 'Desserts' || item.category === 'Beverages';
    }
    return true;
  });

  const togglePersona = (p) => {
    if (selectedPersona?.id === p.id) {
      setSelectedPersona(null);
    } else {
      setSelectedPersona(p);
    }
  };

  const clearPersonaFilter = () => setSelectedPersona(null);

  const toggleSeed = (id) => {
    if (selectedSeedIds.includes(id)) {
      setSelectedSeedIds(selectedSeedIds.filter((sId) => sId !== id));
    } else {
      setSelectedSeedIds([...selectedSeedIds, id]);
    }
  };

  const remainingNeeded = Math.max(0, 5 - selectedSeedIds.length);
  const canProceed = selectedSeedIds.length >= 5;

  const handleFinish = () => {
    if (!canProceed) return;
    onGenerateRecommendations({ persona: selectedPersona, selectedSeedIds });
  };

  return (
    <div className="min-h-screen pb-28 space-y-8 max-w-7xl mx-auto px-4 py-6">

      {/* Top Bar: Brand + Theme Toggle */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#E23744] p-2 shadow-lg shadow-[#E23744]/20 flex items-center justify-center text-white font-black">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-wider text-gray-900 dark:text-white font-mono uppercase">
            OPTI<span className="text-[#E23744]">MEAL</span>
          </span>
        </div>

        {/* Theme Toggle */}
        {setIsDarkMode && (
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-[#141820] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        )}
      </div>

      {/* Hero Text Section */}
      <div className="space-y-3 max-w-3xl">
        <span className="text-xs font-mono font-black uppercase text-[#E23744] tracking-widest px-3 py-1 rounded-full bg-[#E23744]/10 border border-[#E23744]/20 inline-block">
          AI FOOD RECOMMENDER
        </span>

        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          Tell us what you love.<br />
          We will build tonight's menu.
        </h1>

        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
          Pick at least <strong className="text-[#E23744] font-extrabold">five dishes</strong> below. OptiMeal blends your picks with your budget and delivery speed to build your personalized menu.
        </p>
      </div>

      {/* 1. Food Personas Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Or start from a persona (Click to filter dishes below)
          </h2>

          {selectedPersona && (
            <button
              onClick={clearPersonaFilter}
              className="px-3 py-1 rounded-xl bg-[#E23744]/10 hover:bg-[#E23744]/20 text-[#E23744] border border-[#E23744]/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Persona Filter</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {PERSONAS.map((p) => {
            const isSelected = selectedPersona?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => togglePersona(p)}
                className={`p-5 rounded-2xl text-left transition-all border flex flex-col justify-between space-y-3 relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'bg-[#E23744]/10 dark:bg-gradient-to-b dark:from-rose-900/60 dark:to-[#141820] border-[#E23744] shadow-xl shadow-[#E23744]/20 scale-[1.02]'
                    : 'bg-white dark:bg-[#141820] border-gray-200 dark:border-white/10 hover:border-[#E23744]/40 dark:hover:border-white/20 hover:shadow-md'
                }`}
              >
                <div className="text-3xl">{p.icon}</div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-[#E23744] dark:group-hover:text-rose-300 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                    {p.desc}
                  </p>
                </div>
                {isSelected ? (
                  <span className="text-[10px] font-mono font-black text-[#E23744] uppercase tracking-wider block pt-1">
                    ACTIVE FILTER ✓
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 block pt-1 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                    Click to filter →
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Seed Foods Selection Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              {selectedPersona ? `Dishes related to "${selectedPersona.title}"` : "Pick your dishes"} ({selectedSeedIds.length}/5 minimum)
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {canProceed
                ? "✓ Minimum requirement met! Click 'Show my recommendations' below."
                : `Please select ${remainingNeeded} more dish${remainingNeeded > 1 ? 'es' : ''} to unlock recommendations`}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {selectedPersona && (
              <button
                onClick={clearPersonaFilter}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline font-mono cursor-pointer"
              >
                Reset to all dishes
              </button>
            )}

            <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border ${
              canProceed
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30'
                : 'text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30'
            }`}>
              {selectedSeedIds.length} / 5 selected
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {displayDishes.slice(0, 120).map((item) => {
            const isPicked = selectedSeedIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleSeed(item.id)}
                className={`group rounded-2xl overflow-hidden bg-white dark:bg-[#141820] border transition-all cursor-pointer relative flex flex-col justify-between shadow-sm ${
                  isPicked
                    ? 'border-[#E23744] ring-2 ring-[#E23744]/30 scale-[1.03] shadow-md shadow-[#E23744]/10'
                    : 'border-gray-200 dark:border-white/10 hover:border-[#E23744]/40 dark:hover:border-white/30 hover:shadow-md'
                }`}
              >
                {/* Image Poster */}
                <div className="h-36 w-full relative overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Pick Button Top Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSeed(item.id);
                    }}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all border ${
                      isPicked
                        ? 'bg-[#E23744] text-white border-[#E23744] shadow-md'
                        : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-[#E23744] hover:text-white hover:border-[#E23744]'
                    }`}
                  >
                    {isPicked ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>

                  {/* Veg/Non-veg dot */}
                  <span className="absolute bottom-2 left-2 text-xs leading-none drop-shadow-md">
                    {item.is_veg ? "🟢" : "🔴"}
                  </span>
                </div>

                {/* Title & Price */}
                <div className="p-2.5 space-y-0.5">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#E23744] dark:group-hover:text-white line-clamp-2 min-h-[2rem] leading-tight transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold block">₹{item.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0D0F12]/95 backdrop-blur-md border-t border-gray-200 dark:border-white/10 px-6 py-4 shadow-lg dark:shadow-none transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xs font-mono text-gray-600 dark:text-gray-300">
            {canProceed ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{selectedSeedIds.length} dishes selected — Ready to generate!</span>
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Select {remainingNeeded} more dish{remainingNeeded > 1 ? 'es' : ''} to enable button ({selectedSeedIds.length}/5)</span>
              </span>
            )}
          </div>

          <button
            onClick={handleFinish}
            disabled={!canProceed}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 ${
              canProceed
                ? 'bg-[#E23744] hover:bg-[#c9303d] text-white shadow-xl shadow-[#E23744]/30 cursor-pointer active:scale-95'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-white/5 cursor-not-allowed opacity-60'
            }`}
          >
            <span>
              {canProceed
                ? "Show my recommendations"
                : `Select ${remainingNeeded} more dish${remainingNeeded > 1 ? 'es' : ''}`}
            </span>
            {canProceed ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>
    </div>
  );
}
