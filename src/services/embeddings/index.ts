import { PrismaClient } from "@prisma/client";
import { embeddingObject } from "../../types/embedding";
import { SemanticSearch } from "../../types/SemanticSearch";
const prisma = new PrismaClient();

class EmbeddingService {
    public async create(dto: embeddingObject) {
        const res = await prisma.embedding.create({
            data: {
                text: dto.text,
                data: dto.embedding,
                EnumTipoSistemas: dto.enum
            }
        })

        return res
    }

    public async semanticSearch(embedding: number[], trashHold = 0.5, limit = 4) {
        await prisma.$queryRawUnsafe(`
                    CREATE OR REPLACE FUNCTION cosine_similarity(vector1 double precision[], vector2 double precision[])
            RETURNS double precision AS $$
            DECLARE
                dot_product double precision := 0;
                magnitude_vector1 double precision := 0;
                magnitude_vector2 double precision := 0;
                similarity double precision;
                i int;
            BEGIN
                IF array_length(vector1, 1) IS NULL OR array_length(vector2, 1) IS NULL OR array_length(vector1, 1) <> array_length(vector2, 1) THEN
                    RAISE EXCEPTION 'Os vetores devem ter o mesmo comprimento e não podem ser nulos.';
                END IF;

                FOR i IN 1..array_length(vector1, 1) LOOP
                    dot_product := dot_product + vector1[i] * vector2[i];
                    magnitude_vector1 := magnitude_vector1 + vector1[i] * vector1[i];
                    magnitude_vector2 := magnitude_vector2 + vector2[i] * vector2[i];
                END LOOP;

                IF magnitude_vector1 = 0 OR magnitude_vector2 = 0 THEN
                    similarity := 0;  -- Evitar divisão por zero
                ELSE
                    similarity := dot_product / (sqrt(magnitude_vector1) * sqrt(magnitude_vector2));
                END IF;

                RETURN similarity;
            END;
            $$ LANGUAGE plpgsql;
        `);

        const res : SemanticSearch[] = await prisma.$queryRawUnsafe(`
            SELECT
                _id,
                "text",
                cosine_similarity("data", ARRAY[${embedding}]) AS similarity
            FROM
                "Embedding"
            WHERE
                cosine_similarity("data", ARRAY[${embedding}]) > ${trashHold}
            ORDER BY
                similarity DESC
            LIMIT
                ${limit}
        `);

        return res;
    }
}

export default new EmbeddingService();


