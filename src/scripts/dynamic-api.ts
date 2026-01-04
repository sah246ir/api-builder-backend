import { PrismaClient } from "@prisma/client";
import { DatabaseCollectionType } from "../Schema/DatabaseCollection.js";

export const prisma = new PrismaClient()

async function main() {
    const api = await prisma.api.findFirst({
        select:{
            ApiEndpoint:{
                select:{
                    RequestBody:{
                        select:{
                            schema:true
                        }
                    },
                    QueryParams:{
                        select:{
                            schema:true
                        }
                    },
                    endpoint:true,
                    method:true,
                    definition:true
                }
            },
            endpoint:true
        }
    }) 
    return api
}

interface RouteDefinition{
    action:"find",
    filterBy:{
        field:string
    }[]
}
main().then((json)=>{
    console.log(JSON.stringify(json))
})
