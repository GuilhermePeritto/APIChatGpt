import { Request, Response } from "express";
import { openai } from "../../global/openAi";
import { bufferToStream } from "../../utils/bufferToStream";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import fs from "fs";
import embeddingService from "../../services/embeddings";

const { OPENAIMODEL } = process.env;
if (!OPENAIMODEL) throw new Error("SECRET não encontrado nas variáveis de ambiente");


class IntegracaoGPTController {

    public async resumirConversasPorTexto(req: Request, res: Response) {
        try {
            const { texto } = req.body;

            if (!texto?.length) return res.status(400).send("Texto não informado")

            const response = await openai.completions.create({
                prompt: texto,
                model: OPENAIMODEL!,
                temperature: 0.5,
                max_tokens: 300,
            });

            res.status(200).send(response)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async converterAudioParaTexto(req: Request, res: Response) {
        try {
            const audioFile = req.file;

            if (!audioFile) {
                return res.status(400).json({ error: 'No audio file provided' });
            }

            const formData = new FormData();
            const audioStream = bufferToStream(audioFile.buffer);

            formData.append('file', audioStream, { filename: 'audio.mp3', contentType: audioFile.mimetype });
            formData.append('model', 'whisper-1');
            formData.append('response_format', 'json');

            const config = {
                headers: {
                    // @ts-ignore
                    "Content-Type": `multipart/form-data; boundary=${formData.__boundary}`,
                    "Authorization": `Bearer ${process.env.OPENAIKEY}`,
                },
            };

            const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, config);
            res.json(response.data);

        } catch (error) {
            res.status(500).json({ error });
        }
    }

    public async converterTextoParaAudio(req: Request, res: Response) {
        try {
            const { texto } = req.body;

            if (!texto?.length) return res.status(400).send("Texto não informado")

            const speechFile = path.resolve("./speech.mp3");

            const mp3 = await openai.audio.speech.create({
                model: "tts-1",
                voice: "shimmer",
                input: texto
            });
            const buffer = Buffer.from(await mp3.arrayBuffer());
            await fs.promises.writeFile(speechFile, buffer);

            res.status(200).send("Audio gerado com sucesso!")
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async criarImagem(req: Request, res: Response) {
        try {
            const { texto } = req.body;

            if (!texto?.length) return res.status(400).send("Texto não informado")

            const image = await openai.images.generate({
                model: "dall-e-2",
                prompt: texto
            });

            res.status(200).send(image.data)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async gerarSugestaoDeResposta(req: Request, res: Response) {
        try {
            const { texto } = req.body;

            if (!texto?.length) return res.status(400).send("Texto não informado")

            const response = await openai.chat.completions.create({
                messages: [{ role: "system", content: `Sugira uma resposta para a seguinte conversa: ${texto}` }],
                model: "gpt-3.5-turbo",
            })

            res.status(200).send(response)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async traduzirMensagemDeErro(req: Request, res: Response) {
        try {
            const { texto } = req.body;

            if (!texto?.length) return res.status(400).send("Texto não informado")

            const response = await openai.chat.completions.create({
                messages: [{ role: "system", content: `Explique a seguinte mensagem de erro para não programadores: ${texto}. E sugira uma solução.` }],
                model: "gpt-3.5-turbo",
            })

            res.status(200).send(response)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async perguntaComBaseEmManuais(req: Request, res: Response) {
        try {
            const pergunta = req.body.texto,
            enumTipoSistemas = req.body.enumTipoSistema;

            if (!pergunta) return res.status(400).send({ message: "Texto não informado" });

            const { data } = await openai.embeddings.create({
                input: pergunta,
                model: "text-embedding-3-small",
            })

            const semanticSearch = await embeddingService.semanticSearch(data[0].embedding, 0, 4, enumTipoSistemas);

            if (!semanticSearch.length) return res.status(404).send({ message: "Nenhum resultado encontrado" });

            const contexto = semanticSearch.map(el => el.text);

            let response = await openai.chat.completions.create({
                messages: [{ role: 'user', content: `Com base neste contexto ${contexto.join(" ")} responda: ${pergunta} e caso não encontrar no uma resposta exata no 
                contexto, responda: Não consigo responder a essa pergunta` }],
                model: "gpt-4"
            });

            if(response.choices[0].message.content?.toLocaleLowerCase().includes("não consigo responder a essa pergunta")){
                 response = await openai.chat.completions.create({
                    messages: [{ role: 'user', content: `Com base na sua base de conhecimento responda ${pergunta} e caso nao 
                    consiga responder, responda: Não consigo responder a essa pergunta` }],
                    model: OPENAIMODEL!,
                });
            }

            return res.status(200).send( response.choices[0].message.content )
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

export default new IntegracaoGPTController()