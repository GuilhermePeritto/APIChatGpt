import { Request, Response } from "express";
import { openai } from "../../global/openAi";
import fs from "fs";
import { embeddingObject } from "../../types/embedding";
import embeddingService from "../../services/embeddings";
import { readPdf } from "../../utils/readPdf";
import { chunkSize } from "../../global/constants/embeddings";
import { formatTextToEmbbeding } from "../../utils/formatTextToEmbbeding";
import { PDFPath } from "../../global/constants/PDFPath";

class EmbeddingController {
    public async create(req: Request, res: Response) {
        try {
            const embedding: embeddingObject[] = [];

            fs.readdir(PDFPath, async (err, arquivos) => {
                if (err) {
                    return res.status(500).send(err);
                }

                for (const arquivo of arquivos) {
                    const text = await readPdf(`${PDFPath}/${arquivo}`),
                        formattedText = formatTextToEmbbeding(text);

                    for (var i = 0; i < formattedText.length; i += chunkSize) {

                        const { data } = await openai.embeddings.create({
                            input: formattedText.substring(i, i + chunkSize),
                            model: "text-embedding-3-small",
                        });

                        const emb = {
                            text: formattedText.substring(i, i + chunkSize),
                            embedding: data[0].embedding
                        }

                        await embeddingService.create(emb);
                        embedding.push(emb);
                    }

                }
                return res.send(embedding);
            });
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

export default new EmbeddingController()