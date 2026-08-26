import React from 'react';
import { AlertTriangle, RefreshCw, Sparkles, Clock, Star } from 'lucide-react';

export default function NoMatchFallback({ message, items, onRelaxConstraints }) {
  return (
    <div className="space-y-6">
      {/* Warning State Banner */}
      <div className="glass-panel border-amber-500/30 p-6 rounded-2xl border bg-amber-950/20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-xl font-bold text-white">No Exact Matches Found</h3>
          <p className="text-sm text-amber-200/80 leading-relaxed">{message}</p>
        </div>

        <button
          onClick={onRelaxConstraints}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Auto-Relax Constraints (₹600 / 45m)</span>
        </button>
      </div>

      {/* Closest Alternatives Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Closest Alternatives Recommended by AI</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <span className="absolute top-2 left-2 bg-slate-950/90 text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded border border-amber-500/30">
                    {item.category}
                  </span>
                </div>

                <h4 className="font-bold text-base text-white">{item.name}</h4>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>

                {/* Fallback Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.explainability_badges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
                <span className="text-base font-extrabold text-white font-mono">₹{item.price}</span>
                <span className="text-xs text-amber-300 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {item.eta_mins} mins
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
