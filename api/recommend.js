// /api/recommend.js

import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const runtime = 'edge';

export async function POST(req) {
  const { score, tier, tools, projects, purpose } = await req.json();

  const intro = `The user received an AIQ score of ${score} placing them in the "${tier}" tier. They listed these tools: ${tools.join(", ")} and described their AI use/project goals as: "${projects}".`;

  let prompt = '';

  if (purpose === 'full-plan-paid') {
    prompt = `${intro}

Generate a detailed, three-part AI learning and application plan tailored to their score and responses. Include:

1. One specific AI concept or technique they should master next, and explain it clearly.
2. A guided mini-project or task they can do this week using that concept.
3. One overlooked tool or strategy they likely aren't using — with clear instructions on how to start.

Write in a helpful, motivating tone, and assume they just paid $25 for this, so overdeliver on value. Keep it digestible but insightful.`;
  } else {
    prompt = `${intro}

Suggest one clear next step they should take to level up their AI capability based on their tier.`;
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are an expert AI learning coach who gives custom recommendations based on users’ responses.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    onCompletion(completion) {
      return JSON.stringify({ html: `<div>${completion}</div>` });
    },
  });

  return new StreamingTextResponse(stream);
}




