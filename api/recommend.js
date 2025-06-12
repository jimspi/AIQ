export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const prompt = `A user has just completed an AI skill self-assessment and paid for a personalized learning plan. Their profile is:

- AI Score: ${score}
- Tier: ${tier}
- Tools Used: ${tools.join(', ') || 'None'}
- Project Summary: ${projects || 'None'}

Based on this, create a friendly, high-value, practical 3-part learning and action plan they can use this week. Tailor it to their skill level (${tier}). Use everyday language, and don’t overwhelm them with technical jargon. Avoid code-heavy tasks.

Your response must include:
1. A real-world concept or application of AI that fits their score and experience. Explain what it means and why it matters for everyday life or work.
2. A no-code project idea they can try this week using a free tool, or another level appropriate-friendly option. Be specific — walk them through what to do step-by-step.
3. A new tool, tip, or strategy they likely haven’t used yet — something powerful but simple, with an example of how to start using it today.

Make it feel like expert coaching — practical, encouraging, and worth the $25 they paid. Don’t overwhelm. Instead, spark confidence and momentum. Add a warm closing line like a coach would say. Keep it under 600 tokens.`;


  const teaserPrompt = `${basePrompt}

Based on this, give a quick 2-sentence teaser of how AI could improve their work or projects — enough to show potential and build curiosity.`;

  const prompt = purpose === 'full-plan-paid' ? fullPlanPrompt : teaserPrompt;

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
        max_tokens: purpose === 'full-plan-paid' ? 800 : 150
      })
    });

    const data = await response.json();
    console.log('OpenAI response:', data); // 👈 helps you debug

    const message = data.choices?.[0]?.message?.content?.trim();
    if (!message) throw new Error('Empty message from OpenAI');

    // Return a consistent JSON shape
    res.status(200).json({ html: `<p>${message.replace(/\n/g, '<br>')}</p>` });
  } catch (error) {
    console.error('Error in recommend API:', error);
    res.status(500).json({ error: 'AI plan generation failed.' });
  }
}







