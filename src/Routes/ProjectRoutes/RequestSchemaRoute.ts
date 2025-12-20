import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware";
import { GetOneRequestSchema, GetRequestSchemas, UpdateRequestSchema } from "../../Controllers/RequestSchemaController";



export const RequestSchemaRouter = Router()
RequestSchemaRouter.use(ProjectMiddleware) 
RequestSchemaRouter.get("",GetRequestSchemas)
RequestSchemaRouter.get("/:id",GetOneRequestSchema)
RequestSchemaRouter.put("/:id",UpdateRequestSchema)