import express from "express";
import cors from "cors";
import { integracaoGPTRoutes } from "./routes/IntegracaoGPT";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/integracaoGPT', integracaoGPTRoutes);

app.listen(4444, () => console.log("Api rodando na porta 3334 ~🚀"));
