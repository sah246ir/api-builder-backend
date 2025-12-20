import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware";
import { CreateApiFromTemplate, GetApis, GetApiTemplates, GetOneApi, GetOneApiTemplate } from "../../Controllers/ApiController";



export const ApiRouter = Router()
ApiRouter.use(ProjectMiddleware)


ApiRouter.get("",GetApis)
ApiRouter.get("/templates",GetApiTemplates)
ApiRouter.get("/templates/:templateId",GetOneApiTemplate)
ApiRouter.post("/create/templates/:templateId",CreateApiFromTemplate)
ApiRouter.get("/:id",GetOneApi)