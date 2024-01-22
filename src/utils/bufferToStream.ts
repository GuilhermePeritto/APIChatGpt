import { Readable } from "stream";

export function bufferToStream(buffer: Buffer) {
    return Readable.from(buffer)
}