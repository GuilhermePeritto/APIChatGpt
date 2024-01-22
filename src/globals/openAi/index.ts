import OpenAI from "openai"
import { config } from "dotenv";

config();

const { OPENAIKEY } = process.env;
if (!OPENAIKEY) throw new Error("SECRET não encontrado nas variáveis de ambiente");

const openai = new OpenAI({
    apiKey: OPENAIKEY
});

export {openai};