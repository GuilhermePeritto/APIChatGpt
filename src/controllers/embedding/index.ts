import { Request, Response } from "express";
import { openai } from "../../global/openAi";
import fs from "fs";
import { embeddingObject } from "../../types/embedding";
import embeddingService from "../../services/embeddings";
import { readPdf } from "../../utils/readPdf";
import { chunkSize } from "../../global/constants/embeddings";
import { formatTextToEmbbeding } from "../../utils/formatTextToEmbbeding";
import { PDFPath as PDFPathRoot } from "../../global/constants/PDFPath";
import { EnumTipoSistemas } from "@prisma/client";
import { CharacterTextSplitter } from "langchain/text_splitter";
class EmbeddingController {

    public async create(req: Request, res: Response) {
        try {
            const tipoSistema: EnumTipoSistemas = req.body.tipoSistema,
                PDFPath = `${PDFPathRoot}/${tipoSistema}`,
                chunks: string[] = [];

            if (!Object.keys(EnumTipoSistemas).includes(tipoSistema)) {
                return res.status(500).send("Tipo de sistema não encontrado.");
            }

            fs.readdir(PDFPath, async (err, arquivos) => {
                if (err) {
                    return res.status(500).send(err);
                }

                for (const arquivo of arquivos) {
                    const text = await readPdf(`${PDFPath}/${arquivo}`),
                        textSplitter = new CharacterTextSplitter({
                            chunkSize: chunkSize,
                            chunkOverlap: 200
                        }),
                        tempChunks = await textSplitter.splitText(text);

                    chunks.push(...tempChunks.map(el => formatTextToEmbbeding(el)));
                }

                const response = await Promise.all(chunks.map(async (chunk) => {
                    const { data } = await openai.embeddings.create({
                        input: chunk,
                        model: "text-embedding-3-small",
                    });

                    const emb: embeddingObject = {
                        text: chunk,
                        embedding: data[0].embedding,
                        enum: tipoSistema
                    };

                    await embeddingService.create(emb);

                    return emb;
                }));

                return res.send(response);
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default new EmbeddingController();
