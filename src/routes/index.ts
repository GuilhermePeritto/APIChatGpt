import { Router } from "express";
import { integracaoGPTRoutes } from "./IntegracaoGPT";
import { embeddingRoutes } from "./embedding";
import { fineTunningRoutes } from "./fineTunning";

const routes = Router()

routes.use('/integracaoGPT', integracaoGPTRoutes);
routes.use('/embedding', embeddingRoutes);
routes.use('/fineTunning', fineTunningRoutes);

export { routes }