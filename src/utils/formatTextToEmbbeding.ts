import { chunkSize } from "../global/constants/embeddings";

export function formatTextToEmbbeding(text: string) {
    const formattedText = text.replaceAll("\n", " ").replaceAll("\r", " ").replaceAll("\t", " ").replaceAll("\v", " ").replaceAll("\f", " ").replaceAll("\b", " ").replaceAll("\0", " ").replaceAll("\x1B", " ").replaceAll("\u2028", " ").replaceAll("\u2029", " ");
    return formattedText;
}

export function splitIntoParagraphs(text: string, maxChars: number = chunkSize): string[] {
    const paragraphs: string[] = [];
    let currentParagraph = '';

    text.split('\n').forEach(line => {
        if ((currentParagraph + line).length <= maxChars) {
            currentParagraph += line + '\n';
        } else {
            paragraphs.push(currentParagraph.trim());
            currentParagraph = line + '\n';
        }
    });

    if (currentParagraph) {
        paragraphs.push(currentParagraph.trim());
    }

    return paragraphs;
}