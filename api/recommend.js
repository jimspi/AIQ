// File: /api/recommend.js

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { score, tier, tools, answers, projects } = req.body;

  try {
    const messages = [
      {
        role: 'system',
        content:
          'You are an expert AI career coach helping users interpret their AI assessment score and create a personalized, motivating learning plan based on their skill profile.',
      },
      {
        role: 'user',
        content: `
User AI Score: ${score}
Tier: ${tier}
Tools Used: ${tools.length ? tools.join(', ') : 'None'}
Projects or Products Built: ${projects || 'None'}

Create a three-paragraph HTML response:
1. Motivation and recognition of their effort and tier.
2. Clear learning suggestions tailored to their skills/tools.
3. One concrete next step they should take.
Only return HTML.`
      }
    ];

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7
    });

    const html = completion.data.choices[0].message.content;
    res.status(200).json({ html });
  } catch (error) {
    console.error('GPT error:', error);
    res.status(500).json({ html: '<p>We couldn\'t load your personalized plan right now. Try again soon.</p>' });
  }
}

