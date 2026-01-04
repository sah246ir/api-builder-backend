import { Request, Response } from "express"
import { prisma } from "../index.js"
import { DatabaseConfigurationSchema } from "../Schema/DatabaseConfig.js"
import { DatabaseCollectionSchema } from "../Schema/DatabaseCollection.js"

export const CreateCollection = async(req:Request,res:Response)=>{
    try{
        const parsedData = DatabaseCollectionSchema.safeParse(req.body)
        if(parsedData.error){
            return res.status(400).json({
                errors:parsedData.error
            })
        }  
        console.log(parsedData.data.endpoint)
        await prisma.collection.create({
            data:{
                description:parsedData.data.collection_description,
                name:parsedData.data.collection_name,
                schema:JSON.stringify(parsedData.data.schema),
                project_id:req.projectId as string,
                default_endpoint:parsedData.data.endpoint
            }
        })

        return res.json({
            message:"Collection created succesfully"
        })


    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"error"
        })
    }
}

export const UpdateCollection = async(req:Request,res:Response)=>{
    try{
        const parsedData = DatabaseCollectionSchema.safeParse(req.body)
        if(parsedData.error){
            return res.status(400).json({
                errors:parsedData.error
            })
        }   
        await prisma.collection.update({
            where:{
                id:parseInt(req.params.id),
                project_id:req.projectId as string
            },
            data:{
                description:parsedData.data.collection_description,
                name:parsedData.data.collection_name,
                schema:JSON.stringify(parsedData.data.schema),
                project_id:req.projectId as string,
                default_endpoint:parsedData.data.endpoint
            }
        })

        return res.json({
            message:"Collection updated succesfully"
        })


    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"error"
        })
    }
}



export const GetCollections = async(req:Request,res:Response)=>{
    try{ 
        const data = await prisma.collection.findMany({
            where:{
                project_id:req.projectId
            },
            select:{
                id:true,
                name:true,
                description:true,
                default_endpoint:true,
                schema:true
            }
        }) 
        return res.json(data) 
    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"error"
        })
    }
}

export const GetOneCollection = async(req:Request,res:Response)=>{
    try{ 
        const id = parseInt(req.params.id)
        const data = await prisma.collection.findFirst({
            where:{
                project_id:req.projectId,
                id:id
            },
            select:{
                id:true,
                name:true,
                description:true,
                schema:true,
                default_endpoint:true
            }
        }) 
        return res.json(data) 
    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"error"
        })
    }
}

export const DeleteCollection = async(req:Request,res:Response)=>{
    try{ 
        const data = await prisma.collection.delete({
            where:{
                id:parseInt(req.params.id)
            }
        }) 
        return res.json(data) 
    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"error"
        })
    }
}