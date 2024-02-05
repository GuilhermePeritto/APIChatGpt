import { EnumTipoSistemas, PrismaClient } from "@prisma/client";
import { embeddingObject } from "../../types/embedding";
import { SemanticSearch } from "../../types/SemanticSearch";
const prisma = new PrismaClient();

class EmbeddingService {
    public async create(dto: embeddingObject) {
        const res = await prisma.embedding.create({
            data: {
                text: dto.text,
                data: dto.embedding,
                tipoSistema: dto.enum
            }
        })

        return res
    }

    public async semanticSearch(embedding: number[], trashHold = 0.78, limit = 4, enumTipoSistemas: EnumTipoSistemas) {
        await prisma.$queryRawUnsafe(`
        CREATE EXTENSION IF NOT EXISTS vector;
        `);

        const res: SemanticSearch[] = await prisma.$queryRawUnsafe(`

            SELECT
                _id,
                "text",
                1 - ("data"::vector <=> '[${embedding.toString()}]'::vector) AS similarity,
                "tipoSistema"
            FROM
                "Embedding"
            WHERE
                1 - ("data"::vector <=> '[${embedding.toString()}]'::vector) > ${trashHold}
            AND
                "Embedding"."tipoSistema" = '${enumTipoSistemas}'
            ORDER BY
                similarity DESC
            LIMIT
                ${limit}
        `);

        return res;
    }
}

export default new EmbeddingService();


