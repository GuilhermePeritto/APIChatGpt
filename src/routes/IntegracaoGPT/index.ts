import { Router } from "express";
import IntegracaoGPTController from "../../controllers/integracaoGPT";
import multer from "multer";
import { trainamentoGPTRoutes } from "./treinamento";

const integracaoGPTRoutes = Router()

integracaoGPTRoutes.post('/resumirConversasPorTexto', IntegracaoGPTController.resumirConversasPorTexto)
integracaoGPTRoutes.post('/converterAudioParaTexto', multer().single('file'), IntegracaoGPTController.converterAudioParaTexto)
integracaoGPTRoutes.post('/converterTextoParaAudio', IntegracaoGPTController.converterTextoParaAudio)
integracaoGPTRoutes.post('/criarImagem', IntegracaoGPTController.criarImagem)
integracaoGPTRoutes.post('/gerarSugestaoDeResposta', IntegracaoGPTController.gerarSugestaoDeResposta)
integracaoGPTRoutes.post('/traduzirMensagemDeErro', IntegracaoGPTController.traduzirMensagemDeErro)

integracaoGPTRoutes.use('/treinamento', trainamentoGPTRoutes)

export { integracaoGPTRoutes }