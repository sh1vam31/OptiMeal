import React from 'react';
import { X, Star, Sparkles } from 'lucide-react';

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

  const similarItems = allItems
    .filter((i) => i.id !== item.id && i.category === item.category)
    .slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center p-0 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-6xl bg-white dark:bg-[#0f1218] text-gray-900 dark:text-white md:rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-200 h-full max-h-screen md:max-h-[95vh] flex flex-col overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-5 md:right-5 z-20 p-2.5 rounded-full bg-white/80 dark:bg-black/50 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-white/10 shadow-sm"
          aria-label="Close detail modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-4">

            {/* Breadcrumb */}
            <div className="text-[10px] text-gray-500 dark:text-gray-400 tracking-wide font-medium flex items-center gap-1 uppercase">
              <span className="hover:text-[#E23744] cursor-pointer transition-colors">Home</span>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="hover:text-[#E23744] cursor-pointer transition-colors">Pune</span>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="text-gray-800 dark:text-gray-200">{item.restaurant_name}</span>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-3 gap-2 h-56 md:h-[300px] rounded-2xl overflow-hidden relative group">
              <div className="col-span-2 relative h-full">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="col-span-1 flex flex-col gap-2 h-full">
                <img src={similarItems[0]?.image_url || item.image_url} className="w-full h-[calc(50%-4px)] object-cover group-hover:scale-105 transition-transform duration-500" alt="Gallery 1" />
                <div className="w-full h-[calc(50%-4px)] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  <img src={similarItems[1]?.image_url || item.image_url} className="w-full h-full object-cover" alt="Gallery 2" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors backdrop-blur-[1px]">
                    <span className="text-white font-bold text-sm">View Gallery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-3 pb-2">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{item.restaurant_name}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{item.category} • Prepared Fresh</p>
              </div>
              <div className="flex items-center gap-2.5 p-2 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm shrink-0">
                <div className="flex items-center justify-center bg-[#24963F] text-white font-bold px-2.5 py-1 rounded-xl text-sm shadow-sm">
                  {item.rating} <Star className="w-3.5 h-3.5 ml-1 fill-white" />
                </div>
                <div className="flex flex-col pr-1">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{item.rating_count} ratings</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Customer Reviews</span>
                </div>
              </div>
            </div>

            {/* Recommendation Section */}
            <div className="pt-2 pb-8">
              <h3 className="text-lg md:text-xl font-black text-[#E23744] tracking-tight mb-4">OptiMeal Recommendation</h3>

              {/* Two-column symmetric row */}
              <div className="flex flex-col-reverse md:flex-row gap-5 items-stretch">

                {/* Left: info + AI card (stretches to match image height) */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {item.is_veg ? (
                      <div className="w-3.5 h-3.5 border-2 border-emerald-500 flex items-center justify-center rounded-sm">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 border-2 border-rose-500 flex items-center justify-center rounded-sm">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                      </div>
                    )}
                    <span className="text-amber-600 dark:text-amber-400 text-[10px] font-bold bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/20">Bestseller</span>
                  </div>

                  <h4 className="text-base md:text-lg font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">{item.name}</h4>

                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">₹{item.price}</p>
                    <div className="flex items-center gap-1 text-[10px]">
                      <div className="flex items-center text-yellow-500 text-xs">
                        {'★'.repeat(Math.floor(item.rating))}
                        <span className="text-gray-300 dark:text-gray-700">{'★'.repeat(5 - Math.floor(item.rating))}</span>
                      </div>
                      <span className="text-gray-400 dark:text-gray-500">({item.rating_count})</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    A classic {item.category.toLowerCase()} dish. Matched with a <span className="font-bold text-[#E23744] dark:text-rose-400">{scorePct}% score</span> based on your preferences.
                  </p>

                  {/* AI Card — flex-1 so it fills the remaining left height */}
                  <div className="flex-1 max-w-sm bg-white dark:bg-[#1A1D24] p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between text-xs font-black text-slate-800 dark:text-slate-200 pb-3 border-b border-gray-200 dark:border-white/10 uppercase tracking-widest mb-3">
                      <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-[#E23744]" /> AI Breakdown</span>
                      <span className="px-2 py-1 rounded-md bg-rose-50 dark:bg-[#E23744]/10 text-[#E23744] dark:text-rose-400 border border-rose-200 dark:border-[#E23744]/30">{scorePct}% Match</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-4 text-xs font-medium flex-1 content-start">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-gray-700 dark:text-gray-300 font-bold">
                          <span>💰 Budget</span> <span className="text-emerald-500">{bd.budget_fit_pct || 38}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${bd.budget_fit_pct || 38}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-gray-700 dark:text-gray-300 font-bold">
                          <span>⚡ Speed</span> <span className="text-amber-500">{bd.speed_pct || 30}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${bd.speed_pct || 30}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-gray-700 dark:text-gray-300 font-bold">
                          <span>⭐ Rating</span> <span className="text-blue-500">{bd.rating_pct || 20}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${bd.rating_pct || 20}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-gray-700 dark:text-gray-300 font-bold">
                          <span>🥗 Nutrition</span> <span className="text-purple-500">{bd.diet_match_pct || 12}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: `${bd.diet_match_pct || 12}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: square dish image */}
                <div className="w-full md:w-44 shrink-0 flex flex-col items-center relative mt-2 md:mt-0">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-md">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => onAddToCart(item)}
                    className="w-28 py-2 bg-rose-50 dark:bg-white text-[#E23744] hover:bg-gray-100 border border-[#E23744]/20 rounded-xl font-black text-sm uppercase shadow-lg transition-all hover:scale-105 active:scale-95 absolute bottom-[-14px] z-10"
                  >
                    ADD
                  </button>
                  <div className="mt-10 text-xs text-gray-400 font-medium">Customisable</div>
                </div>
              </div>
            </div>

            {/* More like this */}
            {similarItems.length > 0 && (
              <div className="space-y-4 border-t border-gray-200 dark:border-white/10 pt-6 pb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">More like this</h3>
                <div className="space-y-6">
                  {similarItems.map(sItem => (
                    <div 
                      key={sItem.id} 
                      onClick={() => onSelectDish(sItem)}
                      className="flex flex-col-reverse md:flex-row gap-5 items-start p-3 -mx-3 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors pb-6 border-b border-gray-100 dark:border-white/5 last:border-0"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          {sItem.is_veg ? (
                            <div className="w-3 h-3 border border-emerald-500 flex items-center justify-center rounded-sm">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            </div>
                          ) : (
                            <div className="w-3 h-3 border border-rose-500 flex items-center justify-center rounded-sm">
                              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white hover:text-[#E23744] transition-colors">{sItem.name}</h4>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">₹{sItem.price}</p>
                        <div className="flex items-center gap-1 text-[10px]">
                          <div className="flex items-center text-yellow-500">
                            {'★'.repeat(Math.floor(sItem.rating))}
                            <span className="text-gray-300 dark:text-gray-700">{'★'.repeat(5 - Math.floor(sItem.rating))}</span>
                          </div>
                          <span className="text-gray-400 dark:text-gray-500">({sItem.rating_count} votes)</span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          A delicious {sItem.category.toLowerCase()} option ready in {sItem.eta_mins} mins.
                        </p>
                      </div>
                      <div className="w-full md:w-32 shrink-0 flex flex-col items-center relative mt-2 md:mt-0">
                        <div className="w-full aspect-square rounded-xl overflow-hidden shadow-sm">
                          <img src={sItem.image_url} alt={sItem.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); onAddToCart(sItem); }}
                          className="w-20 py-1.5 bg-rose-50 dark:bg-white text-[#E23744] hover:bg-gray-100 border border-[#E23744]/20 rounded-lg font-black text-xs uppercase shadow-md transition-all hover:scale-105 active:scale-95 absolute bottom-[-12px] z-10"
                        >
                          ADD
                        </button>
                        <div className="mt-8 text-[10px] text-gray-400">Customisable</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
