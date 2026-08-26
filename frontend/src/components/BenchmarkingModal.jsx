import React from 'react';
import { X, CheckCircle2, AlertCircle, ArrowRight, Zap, Target, Users, Layers } from 'lucide-react';

export default function BenchmarkingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel-glow max-w-3xl w-full rounded-2xl p-6 md:p-8 border border-emerald-500/40 relative space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
              Product Benchmarking
            </span>
            <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300 font-mono">
              PRD Section 7
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            IntentEats vs. Zomato / UberEats
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            A architectural comparison solving the <strong className="text-emerald-300">"Paradox of Choice"</strong> in food discovery through context-aware filtering and ML explainability.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Feature Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IntentEats Column */}
            <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 space-y-3 bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-emerald-400 text-base">IntentEats (Our System)</h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  Intent-First
                </span>
              </div>
              <ul className="text-xs space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Constraint-First UI:</strong> User inputs budget & ETA first; zero choice overload.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Explainability Badges:</strong> Transparent ML tags ("Fastest - 12m", "Top Rated") explain why an item won.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Sub-200ms 2-Stage Pipeline:</strong> Postgres SQL candidate generation + XGBoost ranking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Graceful Fallbacks:</strong> Recommends closest relaxed options on zero matches.</span>
                </li>
              </ul>
            </div>

            {/* Zomato Column */}
            <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-3 bg-gray-900/60">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-200 text-base">Zomato / UberEats</h4>
                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
                  Infinite Scroll
                </span>
              </div>
              <ul className="text-xs space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Endless Scroll Fatigue:</strong> Thousands of un-filtered items lead to decision paralysis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Black-Box Ranking:</strong> Ads and sponsored listings mask true relevance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Similarities:</strong> High-res imagery, rating systems, horizontal categories, and ETA predictions.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Limitations & Future Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Limitations */}
          <div className="p-4 rounded-xl bg-gray-900/80 border border-white/10 space-y-2 text-xs">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Current System Limitations</span>
            </h4>
            <p className="text-gray-300 leading-relaxed">
              1. XGBoost model lacks real-time collaborative filtering (what active peer users in the neighborhood are ordering right now).
            </p>
            <p className="text-gray-300 leading-relaxed">
              2. Uses simulated delivery ETA rather than live Google Maps traffic APIs.
            </p>
          </div>

          {/* Future Improvements */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2 text-xs">
            <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Future Improvement Roadmap</span>
            </h4>
            <p className="text-emerald-200/90 leading-relaxed">
              1. <strong>Group Order Constraint Math:</strong> Calculates the mathematical centroid of budget and ETA constraints for groups of 3+ users.
            </p>
            <p className="text-emerald-200/90 leading-relaxed">
              2. <strong>Dynamic Weather Multiplier:</strong> Adjusts ETA predictions based on real-time monsoon/rain data.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg"
        >
          Got it! Return to Recommender
        </button>
      </div>
    </div>
  );
}
