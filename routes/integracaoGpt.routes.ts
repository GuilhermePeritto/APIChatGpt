import { Router } from "express";
import IntegracaoGptController from "../controllers/integracaoGpt";

const integracaoGptRoutes = Router()

integracaoGptRoutes.post('/resumirTexto', IntegracaoGptController.resumir)

export { integracaoGptRoutes }