import React from 'react';
import { Star, Clock, ShoppingBag, ArrowRight } from 'lucide-react';

export default function ExplorationFeed({
  trendingBanner,
  items,
  loading,
  onSelectCategory,
  onAddToCart,
  onOpenDishDetail
}) {
  return (
    <div className="space-y-6">
      
      {/* Swiggy Style Horizontal Category Avatar Bubbles */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            What's on your mind?
          </h2>
          <span className="text-xs font-mono text-[#E23744] dark:text-emerald-400">Scroll & click to filter</span>
        </div>

        <div className="flex items-center gap-5 lg:gap-8 overflow-x-auto pb-3 scrollbar-none justify-start xl:justify-between">
          {[
            { name: "Burgers", icon: "🍔" },
            { name: "Pizzas", icon: "🍕" },
            { name: "Rolls & Wraps", icon: "🌯" },
            { name: "Biryani", icon: "🍛" },
            { name: "Asian & Bowls", icon: "🍜" },
            { name: "North Indian", icon: "🥘" },
            { name: "South Indian", icon: "🫓" },
            { name: "Desserts", icon: "🍨" },
            { name: "Beverages", icon: "🥤" },
          ].map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="flex flex-col items-center justify-center p-4 lg:p-5 rounded-2xl bg-white dark:bg-[#141820] hover:bg-rose-50 dark:hover:bg-rose-600/20 border border-gray-200 dark:border-white/10 hover:border-[#E23744]/50 dark:hover:border-rose-500/50 shadow-sm transition-all flex-shrink-0 w-24 lg:w-32 group cursor-pointer"
            >
              <span className="text-3xl lg:text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-[11px] lg:text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white mt-2 line-clamp-1">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Zomato Style Dish Cards Grid (Clean layout without repetitive text badges) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-[#E23744] dark:text-emerald-400 font-bold">🌱</span>
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              Featured Intent Dishes
            </h2>
          </div>
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
            {items.length} items
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-72 rounded-2xl bg-white dark:bg-[#141820] animate-pulse border border-gray-200 dark:border-white/5 p-4 space-y-3">
                <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800/80 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenDishDetail ? onOpenDishDetail(item) : onSelectCategory(item.category)}
                className="group bg-white dark:bg-transparent zomato-card rounded-2xl overflow-hidden flex flex-col justify-between border border-gray-200 dark:border-white/10 cursor-pointer hover:border-[#E23744]/50 dark:hover:border-rose-500/50 transition-all"
              >
                <div>
                  {/* Food Image with Zomato/Swiggy Overlay Badges */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Veg / Non-Veg Tag */}
                    {item.is_veg ? (
                      <span className="absolute top-3 left-3 bg-white/95 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-md border border-emerald-500/20 backdrop-blur-md shadow-sm">
                        🟢 VEG
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 bg-white/95 text-rose-600 text-[10px] font-black px-2.5 py-1 rounded-md border border-rose-500/20 backdrop-blur-md shadow-sm">
                        🔴 NON-VEG
                      </span>
                    )}

                    {/* Swiggy Style Discount / Savings Badge */}
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-[#E23744] to-amber-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-lg shadow-lg">
                      {item.price <= 150 ? "DEAL ₹" + intOrFloat(item.price) : "SAVE ₹" + intOrFloat(maxSavings(item.price))}
                    </div>

                    {/* Delivery Time Badge */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 text-gray-900 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border border-gray-200 backdrop-blur-md shadow-sm">
                      <Clock className="w-3 h-3 text-[#E23744]" />
                      <span>{item.eta_mins} mins</span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-base text-gray-900 dark:text-white group-hover:text-[#E23744] dark:group-hover:text-emerald-300 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">by {item.restaurant_name}</p>
                      </div>

                      {/* Zomato Green Rating Badge */}
                      <div className="flex items-center gap-1 bg-[#24963F] text-white text-[11px] font-black px-1.5 py-0.5 rounded shadow-sm flex-shrink-0">
                        <span>{item.rating}</span>
                        <Star className="w-[10px] h-[10px] fill-white text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Price & Swiggy Style ADD Button */}
                <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-100 dark:border-white/5 mt-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-mono">PRICE</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white font-mono">₹{intOrFloat(item.price)}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-white hover:bg-rose-100 dark:hover:bg-emerald-400 text-[#E23744] dark:text-slate-950 font-black text-xs transition-all shadow-sm flex items-center gap-1 hover:scale-105 active:scale-95 cursor-pointer border border-[#E23744]/20 dark:border-transparent"
                  >
                    <span>ADD</span>
                    <span className="text-[#E23744] font-bold text-sm">+</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function intOrFloat(val) {
  return Number.isInteger(val) ? val : Math.round(val);
}

function maxSavings(price) {
  return Math.round(price * 0.25);
}
