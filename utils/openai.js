const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getFunnyMessage(bunk, attendance) {
  const prompt = `The student can bunk  ${bunk} classes and has ${attendance}% attendance
  Write a short , sarcastic one-liner roast which hurts the soul.`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 50,
  });

  return response.choices[0].message.content.trim();
}

module.exports = { getFunnyMessage };
