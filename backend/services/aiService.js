const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateInsights = async (userData, cycles) => {
  try {
    const prompt = `Based on the following user cycle data, generate personalized insights about their menstrual health. Be supportive, informative, and gentle.

User cycle length: ${userData.cycleLength} days
Last period start: ${userData.lastPeriodStart}

Recent cycles: ${JSON.stringify(cycles.slice(0, 6), null, 2)}

Generate 3-5 insights including patterns, predictions, and tips. Each insight should have a title, message, confidence level (0-100), and type (pattern/prediction/tip/energy).`;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const response = completion.choices[0].message.content;
    // Parse the response into structured insights
    // This would need more sophisticated parsing in production
    return JSON.parse(response);
  } catch (error) {
    console.error('AI Insight generation error:', error);
    return [];
  }
};

module.exports = { generateInsights };