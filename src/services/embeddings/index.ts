import { PrismaClient } from "@prisma/client";
import { embeddingObject } from "../../types/embedding";

const prisma = new PrismaClient();

class EmbeddingService {
    public async create(dto: embeddingObject) {
        const res = await prisma.embedding.create({
            data: {
                text: dto.text,
                data: dto.embedding
            }
        })

        return res
    }

}

export default new EmbeddingService();