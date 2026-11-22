import React from 'react';
import { 
  MessageSquare, 
  Smile, 
  Frown, 
  Meh, 
  DollarSign, 
  Layers, 
  ExternalLink 
} from 'lucide-react';

export default function FeedbackVerbatimView({ features }) {
  const verbatimQuotes = [
    { source: "Salesforce Churn Exit", customer: "Acme Corp ($240k ARR)", quote: "We lost our enterprise procurement audit because single sign-on without SCIM required manual password provisioning.", epic: "FEAT-101", sentiment: -0.85 },
    { source: "Zendesk High-Priority", customer: "Fintech Global ($180k ARR)", quote: "Credit card expiry auto-dunning is failing. We are writing custom scripts to handle failed invoices.", epic: "FEAT-102", sentiment: -0.70 },
    { source: "G2 Verified Review", customer: "DataFlow Systems ($90k ARR)", quote: "The platform is great, but exporting raw telemetry to Snowflake is painfully manual. We need native streaming sinks.", epic: "FEAT-103", sentiment: -0.45 },
    { source: "In-App NPS Feedback", customer: "CloudScale Inc ($120k ARR)", quote: "If webhook retries had exponential backoff and a dead-letter-queue, we could trust this for mission-critical order events.", epic: "FEAT-104", sentiment: -0.50 },
    { source: "Product Portal Request", customer: "Velocity Studio ($45k ARR)", quote: "Please give us a natural language search query box. Navigating complex filters is slow.", epic: "FEAT-105", sentiment: 0.40 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span>VoC Multi-Channel Semantic Verbatims</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Raw quotes aggregated from support tickets, customer success calls, and enterprise contract renewals.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-mono bg-purple-950/80 text-purple-300 border border-purple-800/60 px-2.5 py-1 rounded-lg">
            Channels: Zendesk • Salesforce • G2 • In-App NPS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {verbatimQuotes.map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-purple-400">{item.source}</span>
              <span className="text-emerald-400 font-mono font-bold">{item.customer}</span>
            </div>

            <p className="text-xs text-slate-200 italic leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/60">
              "{item.quote}"
            </p>

            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
              <span>Linked Epic: <code className="text-cyan-400">{item.epic}</code></span>
              <span className="flex items-center space-x-1">
                {item.sentiment < 0 ? (
                  <span className="text-rose-400 flex items-center space-x-1">
                    <Frown className="w-3.5 h-3.5" />
                    <span>Pain Score: {(item.sentiment * -100).toFixed(0)}%</span>
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <Smile className="w-3.5 h-3.5" />
                    <span>Positive Delighter</span>
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
