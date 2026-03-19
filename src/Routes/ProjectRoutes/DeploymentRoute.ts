import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware.js";
import { UpdateDatabaseConfiguration } from "../../Controllers/DatabaseController.js";
import { DeployApi, getDeploymentLogs, getDeployments } from "../../Controllers/DeploymentController.js";



export const DeploymentRouter = Router()
DeploymentRouter.use(ProjectMiddleware)


DeploymentRouter.post("/deploy/:apiId",DeployApi)   
DeploymentRouter.get("/:apiId",getDeployments)
DeploymentRouter.get("/:apiId/:deploymentId",getDeploymentLogs)