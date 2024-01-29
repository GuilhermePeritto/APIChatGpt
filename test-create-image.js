const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: 'SUA API KEY AQUI'
});

async function main() {
    const image = await openai.images.generate({ model: "dall-e-2", prompt: "DESCRICÃO DA IMAGEM AQUI" });
  
    console.log(image.data);
  }
  main();