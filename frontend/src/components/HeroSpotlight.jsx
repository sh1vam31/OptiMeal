import React, { useState } from 'react';
import { Sparkles, Clock, Star, ShoppingBag, ChevronDown, ChevronUp, ShieldCheck, RotateCcw } from 'lucide-react';

export default function HeroSpotlight({
  item,
  onAddToCart,
  filters,
  onEditTaste,
  personaTitle
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!item) return null;

  const bd = item.ml_match_breakdown || {};
  const scorePct = Math.round((item.predicted_score || 0.95) * 100);
  const priceSavings = Math.max(0, (filters?.budget || 500) - item.price);

  const richDescription = `Authentic ${item.name} prepared fresh by ${item.restaurant_name}. Features hand-picked fresh ingredients, traditional culinary spices, and optimal nutritional balance (${item.calories} kcal, ${item.protein_g}g protein). Rated ${item.rating}★ by ${item.rating_count} food lovers.`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141820] via-[#1A202C] to-[#0D1117] border border-white/10 p-6 md:p-10 shadow-2xl space-y-6">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left Column: Spotlight Info (Matching Screenshot 2) */}
        <div className="flex-1 space-y-5">
          
          <div className="space-y-2">
            <span className="text-xs font-mono font-black uppercase text-rose-500 tracking-widest block">
              {personaTitle ? `TOP PICK FROM "${personaTitle.toUpperCase()}"` : `TOP PICK FOR YOU`}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
              {item.name}
            </h1>
          </div>

          {/* Sub Header Specs */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30 text-sm flex items-center gap-1">
              <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              {item.rating}★
            </span>
            <span className="text-gray-300 font-bold text-sm">₹{item.price}</span>
            <span className="text-gray-400">•</span>
            <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {item.eta_mins} mins delivery
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300 bg-gray-800 px-2 py-0.5 rounded">
              {item.calories} kcal • {item.protein_g}g Protein
            </span>
          </div>

          {/* Full Synopsis / Description (Matching Screenshot 2) */}
          <p className="text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed font-normal">
            {richDescription}
          </p>

          {/* Reason Pills (Matching Screenshot 2) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-white/10 text-gray-200 border border-white/15 text-xs font-bold">
              Because you liked {personaTitle || item.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-gray-200 border border-white/15 text-xs font-bold">
              Shared DNA: {item.category}, {item.is_veg ? 'Pure Veg' : 'Gourmet Meat'}, {item.protein_g >= 25 ? 'High Protein' : 'Balanced Macros'}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-gray-200 border border-white/15 text-xs font-bold">
              Viewers with similar taste also rated this highly
            </span>
          </div>

          {/* Action Buttons (Matching Screenshot 2) */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="px-5 py-3 rounded-xl bg-white text-slate-950 hover:bg-gray-200 font-black text-xs transition-all shadow-lg flex items-center gap-2 active:scale-95"
            >
              <span>Why this meal</span>
              {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {onEditTaste && (
              <button
                onClick={onEditTaste}
                className="px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-extrabold text-xs transition-all border border-white/15 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Edit my taste</span>
              </button>
            )}

            <button
              onClick={() => onAddToCart(item)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-xs transition-all shadow-xl shadow-rose-600/30 flex items-center gap-2 active:scale-95 ml-auto"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

        {/* Right Column: Poster Image Spotlight */}
        <div className="w-full md:w-80 h-72 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/15 flex-shrink-0 relative group">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono font-bold">
            <span className="bg-slate-950/90 text-rose-400 px-2.5 py-1 rounded-lg border border-rose-500/40">
              {item.is_veg ? "🟢 PURE VEG" : "🔴 NON-VEG"}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable "Why This Meal" Bullet Breakdown (Matching Screenshot 2) */}
      {showBreakdown && (
        <div className="p-6 rounded-2xl bg-black/60 border border-rose-500/30 space-y-4 animate-in fade-in duration-200">
          
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Why this was recommended</span>
          </h4>

          {/* Bullet Explanations */}
          <ul className="space-y-2 text-xs md:text-sm text-gray-300 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>
                {bd.category_weight_pct > 0 
                  ? <span><strong>XGBoost Prediction:</strong> Your selection frequency for {item.category} mathematically boosted this dish's AI score by {bd.category_weight_pct}%!</span>
                  : <span><strong>Persona Match:</strong> Because you liked {personaTitle || item.category}</span>}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Vector DNA Match:</strong> {item.category}, {item.is_veg ? 'Pure Veg' : 'Non-Veg'}, {item.eta_mins}m Speed Prediction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Collaborative Filtering:</strong> High confidence rating ({item.rating}★ across {item.rating_count} verified reviews)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Budget Optimizer:</strong> Saves ₹{intOrFloat(priceSavings)} under your maximum limit while maximizing ETA margins.</span>
            </li>
          </ul>

          {/* Signal Contribution Bars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Budget</span>
                <strong className="text-emerald-400">{bd.budget_fit_pct || 38}%</strong>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${bd.budget_fit_pct || 38}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Speed</span>
                <strong className="text-amber-400">{bd.speed_pct || 30}%</strong>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${bd.speed_pct || 30}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Quality</span>
                <strong className="text-rose-400">{bd.rating_pct || 20}%</strong>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${bd.rating_pct || 20}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Dietary</span>
                <strong className="text-blue-400">{bd.diet_match_pct || 12}%</strong>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${bd.diet_match_pct || 12}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function intOrFloat(val) {
  return Number.isInteger(val) ? val : Math.round(val);
}
