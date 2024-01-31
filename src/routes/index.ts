import express, { Router } from "express";
import { integracaoGPTRoutes } from "./IntegracaoGPT";

const routes = Router()

routes.use('/integracaoGPT', integracaoGPTRoutes);

export { routes }