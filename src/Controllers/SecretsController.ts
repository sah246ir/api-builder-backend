import { Request, Response } from "express"
import { HASHING_SALT, prisma } from "../index.js"
import { SecretSchema } from "../Schema/Secret.js"
import { hash } from "bcrypt"

export const CreateSecret = async(req:Request,res:Response)=>{
    try{
        const parsedData = SecretSchema.safeParse(req.body)
        if(parsedData.error){
            return res.status(400).json({
                errors:parsedData.error
            })
        } 

        await prisma.secret.create({
            data:{
                key:parsedData.data.key,
                type:parsedData.data.type,
                value:parsedData.data.value,
                project_id:req.projectId as string
            }
        })

        return res.json({
            message:"Secret saved"
        })
    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"error"
        })
    }
}

export const GetSecrets = async(req:Request,res:Response)=>{
    try{
        const data = await prisma.secret.findMany({
            select:{
                key:true,
                type:true,
                id:true
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


export const GetSecret = async(req:Request,res:Response)=>{
    try{
        const {id} = req.params
        const data = await prisma.secret.findFirst({
            where:{id:parseInt(id)},
            select:{
                key:true,
                type:true,
                value:true,
                id:true
            }
        }) 

        return res.json(data)
    }catch(e){
        console.log(e)
        res.status(400).json({
            message:"error"
        })
    }
}

export const DeleteSecret = async(req:Request,res:Response)=>{
    try{ 
        const data = await prisma.secret.delete({
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