import { EnumTipoSistemas } from "@prisma/client"

export type SemanticSearch = {
    _id: string,
    text: string,
    similarity: number,
    enumTipoSistemas: EnumTipoSistemas
}