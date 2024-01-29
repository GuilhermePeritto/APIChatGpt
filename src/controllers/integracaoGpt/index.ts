import { Request, Response } from "express";
import { openai } from "../../globals/openAi";
import { bufferToStream } from "../../utils/bufferToStream";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import fs from "fs";
import { PdfDocument } from "@ironsoftware/ironpdf";

class IntegracaoGptController {

    public async resumirConversasPorTexto(req: Request, res: Response) {
        try {
            const { texto } = req.body;

            if (!texto?.length) return res.status(400).send("Texto não informado")

            const response = await openai.completions.create({
                prompt: 'Como habilitar o uso dos registros de contas financeiras?',
                model: "ft:babbage-002:useall-software::8mQ0sWmr",
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

    public async treinando(req: Request, res: Response) {
        try {
            const pdf = await PdfDocument.open("configGeral.pdf"),
                text = await pdf.extractText();

            var chunks: string[] = [];

            for (var i = 0; i < text.length; i += 1024) {
                chunks.push(text.substring(i, i + 1024));
            }

            interface test {
                text: string,
                embedding: number[]
            }

            const embedding: test[] = [];

            for (const chunk of chunks) {

                const { data } = await openai.embeddings.create({
                    input: chunk,
                    model: "text-embedding-ada-002",
                });

                embedding.push({
                    text: chunk,
                    embedding: data[0].embedding
                })
            }

            const contexto = embedding.map((item) => item.text + item.embedding.join(", "));
            const prompt = `. Contexto: ${contexto.join(". ")}`;
            const response = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "Responda as perguntas com base no contexto abaixo, e se a pergunta não puder ser respondida diga 'Eu não sei responder isso'" },
                    { role: "system", content: `contexto: ${prompt.substring(0, 10000)}` },
                    { role: "system", content: "Pergunta: Como Habilitar filial para emissão de NFC-e em Santa Catarina?" }
                ],
                model: "gpt-4",
                temperature: 0,

            });

            return res.send(response);
        } catch (error) {
            res.status(500).send(error)
        }
    }

    private readPdf = async (pdf: string) => {
        const _pdf = await PdfDocument.open(pdf);
        const texto = await _pdf.extractText();

        return texto;
    }

    public gerarPlanilhaFineTunning = async (req: Request, res: Response) => {
        try {
            const texto = await this.readPdf("configGeral.pdf");

            const { choices } = await openai.chat.completions.create({
                messages: [{
                    role: "system", content: `Voce devera receber um texto e gerar um faqs de perguntas e respostas do manual de software para cada topico, onde seja possivel ter todas as explicações contida no documento,
                    todas as perguntas possiveis que voce consiga formular uma resposta e voce deverá responder
                    exatamente conforme exemplo abaixo no jsonl, por exemplo:
                    Oque voce deviria devolver: {"prompt": "Texto da pergunta formulada por voce com base no texto fornecido", "completion": "resposta gerada por voce com base no texto fornecido."}
                    voce devera apenas devolver o texto em formato json, sem explicações, e separando os objetos por vírgulas, com todos os objetos em uma mesma linha,
                    crie 3 variações de resposta para a mesma pergunta e para a mesma resposta, sem alterar o sentido, apenas as palavras,
                    segue o texto real da documentação para voce gerar as todas as perguntas possiveis do documento: ${texto}`
                }],
                model: "gpt-3.5-turbo",
            })

            const response = choices[0].message.content?.replaceAll("},", "}");
            const file_content = fs.readFileSync("./file_tunning.jsonl");
            const file = file_content.toString() + response!.toString();

            fs.writeFileSync("./file_tunning.jsonl", file);

            const training_file = await openai.files.create({ file: fs.createReadStream("./file_tunning.jsonl"), purpose: "fine-tune" }),
                trained_model = await openai.fineTuning.jobs.create({
                    training_file: training_file.id,
                    model: "babbage-002",
                });

            return res.status(200).send(trained_model)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async listAllJobs(req: Request, res: Response) {
        try {
            let events = await openai.fineTuning.jobs.list({ limit: 10 });
            return res.status(200).send(events)
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

export default new IntegracaoGptController()