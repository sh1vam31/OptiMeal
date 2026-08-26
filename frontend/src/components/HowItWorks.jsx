import React from 'react';
import { Database, Zap, Sparkles, Layers, Cpu, ShieldCheck } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-4">
      {/* Hero Title */}
      <div className="text-center space-y-4">
        <span className="text-xs font-mono font-black uppercase text-rose-500 tracking-widest px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
          ARCHITECTURE & METHODOLOGY
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          A hybrid food recommender you can take apart in the browser
        </h1>
        <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          IntentEats answers a real-world product question: <em>"What should this person eat right now under their active budget and delivery constraints?"</em> Everything underneath is transparent: four signals, one weighted sum, and a diversity pass.
        </p>
      </div>

      {/* Metrics Banner (4 Cards like Screenshot #3) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-[#141820] border border-white/10 text-center space-y-1">
          <span className="text-3xl font-black text-white font-mono block">14,512</span>
          <span className="text-xs text-gray-400 uppercase font-mono tracking-wider block">Food Catalog Size</span>
        </div>

        <div className="p-6 rounded-2xl bg-[#141820] border border-white/10 text-center space-y-1">
          <span className="text-3xl font-black text-emerald-400 font-mono block">2-Stage</span>
          <span className="text-xs text-gray-400 uppercase font-mono tracking-wider block">Candidate + ML Pipeline</span>
        </div>

        <div className="p-6 rounded-2xl bg-[#141820] border border-white/10 text-center space-y-1">
          <span className="text-3xl font-black text-amber-400 font-mono block">XGBoost</span>
          <span className="text-xs text-gray-400 uppercase font-mono tracking-wider block">Model Architecture</span>
        </div>

        <div className="p-6 rounded-2xl bg-[#141820] border border-white/10 text-center space-y-1">
          <span className="text-3xl font-black text-rose-500 font-mono block">4.09 ms</span>
          <span className="text-xs text-gray-400 uppercase font-mono tracking-wider block">P50 Rank Latency</span>
        </div>
      </div>

      {/* The 4 Recommendation Signals */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white tracking-tight text-center">
          The Four Recommendation Signals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Signal 01 */}
          <div className="p-6 rounded-2xl bg-[#141820] border border-white/10 space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center font-mono">
              <span className="text-3xl font-black text-rose-500">01</span>
              <span className="text-xs font-bold text-gray-400 bg-gray-800 px-2.5 py-0.5 rounded">Stage 1 Filter</span>
            </div>
            <h3 className="text-lg font-bold text-white">Candidate Generation (SQL Filtering)</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Executes composite index queries on PostgreSQL `(category, price, prep_time)` to instantly narrow down 14,512 dishes to 40 candidate meals matching user constraints in under 15ms.
            </p>
          </div>

          {/* Signal 02 */}
          <div className="p-6 rounded-2xl bg-[#141820] border border-white/10 space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center font-mono">
              <span className="text-3xl font-black text-amber-400">02</span>
              <span className="text-xs font-bold text-gray-400 bg-gray-800 px-2.5 py-0.5 rounded">ML Ranker</span>
            </div>
            <h3 className="text-lg font-bold text-white">XGBoost ML Ranking Model</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Scoring candidates via gradient boosted decision trees trained on budget savings margin, ETA speed advantage, user rating priors, and dietary constraint alignment.
            </p>
          </div>

          {/* Signal 03 */}
          <div className="p-6 rounded-2xl bg-[#141820] border border-white/10 space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center font-mono">
              <span className="text-3xl font-black text-emerald-400">03</span>
              <span className="text-xs font-bold text-gray-400 bg-gray-800 px-2.5 py-0.5 rounded">Quality Signal</span>
            </div>
            <h3 className="text-lg font-bold text-white">Bayesian Rating & Quality Prior</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Applies Bayesian rating adjustments pulling low-vote counts toward the global mean, preventing a 5.0★ rating with only 1 vote from outranking a proven 4.8★ with 1,000+ customer reviews.
            </p>
          </div>

          {/* Signal 04 */}
          <div className="p-6 rounded-2xl bg-[#141820] border border-white/10 space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-center font-mono">
              <span className="text-3xl font-black text-blue-400">04</span>
              <span className="text-xs font-bold text-gray-400 bg-gray-800 px-2.5 py-0.5 rounded">Diversity Pass</span>
            </div>
            <h3 className="text-lg font-bold text-white">Maximal Marginal Relevance (MMR)</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Re-ranks candidate lists by title deduplication and category entropy, ensuring users never see repeated dish names or duplicate options in the recommendation feed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
