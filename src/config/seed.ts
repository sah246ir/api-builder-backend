import { PrismaClient } from "@prisma/client"
import { CrudApiTemplate } from "./templates/CrudApiTemplate"

const prisma = new PrismaClient()

export const seed = async () => {
    try {
        await prisma.$transaction(async (tx) => {
            // const template = await tx.apiTemplate.create({
            //     data: CrudApiTemplate
            // })
            //     console.log("Template seeded successfully")
            // })
            const template = await tx.api.findFirst({
                where: {
                },
                select: {
                    ApiEndpoint: {
                        select:{
                            RequestBody:{
                                select:{
                                    schema:true,
                                }
                            },
                            QueryParams:{
                                select:{
                                    schema:true,
                                }
                            },
                            definition:true,
                            endpoint:true,
                            method:true,
                        },
                        
                    }
                }
            })
            console.log(JSON.stringify(template,null,2))
        })
    } catch (e) {
        console.log(e)
    }
}

seed()