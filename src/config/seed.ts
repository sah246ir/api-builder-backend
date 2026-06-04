import { PrismaClient } from "@prisma/client"
import { CrudApiTemplate } from "./templates/CrudApiTemplate.js"

const prisma = new PrismaClient()

export const seed = async () => {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.organization.deleteMany()
            await tx.apiTemplate.deleteMany()
            await tx.api.deleteMany()
            await tx.apiEndpoint.deleteMany()
            await tx.requestModel.deleteMany()
            await tx.secret.deleteMany()
            await tx.database.deleteMany()
            await tx.deploymentLog.deleteMany()
            await tx.deployment.deleteMany()
            await tx.project.deleteMany()
            await tx.organization.deleteMany()
            await tx.admin.deleteMany()
            const template = await tx.apiTemplate.create({
                data: CrudApiTemplate
            })
            const admin = await tx.admin.create({
                data: {
                    username: "admin",
                    password: "admin",
                    email: "admin@admin.com",
                    phone: "1234567890",
                    is_subscribed: true,
                    tier: "premium"
                }
            })
            const organization = await tx.organization.create({
                data: {
                    name: "Organization",
                    admin_id: admin.id,
                    id:"1"
                }
            })
            const project = await tx.project.create({
                data: {
                    name: "Project",
                    admin_id: admin.id,
                    organization_id: organization.id,
                    id:"asdf"
                }
            })
            //     console.log("Template seeded successfully")
            // })
            // const template = await tx.api.findFirst({
            //     where: {
            //     },
            //     select: {
            //         endpoint:true,
            //         ApiEndpoint: {
            //             select:{
            //                 RequestBody:{
            //                     select:{
            //                         schema:true,
            //                     }
            //                 },
            //                 QueryParams:{
            //                     select:{
            //                         schema:true,
            //                     }
            //                 },
            //                 definition:true,
            //                 endpoint:true,
            //                 method:true,
            //             },
                        
            //         }
            //     }
            // })
            // console.log(JSON.stringify(template,null,2))
        })
    } catch (e) {
        console.log(e)
    }
}

seed()