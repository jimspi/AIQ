export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { score, tier, tools, answers, projects, type } = req.body;

  // Dummy GPT-style response logic (replace with your GPT call if you have an OpenAI proxy)
  let message = "Based on your score and responses, here's a recommended learning path.";
  if (score < 40) {
    message = "You're at the start of your AI journey. Focus on foundational tools like ChatGPT and DALL·E.";
  } else if (score < 70) {
    message = "You have some experience. Try exploring prompt engineering and automation using Zapier or Make.";
  } else {
    message = "You're advanced! Push into fine-tuning, AI APIs, or building your own agents.";
  }

  res.status(200).json({
    html: `<p><strong>Your AIQ Tier:</strong> ${tier}</p>
           <p><strong>Tools Used:</strong> ${tools.join(", ") || 'None listed'}</p>
           <p><strong>Projects:</strong> ${projects || 'No projects entered'}</p>
           <p>${message}</p>`
  });
}
