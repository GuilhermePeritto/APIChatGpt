import { EnumTipoSistemas } from '../Enum/EnumTipoSistemas';

export type embeddingObject = {
    text: string,
    embedding: number[],
    enum: EnumTipoSistemas
}