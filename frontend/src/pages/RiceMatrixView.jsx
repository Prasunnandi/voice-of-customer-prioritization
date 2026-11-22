import React, { useState } from 'react';
import { 
  BarChart2, 
  Target, 
  Sparkles, 
  DollarSign, 
  ArrowUpRight, 
  CheckCircle2, 
  Edit3, 
  Sliders, 
  FileText,
  Search
} from 'lucide-react';

export default function RiceMatrixView({ features, onUpdateRice }) {
  const [selectedFeature, setSelectedFeature] = useState(features[0] || null);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [reachVal, setReachVal] = useState(25000);
  const [effortVal, setEffortVal] = useState(2.0);

  const filtered = features.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.theme.toLowerCase().includes(search.toLowerCase()) ||
    f.kanoCategory.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (feat) => {
    setSelectedFeature(feat);
    setReachVal(feat.reach);
    setEffortVal(feat.effort);
  };

  const handleSaveRice = (e) => {
    e.preventDefault();
    if (selectedFeature) {
      onUpdateRice(selectedFeature.id, {
        reach: reachVal,
        effort: effortVal
      });
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Enterprise ARR at Risk</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">$17.15M</span>
            <span className="text-xs text-emerald-500/80 font-medium">8 Enterprise Epics</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Weighted across Salesforce lost reasons
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Must-Be Table Stakes</span>
            <Target className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-rose-400 font-mono">
              {features.filter(f => f.kanoCategory === 'Must-Be').length} Epics
            </span>
            <span className="text-xs text-rose-400/80 font-medium">Churn Drivers</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Causes extreme dissatisfaction if missing
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Highest RICE Score</span>
            <BarChart2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-purple-400 font-mono">90,000</span>
            <span className="text-xs text-slate-400">Dark Mode</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Massive reach (50k) with minimal effort (0.5m)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Customer Verbatim Base</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-cyan-400 font-mono">1,950</span>
            <span className="text-xs text-cyan-500/80 font-medium">Clustered Quotes</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Zendesk, G2, in-app surveys, NPS
          </div>
        </div>
      </div>

      {/* Main Grid: Left Features List / Right RICE Calculator Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prioritization Table */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              RICE Prioritized Backlog ({features.length})
            </span>
            <input
              type="text"
              placeholder="Search features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 px-2.5 py-1 rounded-lg w-44 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-3 px-4 font-semibold">Epic / Feature</th>
                    <th className="py-3 px-4 font-semibold">Kano Model</th>
                    <th className="py-3 px-4 font-semibold">RICE Score</th>
                    <th className="py-3 px-4 font-semibold">Effort (PM)</th>
                    <th className="py-3 px-4 font-semibold text-right">ARR Sizing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {filtered.map((feat) => {
                    const isSelected = selectedFeature?.id === feat.id;
                    const isMustBe = feat.kanoCategory === 'Must-Be';

                    return (
                      <tr 
                        key={feat.id} 
                        onClick={() => handleSelect(feat)}
                        className={`cursor-pointer transition ${
                          isSelected ? 'bg-purple-950/30 text-white' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-200 block font-sans text-xs">{feat.name}</span>
                          <span className="text-slate-500 text-[10px]">{feat.theme}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isMustBe 
                              ? 'bg-rose-500/20 text-rose-300' 
                              : feat.kanoCategory === 'Performance'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}>
                            {feat.kanoCategory}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-purple-400 font-bold">
                          {feat.riceScore.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {feat.effort} mo
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-400">
                          ${(feat.revenueArrUsd / 1000000).toFixed(2)}M
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: RICE Parameters Tuner & PRD Brief */}
        <div className="lg:col-span-5 space-y-4">
          {selectedFeature ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono text-purple-400 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded">
                      {selectedFeature.id}
                    </span>
                    <span className="text-slate-400">{selectedFeature.theme}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">{selectedFeature.name}</h3>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-1 rounded bg-emerald-950/50 border border-emerald-800/60">
                  ${(selectedFeature.revenueArrUsd / 1000000).toFixed(2)}M ARR
                </span>
              </div>

              {/* Customer Verbatim Quote */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                <span className="text-slate-400 font-semibold flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Synthesized Customer Verbatim ({selectedFeature.mentions} quotes):</span>
                </span>
                <p className="text-slate-200 italic leading-relaxed">
                  "{selectedFeature.topVerbatim}"
                </p>
              </div>

              {/* Interactive RICE Slider Controls */}
              <div className="space-y-3 pt-1">
                <span className="text-xs font-bold text-slate-300 block">RICE Equation Variables:</span>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Reach (Monthly Users):</span>
                    <span className="font-mono text-purple-400 font-bold">{reachVal.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="60000"
                    step="1000"
                    value={reachVal}
                    onChange={(e) => setReachVal(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Engineering Effort (Person Months):</span>
                    <span className="font-mono text-purple-400 font-bold">{effortVal} mo</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="4.0"
                    step="0.5"
                    value={effortVal}
                    onChange={(e) => setEffortVal(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400">Live RICE Score: </span>
                    <strong className="text-purple-300 font-mono text-sm">
                      {Math.round((reachVal * selectedFeature.impact * selectedFeature.confidence) / effortVal).toLocaleString()}
                    </strong>
                  </div>

                  <button
                    onClick={handleSaveRice}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition"
                  >
                    Save & Recalculate
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs">
              Select an epic to tune RICE variables.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
