import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware";
import { GetActiveDatabase, GetDatabaseConfiguration, UpdateDatabaseConfiguration } from "../../Controllers/DatabaseController";



export const DatabaseRouter = Router()
DatabaseRouter.use(ProjectMiddleware)


DatabaseRouter.put("/config",UpdateDatabaseConfiguration)
DatabaseRouter.get("/config",GetDatabaseConfiguration)
DatabaseRouter.get("/active-database",GetActiveDatabase)