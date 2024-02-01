import { Router } from "express";
import multer from "multer";
import treinamentoGPTController from "../../controllers/integracaoGPT/treinamento";

const treinamentoGPTRoutes = Router()

treinamentoGPTRoutes.post('/gerarEmbeddingBaseadoEmArquivoPDF', multer().single('file'), treinamentoGPTController.gerarEmbeddingBaseadoEmArquivoPDF)
treinamentoGPTRoutes.post('/gerarFineTunningCompletitionsJSONL', treinamentoGPTController.gerarFineTunningCompletitionsJSONL)
treinamentoGPTRoutes.post('/gerarFineTunningChatJSONL', treinamentoGPTController.gerarFineTunningChatJSONL)
treinamentoGPTRoutes.post('/gerarFineTunningCompletionsModel', treinamentoGPTController.gerarFineTunningCompletitionsModel)
treinamentoGPTRoutes.post('/gerarFineTunningChatModel', treinamentoGPTController.gerarFineTunningChatModel)
treinamentoGPTRoutes.post('/gerarEmbeddingBaseadoEmVariosPDF', treinamentoGPTController.gerarEmbeddingBaseadoEmVariosPDF)
treinamentoGPTRoutes.post('/verificarFineTunnedModel', treinamentoGPTController.verificarFineTunnedModel)

export { treinamentoGPTRoutes }