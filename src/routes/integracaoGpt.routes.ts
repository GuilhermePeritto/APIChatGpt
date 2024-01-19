import { Router } from "express";
import IntegracaoGptController from "../controllers/integracaoGpt";
import multer from "multer";

const integracaoGptRoutes = Router()

integracaoGptRoutes.post('/resumirConversasPorTexto', IntegracaoGptController.resumirConversasPorTexto)
integracaoGptRoutes.post('/converterAudioParaTexto', multer().single('file'), IntegracaoGptController.converterAudioParaTexto)

export { integracaoGptRoutes }