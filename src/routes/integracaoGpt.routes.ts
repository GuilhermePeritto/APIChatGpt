import { Router } from "express";
import IntegracaoGptController from "../controllers/integracaoGpt";
import multer from "multer";

const integracaoGptRoutes = Router()

integracaoGptRoutes.post('/resumirConversasPorTexto', IntegracaoGptController.resumirConversasPorTexto)
integracaoGptRoutes.post('/converterAudioParaTexto', multer().single('file'), IntegracaoGptController.converterAudioParaTexto)
integracaoGptRoutes.post('/converterTextoParaAudio', IntegracaoGptController.converterTextoParaAudio)
integracaoGptRoutes.post('/criarImagem', IntegracaoGptController.criarImagem)
integracaoGptRoutes.post('/gerarSugestaoDeResposta', IntegracaoGptController.gerarSugestaoDeResposta)
integracaoGptRoutes.post('/traduzirMensagemDeErro', IntegracaoGptController.traduzirMensagemDeErro)
integracaoGptRoutes.post('/treinando', IntegracaoGptController.treinando)

export { integracaoGptRoutes }