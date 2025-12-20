import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware";
import { CreateSecret, GetSecret, GetSecrets } from "../../Controllers/SecretsController";
import { DeleteCollection } from "../../Controllers/CollectionController";



export const SecretsRouter = Router()
SecretsRouter.use(ProjectMiddleware)


SecretsRouter.get("/",GetSecrets)
SecretsRouter.get("/:id",GetSecret)
SecretsRouter.delete("/:id",DeleteCollection)
SecretsRouter.post("/",CreateSecret)