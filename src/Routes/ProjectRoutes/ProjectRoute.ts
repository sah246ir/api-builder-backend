import { Router } from "express";
import { ProjectMiddleware } from "../../Middlewares/projectMiddleware";



export const ProjectRouter = Router()
ProjectRouter.use(ProjectMiddleware)


ProjectRouter.get("/",(req,res)=>{
    return res.json({
        success:true
    })
})