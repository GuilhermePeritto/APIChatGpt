export function formatTextToEmbbeding(text: string) {
    const formattedText = text.replaceAll("\n", " ").replaceAll("\r", " ").replaceAll("\t", " ").replaceAll("\v", " ").replaceAll("\f", " ").replaceAll("\b", " ").replaceAll("\0", " ").replaceAll("\x1B", " ").replaceAll("\u2028", " ").replaceAll("\u2029", " ");
    return formattedText;
}