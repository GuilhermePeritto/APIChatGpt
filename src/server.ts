import express from "express";
import cors from "cors";
import { integracaoGptRoutes } from "./routes/integracaoGpt.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/integracaoGPT', integracaoGptRoutes);

app.listen(3838, () => console.log("Api rodando na porta 3334 ~🚀"));
