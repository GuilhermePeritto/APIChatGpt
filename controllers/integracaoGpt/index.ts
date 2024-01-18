import { Request, Response } from "express";
import { openai } from "../../globals/openAi";
import { bufferToStream } from "../../utils/bufferToStream";
import axios from "axios";
import FormData from "form-data";

class IntegracaoGptController {

    public async resumirConversasPorTexto(req: Request, res: Response) {
        try {
            const { texto } = req.body;

            if (!texto?.length) return res.status(400).send("Texto não informado")

            const response = await openai.chat.completions.create({
                messages: [{ role: "system", content: `Resuma a seguinte conversa: ${texto}` }],
                model: "gpt-3.5-turbo",
            });

            res.status(200).send(response)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async converterAudioParaTexto(req: Request, res: Response) {
        try {
            const audioFile = req.file;

            if (!audioFile) {
                return res.status(400).json({ error: 'No audio file provided' });
            }

            const formData = new FormData();
            const audioStream = bufferToStream(audioFile.buffer);

            formData.append('file', audioStream, { filename: 'audio.mp3', contentType: audioFile.mimetype });
            formData.append('model', 'whisper-1');
            formData.append('response_format', 'json');

            const config = {
                headers: {
                    // @ts-ignore
                    "Content-Type": `multipart/form-data; boundary=${formData.__boundary}`,
                    "Authorization": `Bearer ${process.env.OPENAIKEY}`,
                },
            };

            const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, config);
            res.json(response.data);

        } catch (error) {
            res.status(500).json({ error });
        }
    }


}

export default new IntegracaoGptController()