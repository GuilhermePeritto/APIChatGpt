import { Router } from "express";
import fineTunningController from "../../controllers/fineTunning";

const fineTunningRoutes = Router()

fineTunningRoutes.post('/createCompletitionsJSONL', fineTunningController.createCompletitionsJSONL)
fineTunningRoutes.post('/createChatJSONL', fineTunningController.createChatJSONL)

fineTunningRoutes.post('/createCompletitionsModel', fineTunningController.createCompletitionsModel)
fineTunningRoutes.post('/createChatModels', fineTunningController.createChatModels)

fineTunningRoutes.get('/list', fineTunningController.list)

export { fineTunningRoutes  }