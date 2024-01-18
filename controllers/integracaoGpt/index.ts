import { Request, Response } from "express";
import { openai } from "../../globals/openAi";

class IntegracaoGptController {

    public async resumir(req: Request, res: Response) {
        const { texto } = req.body;

        if (!texto?.length) return res.status(400).send("Texto não informado")

        const response = await openai.chat.completions.create({
            messages: [{ role: "system", content: `Resuma o seguinte texto: ${texto}` }],
            model: "gpt-3.5-turbo",
        });

        res.status(200).send(response)

    }


}

export default new IntegracaoGptController()