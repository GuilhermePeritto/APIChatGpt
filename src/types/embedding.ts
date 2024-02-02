import { EnumTipoSistemas } from "@prisma/client"

export type embeddingObject = {
    text: string,
    embedding: number[],
    enum: EnumTipoSistemas
}