import React from 'react';
import { Database, Zap, Sparkles, Layers, Cpu, ShieldCheck, Code, Server, Activity, AlertTriangle, Play, Settings } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="space-y-16 max-w-5xl mx-auto py-8">
      {/* Hero Title */}
      <div className="text-center space-y-4">
        <span className="text-xs font-mono font-black uppercase text-rose-500 tracking-widest px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
          ARCHITECTURE & METHODOLOGY
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          A hybrid food recommender you can take apart in the browser
        </h1>
        <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          OptiMeal answers a real-world product question: <em>"What should this person eat right now under their active budget and delivery constraints?"</em> Everything underneath is transparent: SQL candidate generation, one weighted XGBoost sum, and a diversity pass.
        </p>
      </div>

      {/* Metrics Banner */}
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

      {/* The Engine (Scoring Formula) */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight">Scoring Engine</h2>
          <p className="text-sm text-gray-400">How XGBoost calculates the perfect dish.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
          <div className="md:col-span-3 p-6 rounded-2xl bg-[#0D0F12] border border-white/10 font-mono text-sm shadow-xl flex items-center">
            <pre className="text-gray-300 w-full overflow-x-auto">
<span className="text-rose-400">def</span> <span className="text-amber-300">rank_dish</span>(dish, user_prefs):
    score = (
        (budget_savings_margin * <span className="text-emerald-400">0.40</span>) +
        (eta_speed_advantage   * <span className="text-emerald-400">0.30</span>) +
        (dietary_alignment     * <span className="text-emerald-400">0.20</span>) +
        (bayesian_rating_prior * <span className="text-emerald-400">0.10</span>)
    )
    <span className="text-rose-400">return</span> apply_mmr_diversity(score)
            </pre>
          </div>
          
          <div className="md:col-span-2 space-y-4 flex flex-col justify-center">
            <div className="p-5 rounded-2xl bg-[#141820] border border-white/5 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2"><Settings className="w-4 h-4 text-emerald-400"/> Why a weighted sum?</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Every term stays inspectable at request time. Budget savings dominates (40%) to ensure users feel they are getting value, while speed (30%) satisfies immediate intent.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#141820] border border-white/5 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2"><Activity className="w-4 h-4 text-rose-400"/> Normalisation</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Each signal is min-max scaled to 0-1 across the candidates before blending. A ₹200 savings cannot mathematically crush a 40-minute speed advantage through raw magnitude.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data and protocol */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight">Data and Protocol</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#141820] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-rose-500 font-bold mb-2">
              <Database className="w-5 h-5" /> Dataset
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Swiggy/Zomato inspired Kaggle dataset. 14,512 food items clear the initial cleaning cuts.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Before the ML model runs, a strict SQL "Bouncer" uses composite indices on `(category, price, prep_time)` to instantly narrow the dataset down from 14,500 to ~40 candidates that strictly obey your dietary, rating, and calorie limits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141820] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-amber-500 font-bold mb-2">
              <ShieldCheck className="w-5 h-5" /> Evaluation
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Offline evaluation measures P50 latency limits at &lt; 15ms. 
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Relevance is measured implicitly by the delta between predicted rank vs baseline popularity rank. A Bayesian average is applied to low-count ratings pulling them toward the global mean (a perfect 5.0 from 2 raters cannot outrank a 4.5 from 300).
            </p>
          </div>
        </div>
      </div>

      {/* How to evaluate it */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight">How to evaluate it in two minutes</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#141820] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
              <Sparkles className="w-5 h-5" /> Browse like a member
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Go to the <strong>Browse</strong> tab. Pick your 5 seed dishes during Onboarding. Watch the hybrid model map your taste genome (e.g. "Shared DNA: High Protein") and recommend 5 targeted meals. Open any card to see the explanation bullets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141820] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
              <Cpu className="w-5 h-5" /> Inspect like an engineer
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Go to the <strong>Refine Search</strong> tab. Drag the Budget, Calorie, and Rating sliders. Fire the "Apply Filters" button and watch the SQL engine ruthlessly drop dishes while XGBoost re-ranks the survivors into a Top 10 list.
            </p>
          </div>
        </div>
      </div>

      {/* Where it falls short */}
      <div className="space-y-6 border-t border-white/10 pt-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight">Where it falls short</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-4">
            <div className="flex items-center gap-2 text-rose-500 font-bold mb-2">
              <AlertTriangle className="w-5 h-5" /> Known Limits
            </div>
            <ul className="text-sm text-gray-400 space-y-3 list-disc pl-4 marker:text-rose-500/50">
              <li>Explicit likes only. No real-time session dwell time or click-stream tracking.</li>
              <li>A static food slice, so live inventory constraints (e.g. "Sold Out") are absent.</li>
              <li>ETAs are strictly simulated via backend heuristics, lacking live geographic routing data.</li>
              <li>The "% match" badge is a rescaled model score for readability, not a true probability distribution.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
              <Layers className="w-5 h-5" /> What I would build next
            </div>
            <ul className="text-sm text-gray-400 space-y-3 list-disc pl-4 marker:text-indigo-500/50">
              <li>A two-tower neural ranker evaluated on the same split to replace or ensemble with XGBoost.</li>
              <li>LLM-driven diet planning: passing the Top 10 shortlist to an LLM to generate a week-long meal plan.</li>
              <li>Bandit exploration (e.g., UCB or Thompson Sampling) to occasionally surface hidden gems that users wouldn't normally search for.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
