import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware.js";
import { DeleteRequestSchema, GetOneRequestSchema, GetRequestSchemas, UpdateRequestSchema } from "../../Controllers/RequestSchemaController.js";



export const RequestSchemaRouter = Router()
RequestSchemaRouter.use(ProjectMiddleware) 
RequestSchemaRouter.get("",GetRequestSchemas)
RequestSchemaRouter.get("/:id",GetOneRequestSchema)
RequestSchemaRouter.put("/:id",UpdateRequestSchema)     
RequestSchemaRouter.delete("/:id",DeleteRequestSchema)