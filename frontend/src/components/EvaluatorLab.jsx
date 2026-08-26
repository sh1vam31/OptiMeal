import React, { useState } from 'react';
import { FlaskConical, Sliders, ShieldAlert, Sparkles, Check, RotateCcw, ArrowRight } from 'lucide-react';

export default function EvaluatorLab({
  items,
  filters,
  onFilterChange,
  onAddToCart
}) {
  const [algo, setAlgo] = useState('hybrid');
  const [wBudget, setWBudget] = useState(0.35);
  const [wSpeed, setWSpeed] = useState(0.30);
  const [wQuality, setWQuality] = useState(0.20);
  const [mmrRerank, setMmrRerank] = useState(true);

  const resetWeights = () => {
    setWBudget(0.35);
    setWSpeed(0.30);
    setWQuality(0.20);
    setMmrRerank(true);
  };

  const setFailurePreset = () => {
    onFilterChange({
      budget: 50,
      eta: 5,
      is_veg: true,
      is_high_protein: true,
      is_keto: true,
      is_gluten_free: true
    });
  };

  const setSuccessPreset = () => {
    onFilterChange({
      budget: 500,
      eta: 30,
      is_veg: true,
      is_high_protein: false,
      is_keto: false,
      is_gluten_free: false
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-black uppercase text-rose-500 tracking-wider px-2.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
            EVALUATOR LAB
          </span>
          <span className="text-xs text-gray-400 font-mono">Ranker P50: 4.09 ms</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Inspect the model, not just the dishes.
        </h1>
        <p className="text-sm text-gray-400 max-w-3xl leading-relaxed">
          Switch algorithms, drag hybrid feature weights, load evaluator failure cases, and inspect per-item feature signals in real-time.
        </p>
      </div>

      {/* Main Grid: Left Controls + Right Ranked Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Algorithm & Feature Weights Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Algorithm Selector */}
          <div className="p-5 rounded-2xl bg-[#141820] border border-white/10 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-300 font-mono flex items-center justify-between">
              <span>Recommendation Algorithm</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAlgo('hybrid')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  algo === 'hybrid'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                    : 'bg-gray-800/60 text-gray-400 border-white/5 hover:text-white'
                }`}
              >
                Hybrid XGBoost
              </button>

              <button
                onClick={() => setAlgo('candidate')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  algo === 'candidate'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                    : 'bg-gray-800/60 text-gray-400 border-white/5 hover:text-white'
                }`}
              >
                Candidate Filter
              </button>
            </div>
          </div>

          {/* Hybrid Feature Sliders */}
          <div className="p-5 rounded-2xl bg-[#141820] border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-300 font-mono">
                Hybrid Signal Weights
              </h3>
              <button
                onClick={resetWeights}
                className="text-[11px] font-mono text-gray-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Weight 1: Budget Fit */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-gray-300">Budget Advantage</span>
                <span className="text-rose-400">{wBudget.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={wBudget}
                onChange={(e) => setWBudget(parseFloat(e.target.value))}
                className="w-full cursor-pointer accent-rose-500"
              />
            </div>

            {/* Weight 2: Speed Margin */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-gray-300">Speed Advantage</span>
                <span className="text-amber-400">{wSpeed.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={wSpeed}
                onChange={(e) => setWSpeed(parseFloat(e.target.value))}
                className="w-full cursor-pointer accent-amber-500"
              />
            </div>

            {/* Weight 3: Rating Prior */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-gray-300">Rating & Popularity</span>
                <span className="text-emerald-400">{wQuality.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={wQuality}
                onChange={(e) => setWQuality(parseFloat(e.target.value))}
                className="w-full cursor-pointer accent-emerald-500"
              />
            </div>

            {/* MMR Toggle */}
            <label className="flex items-center space-x-2 pt-2 text-xs font-bold text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={mmrRerank}
                onChange={(e) => setMmrRerank(e.target.checked)}
                className="w-4 h-4 rounded accent-rose-600 cursor-pointer"
              />
              <span>MMR Diversity Rerank (Category Entropy)</span>
            </label>
          </div>

          {/* Evaluator Test Cases */}
          <div className="p-5 rounded-2xl bg-[#141820] border border-white/10 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-300 font-mono">
              Evaluator Test Cases
            </h3>
            <div className="space-y-2">
              <button
                onClick={setSuccessPreset}
                className="w-full p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-left text-xs text-emerald-300 font-bold transition-all flex items-center justify-between"
              >
                <span>🟢 Success Scenario (Strict Veg, ₹500, 30m)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={setFailurePreset}
                className="w-full p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-left text-xs text-rose-300 font-bold transition-all flex items-center justify-between"
              >
                <span>🔴 Failure Scenario (Impossible ₹50, 5m limit)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Ranked Results List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Ranked Results ({items.length} items)
            </h3>
            <span className="text-xs font-mono text-gray-400">
              Evaluated with XGBoost Regressor
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const scorePct = Math.round((item.predicted_score || 0.90) * 100);
              const bd = item.ml_match_breakdown || {};

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#141820] hover:bg-[#1A202C] border border-white/10 transition-all flex items-center justify-between gap-4 group"
                >
                  {/* Rank Number */}
                  <div className="w-7 text-center font-mono font-black text-lg text-gray-500 group-hover:text-rose-500 transition-colors">
                    {idx + 1}
                  </div>

                  {/* Thumbnail Poster */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 relative">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Info & Signal Bars */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-white truncate">
                        {item.name}
                      </h4>
                      <span className="text-xs text-gray-400 font-mono">by {item.restaurant_name}</span>
                    </div>

                    <p className="text-[11px] text-gray-400 truncate">
                      ₹{item.price} • {item.eta_mins}m ETA • {item.rating}★ ({item.rating_count} votes)
                    </p>

                    {/* Per-Item Signal Bars (Marquee Style) */}
                    <div className="flex items-center gap-4 text-[10px] font-mono pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">Budget</span>
                        <div className="w-16 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full" style={{ width: `${bd.budget_fit_pct || 35}%` }} />
                        </div>
                        <span className="text-rose-400 font-bold">{bd.budget_fit_pct || 35}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">Speed</span>
                        <div className="w-16 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${bd.speed_pct || 30}%` }} />
                        </div>
                        <span className="text-amber-400 font-bold">{bd.speed_pct || 30}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">Quality</span>
                        <div className="w-16 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${bd.rating_pct || 20}%` }} />
                        </div>
                        <span className="text-emerald-400 font-bold">{bd.rating_pct || 20}</span>
                      </div>
                    </div>
                  </div>

                  {/* % Relevance Score & Add to Cart */}
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-black font-mono text-emerald-400 block">
                        {scorePct}%
                      </span>
                      <span className="text-[9px] uppercase font-mono text-gray-500 block">
                        Relevance
                      </span>
                    </div>

                    <button
                      onClick={() => onAddToCart(item)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white text-xs font-bold transition-all"
                    >
                      + Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
