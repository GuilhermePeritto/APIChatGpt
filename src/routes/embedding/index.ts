import { Router } from "express";
import embeddingController from "../../controllers/embedding";

const embeddingRoutes = Router()

embeddingRoutes.post('/create', embeddingController.create)

export { embeddingRoutes }