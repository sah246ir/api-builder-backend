import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware.js";
import { UpdateDatabaseConfiguration } from "../../Controllers/DatabaseController.js";



export const DatabaseRouter = Router()
DatabaseRouter.use(ProjectMiddleware)


DatabaseRouter.put("/deploy/:apiId",UpdateDatabaseConfiguration)