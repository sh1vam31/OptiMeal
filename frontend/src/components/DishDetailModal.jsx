import React from 'react';
import { X, Star, Clock, ShoppingBag, Sparkles, ShieldCheck, ArrowRight, Utensils } from 'lucide-react';

export default function DishDetailModal({
  item,
  onClose,
  onAddToCart,
  onSelectDish,
  allItems = []
}) {
  if (!item) return null;

  const bd = item.ml_match_breakdown || {};
  const scorePct = Math.round((item.predicted_score || 0.92) * 100);

  // Find 6 similar dishes from the same category
  const similarItems = allItems
    .filter((i) => i.id !== item.id && (i.category === item.category || i.is_veg === item.is_veg))
    .slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#141820] text-white rounded-3xl border border-white/15 shadow-2xl overflow-hidden relative my-6 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-950/80 text-gray-300 hover:text-white hover:bg-gray-800 transition-all border border-white/10"
          aria-label="Close detail modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-7 flex-1">
          
          {/* Top Section: Poster Image & Info */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Image Poster */}
            <div className="w-full md:w-80 h-64 md:h-72 rounded-2xl overflow-hidden flex-shrink-0 relative border border-white/15 shadow-2xl group">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                {item.is_veg ? (
                  <span className="bg-slate-950/90 text-emerald-400 text-xs font-black px-3 py-1 rounded-lg border border-emerald-500/40 font-mono">
                    🟢 PURE VEG
                  </span>
                ) : (
                  <span className="bg-slate-950/90 text-rose-400 text-xs font-black px-3 py-1 rounded-lg border border-rose-500/40 font-mono">
                    🔴 NON-VEG
                  </span>
                )}
              </div>
            </div>

            {/* Title & Info */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="text-xs uppercase font-mono font-black text-rose-400 tracking-wider block">
                  INTENT EATS DETAIL
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-300 font-medium mt-1">Prepared fresh by <strong className="text-white">{item.restaurant_name}</strong></p>
              </div>

              {/* Sub-Header Metrics */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="text-emerald-400 font-bold bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-500/30 flex items-center gap-1.5 text-sm">
                  <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  {item.rating} ({item.rating_count} votes)
                </span>
                <span className="text-amber-300 bg-amber-500/15 px-3 py-1 rounded-xl border border-amber-500/30 flex items-center gap-1.5 text-sm">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {item.eta_mins} mins delivery
                </span>
                <span className="text-gray-200 bg-gray-800 px-3 py-1 rounded-xl border border-white/10 text-xs">
                  {item.calories} kcal • {item.protein_g}g Protein
                </span>
              </div>

              {/* Explainability Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {item.explainability_badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-white/10 text-gray-200 border border-white/15 shadow-sm"
                  >
                    {badge.label}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onAddToCart(item);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm transition-all shadow-xl shadow-rose-600/30 flex items-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart (₹{item.price})</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 my-4" />

          {/* Middle Section: Why this was recommended */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white tracking-wide uppercase font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>Why this was recommended</span>
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-500/30">
                {scorePct}% Match Score
              </span>
            </div>

            {/* Bullet Point Explanations */}
            <ul className="space-y-2.5 text-xs md:text-sm text-gray-300 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Matches active budget limit ({bd.budget_desc || `Saves under max budget`}).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Fast ETA within delivery window ({bd.speed_desc || `Delivered in ${item.eta_mins} mins`}).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>High customer rating prior ({item.rating}★ across {item.rating_count} reviews).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-400 font-bold">•</span>
                <span>{item.is_veg ? "100% Match with Pure Veg dietary preferences." : "Optimal protein & macro balance."}</span>
              </li>
            </ul>

            {/* Signal Contribution Progress Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2 text-xs font-mono">
              <div className="space-y-1.5 bg-gray-900/80 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Budget</span>
                  <strong className="text-rose-400">{bd.budget_fit_pct || 38}%</strong>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: `${bd.budget_fit_pct || 38}%` }} />
                </div>
              </div>

              <div className="space-y-1.5 bg-gray-900/80 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Speed</span>
                  <strong className="text-amber-400">{bd.speed_pct || 30}%</strong>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${bd.speed_pct || 30}%` }} />
                </div>
              </div>

              <div className="space-y-1.5 bg-gray-900/80 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Quality</span>
                  <strong className="text-emerald-400">{bd.rating_pct || 20}%</strong>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${bd.rating_pct || 20}%` }} />
                </div>
              </div>

              <div className="space-y-1.5 bg-gray-900/80 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Dietary</span>
                  <strong className="text-blue-400">{bd.diet_match_pct || 12}%</strong>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${bd.diet_match_pct || 12}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 my-4" />

          {/* Bottom Section: More like this */}
          {similarItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-white tracking-wide uppercase font-mono">
                More like this
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3.5">
                {similarItems.map((sItem) => (
                  <button
                    key={sItem.id}
                    onClick={() => onSelectDish(sItem)}
                    className="flex flex-col space-y-1.5 text-left group cursor-pointer"
                  >
                    <div className="h-36 w-full rounded-2xl overflow-hidden relative border border-white/10 group-hover:border-rose-500/50 transition-all shadow-md">
                      <img
                        src={sItem.image_url}
                        alt={sItem.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-2 right-2 bg-slate-950/90 text-emerald-400 text-xs font-mono font-bold px-2 py-0.5 rounded-lg border border-emerald-500/30">
                        ₹{sItem.price}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-300 group-hover:text-rose-400 transition-colors line-clamp-1">
                      {sItem.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
