export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { score, tier, tools, answers, projects } = req.body;

  const prompt = `A user just completed an AI skill self-assessment. Here's their profile:\n
Score: ${score}
Tier: ${tier}
Tools Used: ${tools.join(', ')}
Project Summary: ${projects}

Based on this, write a 1-2 sentence custom message offering motivation or direction that matches their current skill level. Avoid generic fluff. Make it feel like a coach or mentor would say it.`;

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
}
