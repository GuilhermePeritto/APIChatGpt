import { Router } from "express";
import multer from "multer";
import treinamentoGPTController from "../../controllers/integracaoGPT/treinamento";

const trainamentoGPTRoutes = Router()

trainamentoGPTRoutes.post('/gerarEmbeddingBaseadoEmArquivoPDF', multer().single('file'), treinamentoGPTController.gerarEmbeddingBaseadoEmArquivoPDF)
trainamentoGPTRoutes.post('/gerarFineTunningModelBaseadoEmArquivoPDF', treinamentoGPTController.gerarFineTunningModelBaseadoEmArquivoPDF)
trainamentoGPTRoutes.get('/semanticSearch', treinamentoGPTController.semanticSearch)

export { trainamentoGPTRoutes }