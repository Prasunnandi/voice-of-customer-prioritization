import React, { useState, useMemo } from 'react';

/**
 * RICE Prioritization Matrix Grid
 * RICE Score = (Reach * Impact * Confidence) / Effort
 * Standard framework utilized by Product Managers to quantitatively rank roadmap initiatives.
 */
export default function RiceMatrixGrid() {
  const [initiatives, setInitiatives] = useState([
    {
      id: 'INIT-101',
      title: 'One-Click SSO (Okta & Google Workspace)',
      category: 'Enterprise Auth',
      reach: 12500,     // Users impacted per quarter
      impact: 2.0,       // 3=Massive, 2=High, 1=Medium, 0.5=Low, 0.25=Minimal
      confidence: 0.90,  // 100%=High, 80%=Medium, 50%=Low
      effort: 3.5,       // Person-weeks / Sprints
      owner: 'SecEng Team'
    },
    {
      id: 'INIT-102',
      title: 'AI Automated Ticket Summarization',
      category: 'AI Assistant',
      reach: 34000,
      impact: 3.0,
      confidence: 0.80,
      effort: 4.0,
      owner: 'ML Pod'
    },
    {
      id: 'INIT-103',
      title: 'Dark Mode UI Toggle in Mobile App',
      category: 'Mobile UX',
      reach: 18000,
      impact: 0.5,
      confidence: 1.00,
      effort: 1.0,
      owner: 'Mobile Team'
    },
    {
      id: 'INIT-104',
      title: 'Self-Serve Workspace Billing Portal',
      category: 'Growth & FinOps',
      reach: 8200,
      impact: 2.0,
      confidence: 0.95,
      effort: 2.0,
      owner: 'Growth Pod'
    },
    {
      id: 'INIT-105',
      title: 'Legacy SQL Warehouse Migration',
      category: 'Infrastructure',
      reach: 4000,
      impact: 1.0,
      confidence: 0.70,
      effort: 8.0,
      owner: 'Data Infra'
    }
  ]);

  const [sortField, setSortField] = useState('riceScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Compute RICE score for each initiative
  const scoredInitiatives = useMemo(() => {
    return initiatives.map(item => {
      const rice = (item.reach * item.impact * item.confidence) / Math.max(0.5, item.effort);
      let tier = 'Consider';
      if (rice >= 15000) tier = 'P0: Must-Have';
      else if (rice >= 7000) tier = 'P1: High-Value';
      else if (item.effort <= 1.5 && rice >= 3000) tier = 'P2: Quick-Win';
      else if (rice < 2000) tier = 'P3: De-prioritize';

      return {
        ...item,
        riceScore: Math.round(rice),
        priorityTier: tier
      };
    });
  }, [initiatives]);

  // Filter and sort
  const sortedInitiatives = useMemo(() => {
    let filtered = scoredInitiatives;
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(i => i.category === categoryFilter);
    }
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortAsc ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
  }, [scoredInitiatives, sortField, sortAsc, categoryFilter]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const updateField = (id, field, value) => {
    setInitiatives(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: parseFloat(value) || value };
      }
      return item;
    }));
  };

  const getTierColor = (tier) => {
    if (tier.startsWith('P0')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (tier.startsWith('P1')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (tier.startsWith('P2')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎯</span> RICE Prioritization Matrix
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Formula: <code className="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded font-mono">(Reach × Impact × Confidence) ÷ Effort</code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 border border-slate-700 outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Enterprise Auth">Enterprise Auth</option>
            <option value="AI Assistant">AI Assistant</option>
            <option value="Mobile UX">Mobile UX</option>
            <option value="Growth & FinOps">Growth & FinOps</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>

          <button
            onClick={() => handleSort('riceScore')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Sort by RICE Score {sortField === 'riceScore' ? (sortAsc ? '▲' : '▼') : ''}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Initiative</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('reach')}>Reach 👥</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('impact')}>Impact ⭐</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('confidence')}>Conf. 🎯</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('effort')}>Effort ⏱️</th>
              <th className="py-3 px-4 cursor-pointer text-right" onClick={() => handleSort('riceScore')}>RICE Score 🔥</th>
              <th className="py-3 px-4 text-center">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {sortedInitiatives.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition">
                <td className="py-4 px-4">
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.category} • Owner: {item.owner}</div>
                </td>

                {/* Reach */}
                <td className="py-4 px-3">
                  <input
                    type="number"
                    value={item.reach}
                    onChange={(e) => updateField(item.id, 'reach', e.target.value)}
                    className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono"
                  />
                </td>

                {/* Impact */}
                <td className="py-4 px-3">
                  <select
                    value={item.impact}
                    onChange={(e) => updateField(item.id, 'impact', e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                  >
                    <option value="3.0">3.0 (Massive)</option>
                    <option value="2.0">2.0 (High)</option>
                    <option value="1.0">1.0 (Medium)</option>
                    <option value="0.5">0.5 (Low)</option>
                    <option value="0.25">0.25 (Minimal)</option>
                  </select>
                </td>

                {/* Confidence */}
                <td className="py-4 px-3">
                  <select
                    value={item.confidence}
                    onChange={(e) => updateField(item.id, 'confidence', e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                  >
                    <option value="1.00">100% (High)</option>
                    <option value="0.80">80% (Medium)</option>
                    <option value="0.50">50% (Low)</option>
                  </select>
                </td>

                {/* Effort */}
                <td className="py-4 px-3">
                  <input
                    type="number"
                    step="0.5"
                    value={item.effort}
                    onChange={(e) => updateField(item.id, 'effort', e.target.value)}
                    className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono"
                  />
                  <span className="text-xs text-slate-500 ml-1">wks</span>
                </td>

                {/* RICE Score */}
                <td className="py-4 px-4 text-right">
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {item.riceScore.toLocaleString()}
                  </span>
                </td>

                {/* Priority Badge */}
                <td className="py-4 px-4 text-center">
                  <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getTierColor(item.priorityTier)}`}>
                    {item.priorityTier}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
