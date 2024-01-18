const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: 'YOUR KEY HERE'
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "qual a cor do cavalo branco de napoleão?" }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();