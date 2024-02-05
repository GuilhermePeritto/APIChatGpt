import { Request, Response } from "express";
import { openai } from "../../global/openAi";
import fs from "fs";
import { readPdf } from "../../utils/readPdf";
import { formatTextToEmbbeding } from "../../utils/formatTextToEmbbeding";
import { PDFPath } from "../../global/constants/PDFPath";

class TreinamentoGptController {

    public createCompletitionsJSONL = async (req: Request, res: Response) => {
        try {
            fs.readdir(PDFPath, async (err, arquivos) => {
                if (err) {
                    return res.status(500).send(err);
                }

                for (const arquivo of arquivos) {
                    const text = await readPdf(`${PDFPath}/${arquivo}`),
                        formattedText = formatTextToEmbbeding(text);

                    const { choices } = await openai.chat.completions.create({
                        messages: [{
                            role: "system", content: `Você deverá receber um texto e criar um conjunto de perguntas e respostas em formato de FAQs, abordando cada tópico do manual de software. O objetivo é incluir todas as explicações presentes no documento, gerando perguntas que permitam respostas abrangentes. Responda exatamente conforme o exemplo abaixo, em formato JSON:
        
                            O que será fornecido: {"prompt": "Texto da pergunta formulada por você com base no texto fornecido", "completion": "Resposta gerada por você com base no texto fornecido."}
                            
                            Apenas devolva o texto em formato JSON, sem explicações, e separe os objetos por quebra de linha, com cada objeto em uma linha diferente. Crie três variações de resposta para a mesma pergunta e resposta, mantendo o sentido intacto.
                            
                            Segue o texto real da documentação para que você gere todas as perguntas possíveis do documento.
                            
                            ${formattedText}`
                        }],
                        model: "gpt-3.5-turbo",
                    })

                    const response = choices[0].message.content?.replaceAll("},", "}"),
                        file_content = fs.readFileSync("./fine_tunning_completitions.jsonl"),
                        newJsonlContent = file_content.toString() + response!.toString();

                    fs.writeFileSync("./fine_tunning_completitions.jsonl", newJsonlContent);
                }

                return res.status(200).send("Fine tunning jsonl gerado com sucesso!")
            });

        } catch (error) {
            res.status(500).send(error)
        }
    }

    public createChatJSONL = async (req: Request, res: Response) => {
        try {
            fs.readdir(PDFPath, async (err, arquivos) => {
                if (err) {
                    return res.status(500).send(err);
                }

                for (const arquivo of arquivos) {
                    const text = await readPdf(`${PDFPath}/${arquivo}`),
                        formattedText = formatTextToEmbbeding(text);

                    const { choices } = await openai.chat.completions.create({
                        messages: [{
                            role: "system", content: `Você deverá receber um texto e criar um conjunto de perguntas e respostas em formato de FAQs, abordando cada tópico do manual de software. O objetivo é incluir todas as explicações presentes no documento, gerando perguntas que permitam respostas abrangentes. Responda exatamente conforme o exemplo abaixo, em formato JSON:
        
                            O que será fornecido: {"messages": [{"role": "user", "content": "Pergunta que você irá gerar"}, {"role": "assistant", "content": "Resposta da pergunta."}]}
                            
                            Apenas devolva o texto em formato JSON, sem explicações, e separe os objetos por quebra de linha, com cada objeto em uma linha diferente. Crie três variações de resposta para a mesma pergunta e resposta, mantendo o sentido intacto.
                            
                            Segue o texto real da documentação para que você gere todas as perguntas possíveis do documento.
                            
                            ${formattedText}`
                        }],
                        model: "gpt-3.5-turbo",
                    })

                    const response = choices[0].message.content?.replaceAll("},", "}"),
                        file_content = fs.readFileSync("./fine_tunning_chat.jsonl"),
                        newJsonlContent = file_content.toString() + response!.toString();

                    fs.writeFileSync("./fine_tunning_chat.jsonl", newJsonlContent);
                }

                return res.status(200).send("Fine tunning jsonl gerado com sucesso!")
            });

        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async createCompletitionsModel(req: Request, res: Response) {
        try {
            const training_file = await openai.files.create({ file: fs.createReadStream("./fine_tunning_completitions.jsonl"), purpose: "fine-tune" }),
                trained_model = await openai.fineTuning.jobs.create({
                    training_file: training_file.id,
                    model: "babbage-002",
                });

            return res.send(trained_model);
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async createChatModels(req: Request, res: Response) {
        try {
            const training_file = await openai.files.create({ file: fs.createReadStream("./fine_tunning_chat.jsonl"), purpose: "fine-tune" }),
                trained_model = await openai.fineTuning.jobs.create({
                    training_file: training_file.id,
                    model: "gpt-3.5-turbo",
                });

            return res.send(trained_model);
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async list(req: Request, res: Response) {
        try {
            const data = await openai.fineTuning.jobs.list({ limit: 10 });

            return res.send(data);
        } catch (error) {
            res.status(500).send(error)
        }

    }
}

export default new TreinamentoGptController()