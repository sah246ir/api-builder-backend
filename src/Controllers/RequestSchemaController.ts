import { prisma } from ".."
import { Request, Response } from "express"
import {UpdateRequestSchema as urs} from "../Schema/RequestSchema"
export const UpdateRequestSchema = async(req:Request,res:Response)=>{
    try{ 
        const id = req.params.id as string
        const parsedData = urs.safeParse(req.body)
        if(parsedData.error){
            return res.status(400).json({
                errors:parsedData.error
            })
        } 

        await prisma.requestModel.update({
            where:{id:parseInt(id)},
            data:{
                schema:parsedData.data.schema
            }
        })
        return res.json({
            message:"Schema updated succesfully"
        })
    }catch(e){
        return res.status(400).json({
            message:"error"
        })
    }
}

export const GetRequestSchemas = async(req:Request,res:Response)=>{
    try{ 
        const data = await prisma.requestModel.findMany({
            where:{
                project_id:req.projectId
            },
            select:{
                id:true,
                name:true, 
                schema:true, 
                ApiEndpointBody:{select:{endpoint:true,API:true,method:true}},
                ApiEndpointParams:{select:{endpoint:true,API:true,method:true}},

            }
        }) 
        return res.json(data) 
    }catch(e){
        return res.status(400).json({
            message:"error"
        })
    }
}

export const GetOneRequestSchema = async(req:Request,res:Response)=>{
    try{ 
        const id = req.params.id as string
        const data = await prisma.requestModel.findFirst({
            where:{
                id:parseInt(id)
            },
            select:{
                id:true,
                name:true, 
                schema:true, 
                ApiEndpointBody:{select:{endpoint:true,API:true,method:true}},
                ApiEndpointParams:{select:{endpoint:true,API:true,method:true}},

            }
        }) 
        return res.json(data) 
    }catch(e){
        return res.status(400).json({
            message:"error"
        })
    }
}