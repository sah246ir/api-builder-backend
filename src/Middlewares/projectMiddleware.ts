import { NextFunction,Response,Request } from "express";
import { clients, prisma } from "../index.js";

export async function ProjectMiddleware(req:Request, res:Response, next:NextFunction){
    const organization = req.headers['x-organization'] as string | undefined
    const projectid = req.headers['x-project-id'] as string | undefined
    if(!organization || !projectid){
        return res.status(400).json({
            message:"Organization or Project id is missing in request headers"
        })
    }

    const project = await prisma.project.findFirst({
        where:{
            id:projectid,
            organization_id:organization
        },
        include:{
            Organization:{
                select:{
                    name:true
                }
            }
        }
    })

    if(!project){
        return res.status(404).json({
            message:"Project not found"
        })
    }

    req.projectId = project.id
    req.organization = project.organization_id
    req.organizationName = project.Organization.name
    req.namespace = `${project.organization_id}-${project.Organization.name.toLowerCase().trim().replace(/ /g, '-')}`
    next();
}
