import { Request, Response } from "express"
import { prisma } from "../index.js"
import { Prisma } from "@prisma/client"
import { ApiTemplateSchema, CreateApiFromTemplateSchema } from "../Schema/ApiSchema.js"
import { CollectionSchema } from "../Schema/DatabaseCollection.js"

export const GetApiTemplates = async(req:Request,res:Response)=>{
    try{ 
        const data = await prisma.apiTemplate.findMany({
            select:{
                name:true,
                template:true,
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


export const GetOneApiTemplate = async(req:Request,res:Response)=>{
    try{ 
        const id = req.params.templateId
        const data = await prisma.apiTemplate.findFirst({
            where:{
                id:parseInt(id), 
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


export const CreateApiFromTemplate = async(req:Request,res:Response)=>{
    try{ 
        const id = req.params.templateId
        const parsedData = CreateApiFromTemplateSchema.safeParse(req.body)
        if(parsedData.error){
            return res.status(400).json({
                errors:parsedData.error
            })
        }  
        const template = await prisma.apiTemplate.findFirst({
            where:{
                id:parseInt(id), 
            } 
        })
        const collection = await prisma.collection.findFirst({
            where:{
                name:parsedData.data.collection, 
            } 
        })
        if(!template || !collection){
            return res.status(404).json({
                message:!template?"Template not found":"Collection not found"
            })
        }  
        const templatejson = ApiTemplateSchema.safeParse(template)
        const colschema = CollectionSchema.safeParse(JSON.parse(collection.schema as unknown as string))

        if(templatejson.error){
            console.log(templatejson.error)
            return res.status(500).json({
                message:"Invalid template format. please contact the website admin",
                errors:templatejson.error
            })
        }
        if(colschema.error){ 
            return res.status(500).json({
                message:"Invalid collection schema. please contact the website admin",
                errors:colschema.error
            })
        }
        await prisma.$transaction(async(tx)=>{
            const qpmodeldata:Prisma.RequestModelCreateManyInput[] = templatejson.data.template.filter(r=>Boolean(r.queryParams)).map(route=>{
                return{
                    name:`${route.action} ${collection.name} ${route.method} QP`,
                    project_id:req.projectId as string,
                    schema:route.queryParams || {},
                    type:"query_params",
                }
            })
            const rbmodeldata:Prisma.RequestModelCreateManyInput[] = templatejson.data.template.filter(r=>r.RequestBodyFromCollection && r.method !== "GET").map(route=>{
                return{
                    name:`${route.action} ${collection.name} ${route.method} RB`,
                    project_id:req.projectId as string,
                    schema:colschema.data || {},
                    type:"request_body",
                }
            })
            await tx.requestModel.createMany({
                data:[...qpmodeldata,...rbmodeldata] , 
            })
            const Modelsmap:Record<string,number> = {}
            const requestModels = await tx.requestModel.findMany({
                where:{
                    project_id:req.projectId
                },
                select:{
                    id:true,
                    name:true
                }
            })
            requestModels.forEach(mod=>{
                Modelsmap[mod.name] = mod.id
            })
            await tx.api.create({
                data:{
                    endpoint:parsedData.data.endpoint,
                    name:"first-api",
                    project_id:req.projectId as string,
                    ApiEndpoint:{
                        createMany:{
                            data:templatejson.data.template.map(route=>{
                                const qp = `${route.action} ${collection.name} QP`
                                const rb = `${route.action} ${collection.name} RB`
                                return {
                                    authentication:false,
                                    definition:route.routeActions.map(action=>{
                                        return {
                                            collection:action.collection || collection.name,
                                            action:action.action,
                                            filterBy:action.filterBy
                                        }
                                    }),
                                    endpoint:route.endpoint,
                                    method:route.method,
                                    project_id:req.projectId as string,
                                    query_params_id:Modelsmap[qp],
                                    request_body_id:Modelsmap[rb], 
                                }
                            })
                        }
                    }
                }
            })
        })


        return res.json({
            message:"Api and related schemas Created Successfully"
        }) 
    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"error"
        })
    }
}



export const GetApis = async(req:Request,res:Response)=>{
    try{ 
        const data = await prisma.api.findMany({
            where:{
                project_id:req.projectId
            },
            select:{
                endpoint:true,
                name:true,
                template:true 
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

export const GetOneApi = async(req:Request,res:Response)=>{
    try{ 
        const id = req.params.id
        const data = await prisma.api.findFirst({
            where:{
                id:parseInt(id), 
                project_id:req.projectId
            },
            select:{
                name:true,
                ApiEndpoint:{
                    select:{
                        endpoint:true,
                        method:true,
                        QueryParams:{select:{schema:true,name:true}},
                        RequestBody:{select:{schema:true,name:true}},
                        definition:true,
                        authentication:true
                    }
                },
                endpoint:true
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