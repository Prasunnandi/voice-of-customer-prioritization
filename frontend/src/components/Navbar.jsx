import React from 'react';
import { 
  MessageSquare, 
  RefreshCw, 
  DollarSign, 
  Target, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function Navbar({ onRefresh, loading, summary }) {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-300 font-mono">Workspace: Q1-Q2 Enterprise Product Roadmap</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>NLP Sentiment Clustered</span>
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {summary && (
          <div className="hidden lg:flex items-center space-x-4 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pipeline ARR:</span>
              <span className="font-semibold text-emerald-400">${(summary.totalArrUsd / 1000000).toFixed(1)}M</span>
            </div>
            <div className="w-px h-3 bg-slate-700" />
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Target className="w-3.5 h-3.5 text-rose-400" />
              <span>Must-Be Features:</span>
              <span className="font-semibold text-rose-400">{summary.mustBeCount}</span>
            </div>
            <div className="w-px h-3 bg-slate-700" />
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Delighters:</span>
              <span className="font-semibold text-purple-400">{summary.delighterCount}</span>
            </div>
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
          <span>Sync Feedback</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-purple-500/30">
          PM
        </div>
      </div>
    </header>
  );
}
