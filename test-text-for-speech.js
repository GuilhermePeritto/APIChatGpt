const OpenAI = require('openai');
const path = require('path');
const fs = require('fs');

const openai = new OpenAI({
    apiKey: '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'
});

const speechFile = path.resolve("./speech.mp3");

async function main() {
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "shimmer",
        input: "Seu texto aqui"
    });
    console.log(speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
}
main();