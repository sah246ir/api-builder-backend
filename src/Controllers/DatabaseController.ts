import { Request, Response } from "express"
import { prisma } from "../index.js"
import { DatabaseConfigurationSchema } from "../Schema/DatabaseConfig.js"
import { AxiosDigestAuth } from '@lukesthl/ts-axios-digest-auth';

import { AxiosError } from "axios"

export const UpdateDatabaseConfiguration = async(req:Request,res:Response)=>{
    try{
        const parsedData = DatabaseConfigurationSchema.safeParse(req.body)
        if(parsedData.error){
            return res.status(400).json({
                errors:parsedData.error
            })
        }  
        const digestAuth = new AxiosDigestAuth({
            username: parsedData.data.MONGODB_ATLAS_PUBLIC_KEY,
            password: parsedData.data.MONGODB_ATLAS_PRIVATE_KEY,
          })
          
        const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${parsedData.data.MONGODB_ATLAS_PROJECT_ID}/clusters/${parsedData.data.MONGODB_ATLAS_CLUSTER}?pretty=true`;
        try{
            const response = await digestAuth.request({
            headers: { Accept: "application/json" },
            method: "GET",
            url
            }); 
            console.log(response.status)
        }catch(e:unknown){
            if(e instanceof AxiosError){
            console.log(e.response?.data)
            return res.status(400).json({
                message:"Credentials do not match to any existing cluster"
            })
            }
        }
        
        await prisma.$transaction(async(tx)=>{
            for(const [key, value] of Object.entries(parsedData.data)){
                await tx.secret.upsert({
                    where:{
                        project_id_key:{
                            key,
                            project_id:req.projectId as string
                        }
                    },
                    create:{
                        key,
                        project_id:req.projectId as string,
                        type:"database",
                        value:value
                    },
                    update:{
                        key,
                        type:"database",
                        value:value
                    } 
                })
            }
        })

        return res.json({
            message:"Database Configurations Updated"
        })


    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"error"
        })
    }
}



export const GetDatabaseConfiguration = async(req:Request,res:Response)=>{
    try{
        const data = await prisma.secret.findMany({
            where:{
                type:"database",
            },
            select:{
                key:true,
                id:true,
                value:true,
                type:true
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


export const GetActiveDatabase = async(req:Request,res:Response)=>{
    try{
        const data = await prisma.secret.findFirst({
            where:{
                type:"database",
                key:"DATABASE_NAME",
                project_id:req.projectId
            },
            select:{ 
                value:true, 
            }
        })
        return res.json({db:data?.value}) 
    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"error"
        })
    }
}