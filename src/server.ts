import express from "express";
import cors from "cors";
import { routes } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes)

const porta = 5555;

app.listen(porta, () => console.log(`Api rodando na porta ${porta} ~🚀`));
