import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware.js";
import { GetActiveDatabase, GetDatabaseConfiguration, UpdateDatabaseConfiguration } from "../../Controllers/DatabaseController.js";



export const DatabaseRouter = Router()
DatabaseRouter.use(ProjectMiddleware)


DatabaseRouter.put("/config",UpdateDatabaseConfiguration)
DatabaseRouter.get("/config",GetDatabaseConfiguration)
DatabaseRouter.get("/active-database",GetActiveDatabase)