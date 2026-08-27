import React, { useState } from 'react';
import { Utensils, Plus, Check, ArrowRight, Lock, RotateCcw } from 'lucide-react';

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
    <div className="min-h-screen pb-28 flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. Zomato Style Hero Banner */}
      <div className="w-full h-80 md:h-[400px] relative flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=80')" }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        <div className="relative z-10 text-center space-y-4 px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight drop-shadow-xl">
            Discover the best food & drinks
          </h1>
          <p className="text-base md:text-xl text-gray-200 font-medium max-w-2xl mx-auto drop-shadow-md">
            Pick at least 5 dishes below to build your personalized menu.
          </p>
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 w-full space-y-12">
        
        {/* 1. Food Personas Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>

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

        {/* 3. Softened Seed Foods Selection Grid */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {selectedPersona ? `Dishes for "${selectedPersona.title}"` : "Popular dishes to pick"}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {displayDishes.slice(0, 100).map((item) => {
              const isPicked = selectedSeedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleSeed(item.id)}
                  className={`group rounded-2xl overflow-hidden bg-white dark:bg-[#141820] transition-all cursor-pointer relative flex flex-col justify-between shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] ${
                    isPicked ? 'ring-2 ring-[#E23744] bg-red-50/50 dark:bg-rose-950/20' : 'border border-gray-100 dark:border-white/5'
                  }`}
                >
                  {/* Image Poster */}
                  <div className="h-40 w-full relative overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Pick Checkmark Overlay */}
                    {isPicked && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-10 h-10 bg-[#E23744] rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Veg/Non-veg dot (Zomato style top left) */}
                    <div className="absolute top-2 left-2 bg-white/90 p-1 rounded shadow-sm flex items-center justify-center">
                      <div className={`w-3.5 h-3.5 flex items-center justify-center border ${item.is_veg ? 'border-green-600' : 'border-red-600'} rounded-sm`}>
                        <div className={`w-2 h-2 ${item.is_veg ? 'bg-green-600 rounded-full' : 'bg-red-600'} ${item.is_veg ? '' : 'clip-polygon-[50%_0,0_100%,100%_100%] rounded-sm'}`} style={!item.is_veg ? { clipPath: 'polygon(50% 10%, 0% 100%, 100% 100%)', borderRadius: '1px' } : {}} />
                      </div>
                    </div>

                    {!isPicked && (
                      <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white text-[#E23744] shadow-md flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Title & Price */}
                  <div className="p-4 space-y-1">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">
                      {item.name}
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400 block mt-1">₹{item.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (Zomato style minimal) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141820]/95 backdrop-blur-md border-t border-gray-100 dark:border-white/5 px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {canProceed ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2">
                <Check className="w-5 h-5" />
                {selectedSeedIds.length} dishes selected. Ready to serve!
              </span>
            ) : (
              <span className="text-gray-500 font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#E23744]" />
                Select {remainingNeeded} more to continue
              </span>
            )}
          </div>

          <button
            onClick={handleFinish}
            disabled={!canProceed}
            className={`px-8 py-3 rounded-xl font-bold text-base transition-all flex items-center gap-2 ${
              canProceed
                ? 'bg-[#E23744] hover:bg-[#c9303d] text-white shadow-lg shadow-[#E23744]/30 active:scale-95'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Show Recommendations</span>
            {canProceed && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
