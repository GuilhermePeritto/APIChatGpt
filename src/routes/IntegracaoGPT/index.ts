import { Router } from "express";
import IntegracaoGPTController from "../../controllers/integracaoGPT";
import multer from "multer";
import { treinamentoGPTRoutes } from "./treinamento";

const integracaoGPTRoutes = Router()

integracaoGPTRoutes.post('/resumirConversasPorTexto', IntegracaoGPTController.resumirConversasPorTexto)
integracaoGPTRoutes.post('/converterAudioParaTexto', multer().single('file'), IntegracaoGPTController.converterAudioParaTexto)
integracaoGPTRoutes.post('/converterTextoParaAudio', IntegracaoGPTController.converterTextoParaAudio)
integracaoGPTRoutes.post('/criarImagem', IntegracaoGPTController.criarImagem)
integracaoGPTRoutes.post('/gerarSugestaoDeResposta', IntegracaoGPTController.gerarSugestaoDeResposta)
integracaoGPTRoutes.post('/traduzirMensagemDeErro', IntegracaoGPTController.traduzirMensagemDeErro)
integracaoGPTRoutes.post('/perguntaComBaseEmManuais', IntegracaoGPTController.perguntaComBaseEmManuais)

integracaoGPTRoutes.use('/treinamento', treinamentoGPTRoutes)

export { integracaoGPTRoutes }