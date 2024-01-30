import { Request, Response } from "express";
import { openai } from "../../globals/openAi";
import fs from "fs";
import { embeddingObject } from "../../types/embedding";
import embeddingService from "../../services/embeddings";
import { readPdf } from "../../utils/readPdf";

class TreinamentoGptController {

    public async gerarEmbeddingBaseadoEmArquivoPDF(req: Request, res: Response) {
        try {
            const pdfFile = req.file;

            const text = await readPdf(pdfFile?.buffer!),
                formattedText = text.replaceAll("\n", " "),
                embedding: embeddingObject[] = [];

            for (var i = 0; i < formattedText.length; i += 500) {

                const { data } = await openai.embeddings.create({
                    input: formattedText.substring(i, i + 500),
                    model: "text-embedding-ada-002",
                });

                const emb = {
                    text: formattedText.substring(i, i + 500),
                    embedding: data[0].embedding
                }

                embedding.push(emb);
                await embeddingService.create(emb);
            }

            return res.send(embedding);
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public gerarFineTunningModelBaseadoEmArquivoPDF = async (req: Request, res: Response) => {
        try {
            const text = await readPdf("configGeral.pdf");

            const { choices } = await openai.chat.completions.create({
                messages: [{
                    role: "system", content: `Voce devera receber um texto e gerar um faqs de perguntas e respostas do manual de software para cada topico, onde seja possivel ter todas as explicações contida no documento,
                    todas as perguntas possiveis que voce consiga formular uma resposta e voce deverá responder
                    exatamente conforme exemplo abaixo no jsonl, por exemplo:
                    Oque voce deviria devolver: {"prompt": "Texto da pergunta formulada por voce com base no texto fornecido", "completion": "resposta gerada por voce com base no texto fornecido."}
                    voce devera apenas devolver o texto em formato json, sem explicações, e separando os objetos por vírgulas, com todos os objetos em uma mesma linha,
                    crie 3 variações de resposta para a mesma pergunta e para a mesma resposta, sem alterar o sentido, apenas as palavras,
                    segue o texto real da documentação para voce gerar as todas as perguntas possiveis do documento: ${text}`
                }],
                model: "gpt-3.5-turbo",
            })

            const response = choices[0].message.content?.replaceAll("},", "}"),
                file_content = fs.readFileSync("./fine_tunning.jsonl"),
                newJsonlContent = file_content.toString() + response!.toString();

            fs.writeFileSync("./fine_tunning.jsonl", newJsonlContent);

            const training_file = await openai.files.create({ file: fs.createReadStream("./fine_tunning.jsonl"), purpose: "fine-tune" }),
                trained_model = await openai.fineTuning.jobs.create({
                    training_file: training_file.id,
                    model: "babbage-002",
                });

            return res.status(200).send(trained_model)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async semanticSearch(req: Request, res: Response) {
        try {
            const { texto } = req.body;

            if (!texto) return res.status(400).send({ message: "Texto não informado" });

            const { data } = await openai.embeddings.create({
                input: texto,
                model: "text-embedding-ada-002",
            })

            const semanticSearch = await embeddingService.semanticSearch(data[0].embedding);

            if (!semanticSearch.length) return res.status(404).send({ message: "Nenhum resultado encontrado" });

            const contexto = semanticSearch[0].text;

            const response = await openai.chat.completions.create({
                messages: [{ role: "system", content: `Com base neste contexto ${contexto}. Qual a resposta para a pergunta: ${texto}` }],
                model: "gpt-3.5-turbo",
            });

            return res.status(200).send(response)
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

export default new TreinamentoGptController()