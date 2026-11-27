/**
 * Voice of Customer (VoC) Sentiment & Topic Classification Pipeline
 * Classifies qualitative user feedback into Bug, Feature Request, UX Pain, and Praise clusters
 * with VADER-style polarity valence sentiment scoring and customer impact prioritization.
 */

export const TOPIC_CATEGORIES = {
  BUG_DEFECT: 'BUG_DEFECT',
  FEATURE_REQUEST: 'FEATURE_REQUEST',
  UX_PAIN: 'UX_PAIN',
  PRAISE_DELIGHT: 'PRAISE_DELIGHT'
};

export const SENTIMENT_LABELS = {
  POSITIVE: 'POSITIVE',
  NEUTRAL: 'NEUTRAL',
  NEGATIVE: 'NEGATIVE'
};

const TOPIC_LEXICONS = {
  [TOPIC_CATEGORIES.BUG_DEFECT]: [
    'bug', 'error', 'crash', 'crashes', 'crashing', 'failed', 'failure', 'broken', 'freeze', 'freezes',
    'glitch', 'exception', 'blank', 'white screen', 'timeout', '500', '404', 'corrupt', 'not working'
  ],
  [TOPIC_CATEGORIES.FEATURE_REQUEST]: [
    'feature', 'wish', 'would love', 'please add', 'can you add', 'support for', 'missing', 'need an option',
    'ability to', 'integrate', 'integration', 'export to', 'webhook', 'api support', 'roadmap'
  ],
  [TOPIC_CATEGORIES.UX_PAIN]: [
    'confusing', 'unintuitive', 'hard to find', 'cluttered', 'complicated', 'cumbersome', 'awkward',
    'slow', 'laggy', 'too many clicks', 'cannot find', 'frustrating', 'hard to use', 'navigation'
  ],
  [TOPIC_CATEGORIES.PRAISE_DELIGHT]: [
    'love', 'great', 'awesome', 'amazing', 'superb', 'best', 'fantastic', 'seamless', 'smooth',
    'thank you', 'kudos', 'delightful', 'fast', 'helpful', 'clean', 'excellent', 'game changer'
  ]
};

const SENTIMENT_WEIGHTS = {
  // Positive
  love: 3.2,
  great: 2.5,
  awesome: 3.0,
  amazing: 3.1,
  superb: 2.8,
  best: 3.0,
  fantastic: 3.0,
  seamless: 2.4,
  smooth: 2.0,
  fast: 1.8,
  clean: 1.5,
  excellent: 3.0,
  helpful: 2.0,
  // Negative
  hate: -3.4,
  horrible: -3.2,
  terrible: -3.0,
  awful: -3.0,
  broken: -2.8,
  bug: -2.4,
  crash: -3.1,
  failed: -2.5,
  useless: -3.0,
  confusing: -2.2,
  frustrating: -2.6,
  slow: -2.0,
  annoying: -2.1,
  unusable: -3.5,
  poor: -2.0
};

export class VocTopicClassifier {
  /**
   * Tokenize text into lower-cased alpha tokens
   */
  tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  }

  /**
   * Compute normalized sentiment polarity score between -1.0 (very negative) and +1.0 (very positive)
   */
  analyzeSentiment(text) {
    const tokens = this.tokenize(text);
    if (tokens.length === 0) {
      return { score: 0.0, label: SENTIMENT_LABELS.NEUTRAL };
    }

    let sum = 0;
    let hitCount = 0;

    for (let i = 0; i < tokens.length; i++) {
      const word = tokens[i];
      if (SENTIMENT_WEIGHTS[word] !== undefined) {
        let weight = SENTIMENT_WEIGHTS[word];
        // Check for negations ("not", "never", "no")
        if (i > 0 && ['not', 'never', 'no', "don't", 'hardly'].includes(tokens[i - 1])) {
          weight = -weight * 0.8;
        }
        sum += weight;
        hitCount++;
      }
    }

    // Normalize using hyperbolic-like scaling
    const rawScore = hitCount > 0 ? sum / Math.sqrt(hitCount + 1) : 0;
    const normalizedScore = Number(Math.max(-1.0, Math.min(1.0, rawScore / 3.0)).toFixed(3));

    let label = SENTIMENT_LABELS.NEUTRAL;
    if (normalizedScore >= 0.15) {
      label = SENTIMENT_LABELS.POSITIVE;
    } else if (normalizedScore <= -0.15) {
      label = SENTIMENT_LABELS.NEGATIVE;
    }

    return {
      score: normalizedScore,
      label
    };
  }

  /**
   * Classify feedback text into the dominant topic category
   */
  classifyTopic(text) {
    const lower = (text || '').toLowerCase();
    const scores = {
      [TOPIC_CATEGORIES.BUG_DEFECT]: 0,
      [TOPIC_CATEGORIES.FEATURE_REQUEST]: 0,
      [TOPIC_CATEGORIES.UX_PAIN]: 0,
      [TOPIC_CATEGORIES.PRAISE_DELIGHT]: 0
    };

    for (const [topic, keywords] of Object.entries(TOPIC_LEXICONS)) {
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          scores[topic] += kw.includes(' ') ? 3 : 1; // multi-word matches get higher weight
        }
      }
    }

    // Find topic with highest match weight
    let bestTopic = TOPIC_CATEGORIES.FEATURE_REQUEST;
    let maxScore = -1;

    for (const [topic, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        bestTopic = topic;
      }
    }

    // If no keywords matched, infer from sentiment
    if (maxScore === 0) {
      const sentiment = this.analyzeSentiment(text);
      if (sentiment.score < -0.2) bestTopic = TOPIC_CATEGORIES.UX_PAIN;
      else if (sentiment.score > 0.2) bestTopic = TOPIC_CATEGORIES.PRAISE_DELIGHT;
      else bestTopic = TOPIC_CATEGORIES.FEATURE_REQUEST;
    }

    return {
      primaryTopic: bestTopic,
      topicConfidenceScores: scores
    };
  }

  /**
   * Run full classification pipeline on an individual customer feedback item
   */
  processFeedback(feedbackItem) {
    const text = typeof feedbackItem === 'string' ? feedbackItem : feedbackItem.text || feedbackItem.comment || '';
    const sentiment = this.analyzeSentiment(text);
    const topic = this.classifyTopic(text);

    // Compute actionable priority score (0 to 100)
    // Higher priority for enterprise customers, bugs, and strong negative sentiment
    let baseWeight = 40;
    if (topic.primaryTopic === TOPIC_CATEGORIES.BUG_DEFECT) baseWeight = 75;
    else if (topic.primaryTopic === TOPIC_CATEGORIES.UX_PAIN) baseWeight = 60;
    else if (topic.primaryTopic === TOPIC_CATEGORIES.FEATURE_REQUEST) baseWeight = 45;
    else if (topic.primaryTopic === TOPIC_CATEGORIES.PRAISE_DELIGHT) baseWeight = 15;

    const sentimentPenalty = sentiment.score < 0 ? Math.abs(sentiment.score) * 25 : 0;
    const priorityScore = Math.min(100, Math.round(baseWeight + sentimentPenalty));

    return {
      id: feedbackItem.id || `FB-${Date.now()}`,
      text,
      userTier: feedbackItem.userTier || 'STANDARD',
      topic: topic.primaryTopic,
      sentimentScore: sentiment.score,
      sentimentLabel: sentiment.label,
      priorityScore,
      actionUrgency: priorityScore >= 75 ? 'P0_IMMEDIATE' : priorityScore >= 50 ? 'P1_MEDIUM' : 'P2_BACKLOG'
    };
  }

  /**
   * Cluster an array of feedback items into categorized buckets
   */
  clusterBatch(feedbackItems = []) {
    const processed = feedbackItems.map((item) => this.processFeedback(item));

    const clusters = {
      [TOPIC_CATEGORIES.BUG_DEFECT]: [],
      [TOPIC_CATEGORIES.FEATURE_REQUEST]: [],
      [TOPIC_CATEGORIES.UX_PAIN]: [],
      [TOPIC_CATEGORIES.PRAISE_DELIGHT]: []
    };

    processed.forEach((item) => {
      if (clusters[item.topic]) {
        clusters[item.topic].push(item);
      }
    });

    const total = processed.length || 1;
    const distribution = {
      bugsCount: clusters[TOPIC_CATEGORIES.BUG_DEFECT].length,
      featureRequestsCount: clusters[TOPIC_CATEGORIES.FEATURE_REQUEST].length,
      uxPainCount: clusters[TOPIC_CATEGORIES.UX_PAIN].length,
      praiseCount: clusters[TOPIC_CATEGORIES.PRAISE_DELIGHT].length,
      bugsPct: Number(((clusters[TOPIC_CATEGORIES.BUG_DEFECT].length / total) * 100).toFixed(1)),
      featuresPct: Number(((clusters[TOPIC_CATEGORIES.FEATURE_REQUEST].length / total) * 100).toFixed(1)),
      uxPainPct: Number(((clusters[TOPIC_CATEGORIES.UX_PAIN].length / total) * 100).toFixed(1)),
      praisePct: Number(((clusters[TOPIC_CATEGORIES.PRAISE_DELIGHT].length / total) * 100).toFixed(1))
    };

    return {
      totalItems: processed.length,
      distribution,
      clusters,
      items: processed
    };
  }
}

// Dual ESM & CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TOPIC_CATEGORIES,
    SENTIMENT_LABELS,
    VocTopicClassifier
  };
}

export default VocTopicClassifier;
