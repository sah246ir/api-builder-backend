import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware.js";
import { UpdateDatabaseConfiguration } from "../../Controllers/DatabaseController.js";



export const DeploymentRouter = Router()
DeploymentRouter.use(ProjectMiddleware)


DeploymentRouter.put("/deploy/:apiId",UpdateDatabaseConfiguration)