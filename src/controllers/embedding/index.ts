import { Request, Response } from "express";
import { openai } from "../../global/openAi";
import fs from "fs";
import { embeddingObject } from "../../types/embedding";
import embeddingService from "../../services/embeddings";
import { readPdf } from "../../utils/readPdf";
import { chunkSize } from "../../global/constants/embeddings";
import { formatTextToEmbbeding } from "../../utils/formatTextToEmbbeding";
import { PDFPath } from "../../global/constants/PDFPath";
import { EnumTipoSistemas } from "@prisma/client";

class EmbeddingController {
    private async processTextChunk(text: string, enumTipoSistema: EnumTipoSistemas) {
        const embedding: embeddingObject[] = [];

        for (let i = 0; i < text.length; i += chunkSize) {
            const chunk = text.substring(i, i + chunkSize);

            const { data } = await openai.embeddings.create({
                input: chunk,
                model: "text-embedding-3-small",
            });

            const emb: embeddingObject = {
                text: chunk,
                embedding: data[0].embedding,
                enum: enumTipoSistema
            };

            await embeddingService.create(emb);
            embedding.push(emb);
        }

        return embedding;
    }

    public async create(req: Request, res: Response) {
        try {
            const embedding: embeddingObject[] = [];
            const enumTipoSistema: EnumTipoSistemas = req.body.enumTipoSistema;
            const dictPDFPath = {
                [EnumTipoSistemas.Loja]: `${PDFPath}/Loja`,
                [EnumTipoSistemas.Crm]: `${PDFPath}/Crm`,
            };

            if (!Object.keys(dictPDFPath).includes(enumTipoSistema)) {
                return res.status(500).send("Tipo de sistema não encontrado.");
            }

            fs.readdir(dictPDFPath[enumTipoSistema], async (err, arquivos) => {
                if (err) {
                    return res.status(500).send(err);
                }

                for (const arquivo of arquivos) {
                    const text = await readPdf(`${dictPDFPath[enumTipoSistema]}/${arquivo}`);
                    const formattedText = formatTextToEmbbeding(text);

                    for (let i = 0; i < formattedText.length; i += chunkSize) {
                        const chunk = formattedText.substring(i, i + chunkSize);
                        const chunkEmbedding = await this.processTextChunk(chunk, enumTipoSistema);
                        embedding.push(...chunkEmbedding);
                    }
                }

                return res.send(embedding);
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default new EmbeddingController();
