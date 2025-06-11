// This assumes you’re using Vercel/Next.js API routes

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const {
      email,
      product_name,
      price,
      sale_id,
      custom_fields,
      purchase_timestamp,
    } = req.body;

    // Optional: Verify Gumroad signature here for extra security

    const aiqScore = custom_fields?.aiScore || 'unknown';
    const aiqTier = custom_fields?.aiTier || 'unknown';
    const aiqTools = custom_fields?.aiTools || 'None';
    const aiqProjects = custom_fields?.aiProjects || 'None';

    // Call OpenAI to generate custom recommendation
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert AI learning coach. Generate a personalized learning plan for the user based on their AIQ profile.',
          },
          {
            role: 'user',
            content: `User Info:
Score: ${aiqScore}
Tier: ${aiqTier}
Tools: ${aiqTools}
Projects: ${aiqProjects}

Please write a 3-part HTML learning plan:
1. Encouragement and reflection
2. Actionable next steps
3. Suggested AI tools to learn next`,
          },
        ],
      }),
    });

    const gptData = await openaiRes.json();
    const recommendationHTML = gptData.choices?.[0]?.message?.content || 'No plan generated.';

    // Send email using your preferred email service
    await fetch('https://api.your-email-service.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Your Custom AIQ Plan is Ready!',
        html: `
          <h1>Your AIQ Plan</h1>
          ${recommendationHTML}
          <hr />
          <p>Thanks for purchasing. Keep leveling up your AI superpowers! 🚀</p>
        `,
      }),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
