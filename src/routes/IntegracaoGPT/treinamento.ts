import { Router } from "express";
import multer from "multer";
import treinamentoGPTController from "../../controllers/integracaoGPT/treinamento";

const treinamentoGPTRoutes = Router()

treinamentoGPTRoutes.post('/gerarEmbeddingBaseadoEmArquivoPDF', multer().single('file'), treinamentoGPTController.gerarEmbeddingBaseadoEmArquivoPDF)
treinamentoGPTRoutes.post('/gerarFineTunningModelBaseadoEmArquivoPDF', treinamentoGPTController.gerarFineTunningModelBaseadoEmArquivoPDF)
treinamentoGPTRoutes.post('/gerarEmbeddingBaseadoEmVariosPDF', treinamentoGPTController.gerarEmbeddingBaseadoEmVariosPDF)

export { treinamentoGPTRoutes }