import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware.js";
import { CreateCollection, DeleteCollection, GetCollections, GetOneCollection, UpdateCollection } from "../../Controllers/CollectionController.js";



export const CollectionRouter = Router()
CollectionRouter.use(ProjectMiddleware)

CollectionRouter.post("",CreateCollection) 
CollectionRouter.get("",GetCollections) 
CollectionRouter.get("/:id",GetOneCollection) 
CollectionRouter.put("/:id",UpdateCollection) 
CollectionRouter.delete("/:id",DeleteCollection) 