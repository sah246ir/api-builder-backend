import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware.js";
import { CreateSecret, DeleteSecret, GetSecret, GetSecrets, UpdateSecret } from "../../Controllers/SecretsController.js";



export const SecretsRouter = Router()
SecretsRouter.use(ProjectMiddleware)


SecretsRouter.get("/",GetSecrets)
SecretsRouter.get("/:id",GetSecret)
SecretsRouter.put("/:id",UpdateSecret)
SecretsRouter.delete("/:id",DeleteSecret)
SecretsRouter.post("/",CreateSecret)