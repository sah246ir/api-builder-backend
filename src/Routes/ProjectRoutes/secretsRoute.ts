import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware.js";
import { CreateSecret, GetSecret, GetSecrets } from "../../Controllers/SecretsController.js";
import { DeleteCollection } from "../../Controllers/CollectionController.js";



export const SecretsRouter = Router()
SecretsRouter.use(ProjectMiddleware)


SecretsRouter.get("/",GetSecrets)
SecretsRouter.get("/:id",GetSecret)
SecretsRouter.delete("/:id",DeleteCollection)
SecretsRouter.post("/",CreateSecret)