export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { score, tier, tools, answers, projects } = req.body;

  const prompt = `A user just completed an AI skill self-assessment. Here's their profile:

Score: ${score}
Tier: ${tier}
Tools Used: ${tools.join(', ') || 'None'}
Project Summary: ${projects || 'None'}

Generate a detailed, three-part AI learning and application plan tailored to their score and responses. Include:

1. One specific AI concept or technique they should master next, and explain it clearly.
2. A guided mini-project or task they can do this week using that concept.
3. One overlooked tool or strategy they likely aren't using — with clear instructions on how to start.

Write in a helpful, motivating tone, and assume they just paid $25 for this, so overdeliver on value. Keep it digestible but insightful.`;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert AI learning coach.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100
      })
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim() || 'Keep building your AI skills.';
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate message' });
  }
}// /api/recommend.js






