import { PdfDocument, PdfInput } from "@ironsoftware/ironpdf";

export async function readPdf(pdfInput: PdfInput) {
    const _pdf = await PdfDocument.open(pdfInput);
    const texto = await _pdf.extractText();

    return texto;
}