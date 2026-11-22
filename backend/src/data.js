// Voice of Customer (VoC) Feedback Intelligence Dataset

export const featurePrioritization = [
  {
    id: "FEAT-101",
    name: "SCIM / Okta Enterprise SSO Directory Sync",
    theme: "Enterprise Security",
    mentions: 340,
    sentiment: -0.72,
    reach: 25000,
    impact: 3.0,
    confidence: 0.90,
    effort: 2.0,
    riceScore: 33750,
    kanoCategory: "Must-Be",
    revenueArrUsd: 4200000,
    topVerbatim: "We cannot roll this out company-wide to 5,000 employees without automatic deprovisioning via SCIM.",
    status: "PLANNED"
  },
  {
    id: "FEAT-102",
    name: "Automated Recurring Invoicing & Failed Payment Retries",
    theme: "Billing & Finance",
    mentions: 280,
    sentiment: -0.65,
    reach: 18000,
    impact: 3.0,
    confidence: 0.95,
    effort: 1.5,
    riceScore: 34200,
    kanoCategory: "Performance",
    revenueArrUsd: 3150000,
    topVerbatim: "Our finance team spends 15 hours a week manually chasing dunning emails and failed Stripe charges.",
    status: "IN_PROGRESS"
  },
  {
    id: "FEAT-103",
    name: "Export Raw Telemetry to Snowflake / BigQuery Sink",
    theme: "Data Analytics",
    mentions: 190,
    sentiment: -0.40,
    reach: 12000,
    impact: 2.0,
    confidence: 0.80,
    effort: 2.5,
    riceScore: 7680,
    kanoCategory: "Performance",
    revenueArrUsd: 2800000,
    topVerbatim: "CSV exports are useless at scale. We need streaming ingestion straight to our warehouse tables.",
    status: "PLANNED"
  },
  {
    id: "FEAT-104",
    name: "Custom Webhook Retries & Dead Letter Queue",
    theme: "Developer Experience",
    mentions: 215,
    sentiment: -0.55,
    reach: 14000,
    impact: 2.0,
    confidence: 0.85,
    effort: 1.0,
    riceScore: 23800,
    kanoCategory: "Must-Be",
    revenueArrUsd: 1950000,
    topVerbatim: "When our endpoint has a momentary 503, webhook events disappear into a black hole with no retry.",
    status: "IN_PROGRESS"
  },
  {
    id: "FEAT-105",
    name: "AI Semantic Search & Copilot Query Assistant",
    theme: "Productivity AI",
    mentions: 420,
    sentiment: 0.35,
    reach: 35000,
    impact: 2.0,
    confidence: 0.70,
    effort: 3.0,
    riceScore: 16333,
    kanoCategory: "Delighter",
    revenueArrUsd: 2400000,
    topVerbatim: "An AI search bar that understands natural questions like 'Show all deals stalled in legal' would save hours.",
    status: "PLANNED"
  },
  {
    id: "FEAT-106",
    name: "Native Dark Mode & High-Contrast Theme",
    theme: "UI / UX",
    mentions: 510,
    sentiment: 0.10,
    reach: 50000,
    impact: 1.0,
    confidence: 0.90,
    effort: 0.5,
    riceScore: 90000,
    kanoCategory: "Delighter",
    revenueArrUsd: 650000,
    topVerbatim: "Working late at night with white backgrounds is blinding. Please add a dark OLED mode.",
    status: "COMPLETED"
  }
];

export const feedbackChannels = [
  { source: "Zendesk Support Tickets", count: 840, avgSentiment: -0.58 },
  { source: "G2 / Capterra Reviews", count: 320, avgSentiment: 0.42 },
  { source: "Salesforce Churn / Lost Reason", count: 180, avgSentiment: -0.81 },
  { source: "In-App NPS Verbatims", count: 610, avgSentiment: 0.15 }
];
