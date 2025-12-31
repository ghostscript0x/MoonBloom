const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateInsights = async (userData, cycles) => {
  try {
    // Analyze patterns from the detailed cycle data
    const analysis = analyzeCyclePatterns(cycles);

    const prompt = `You are a compassionate menstrual health AI assistant. Analyze the following comprehensive user data and provide personalized, supportive insights.

## User Profile:
- Cycle Length: ${userData.cycleLength} days
- Period Length: ${userData.periodLength} days
- Last Period Start: ${userData.lastPeriodStart}

## Detailed Cycle Analysis:
${JSON.stringify(analysis, null, 2)}

## Recent Cycles (last 10 entries):
${JSON.stringify(cycles.slice(0, 10), null, 2)}

## Analysis Requirements:
Generate 4-6 personalized insights that demonstrate deep understanding of the user's patterns. Each insight should include:

1. **Pattern Recognition**: Identify correlations between symptoms, mood, and cycle phases
2. **Health Correlations**: Link lifestyle factors (sleep, exercise, water) to cycle health
3. **Predictive Insights**: Anticipate upcoming symptoms or energy patterns
4. **Personalized Recommendations**: Specific, actionable advice based on their data
5. **Wellness Support**: Encouraging messages for challenging patterns

## Response Format:
Return a JSON array of insights, each with:
- title: Clear, concise title (max 50 chars)
- message: Supportive, detailed message (max 200 chars)
- confidence: Number 0-100 based on data strength
- type: "pattern" | "prediction" | "tip" | "warning" | "celebration"
- category: "mood" | "symptoms" | "energy" | "health" | "cycle" | "wellness"

Focus on being empathetic, evidence-based, and empowering. Avoid medical diagnoses.`;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert menstrual health analyst. Provide compassionate, data-driven insights that empower users to understand and optimize their cycle health.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
      max_tokens: 1500,
      top_p: 1,
      stream: false,
    });

    const response = completion.choices[0].message.content;

    // Clean and parse the response
    let insights = [];
    try {
      // Remove any markdown formatting that might be present
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      insights = JSON.parse(cleanResponse);

      // Validate the response structure
      if (!Array.isArray(insights)) {
        throw new Error('Response is not an array');
      }

      // Ensure each insight has required fields
      insights = insights.map(insight => ({
        title: insight.title || 'Health Insight',
        message: insight.message || 'Take care of yourself today.',
        confidence: Math.min(100, Math.max(0, insight.confidence || 75)),
        type: ['pattern', 'prediction', 'tip', 'warning', 'celebration'].includes(insight.type)
          ? insight.type : 'tip',
        category: ['mood', 'symptoms', 'energy', 'health', 'cycle', 'wellness'].includes(insight.category)
          ? insight.category : 'wellness'
      }));

    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw response:', response);

      // Fallback insights
      insights = [
        {
          title: "Data Analysis Complete",
          message: "Your health data is being analyzed to provide personalized insights.",
          confidence: 100,
          type: "tip",
          category: "wellness"
        },
        {
          title: "Track Consistently",
          message: "Regular logging helps identify patterns and optimize your wellness routine.",
          confidence: 90,
          type: "tip",
          category: "wellness"
        }
      ];
    }

    return insights;
  } catch (error) {
    console.error('AI Insight generation error:', error);
    return [
      {
        title: "Welcome to Your Health Journey",
        message: "Start logging your daily health data to unlock personalized insights about your cycle.",
        confidence: 100,
        type: "tip",
        category: "wellness"
      }
    ];
  }
};

// Analyze patterns in cycle data
const analyzeCyclePatterns = (cycles) => {
  const analysis = {
    totalCycles: cycles.length,
    avgCycleLength: 0,
    avgPeriodLength: 0,
    commonSymptoms: {},
    moodPatterns: {},
    energyPatterns: {},
    sleepPatterns: {},
    painPatterns: {},
    lifestyleCorrelations: {},
    recentTrends: {}
  };

  if (cycles.length === 0) return analysis;

  // Calculate averages
  const cycleLengths = cycles
    .filter(c => c.phase === 'menstrual')
    .map(c => {
      // Calculate days since last period (simplified)
      return 28; // Placeholder - would need proper calculation
    });

  analysis.avgCycleLength = cycleLengths.length > 0
    ? cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
    : 28;

  // Analyze symptoms
  const symptomCount = {};
  cycles.forEach(cycle => {
    if (cycle.symptoms && Array.isArray(cycle.symptoms)) {
      cycle.symptoms.forEach(symptom => {
        symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
      });
    }
  });

  analysis.commonSymptoms = Object.entries(symptomCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  // Analyze mood patterns
  const moodCount = {};
  cycles.forEach(cycle => {
    if (cycle.mood) {
      moodCount[cycle.mood] = (moodCount[cycle.mood] || 0) + 1;
    }
  });

  analysis.moodPatterns = Object.entries(moodCount)
    .sort(([,a], [,b]) => b - a)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  // Analyze health metrics
  const recentCycles = cycles.slice(0, 7); // Last week

  const avgPain = recentCycles
    .filter(c => c.painIntensity !== undefined)
    .reduce((sum, c) => sum + (c.painIntensity || 0), 0) /
    recentCycles.filter(c => c.painIntensity !== undefined).length || 0;

  const avgEnergy = recentCycles
    .filter(c => c.energyLevel !== undefined)
    .reduce((sum, c) => sum + (c.energyLevel || 0), 0) /
    recentCycles.filter(c => c.energyLevel !== undefined).length || 0;

  analysis.energyPatterns = {
    averageEnergy: Math.round(avgEnergy || 5),
    averagePain: Math.round(avgPain || 0),
    recentTrend: recentCycles.length >= 3 ? analyzeTrend(recentCycles, 'energyLevel') : 'stable'
  };

  // Analyze sleep patterns
  const sleepCount = {};
  recentCycles.forEach(cycle => {
    if (cycle.sleepQuality) {
      sleepCount[cycle.sleepQuality] = (sleepCount[cycle.sleepQuality] || 0) + 1;
    }
  });

  analysis.sleepPatterns = Object.entries(sleepCount)
    .sort(([,a], [,b]) => b - a)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  return analysis;
};

// Helper function to analyze trends
const analyzeTrend = (cycles, metric) => {
  if (cycles.length < 3) return 'stable';

  const values = cycles
    .filter(c => c[metric] !== undefined)
    .map(c => c[metric])
    .slice(-3); // Last 3 entries

  if (values.length < 2) return 'stable';

  const first = values[0];
  const last = values[values.length - 1];

  if (last > first + 1) return 'improving';
  if (last < first - 1) return 'declining';
  return 'stable';
};

module.exports = { generateInsights };