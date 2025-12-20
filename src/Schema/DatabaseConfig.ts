import {z} from "zod"

export const DatabaseConfigurationSchema = z.object({
    // database:z.string(),
    DATABASE_NAME:z.string(),
    MONGODB_ATLAS_CLUSTER:z.string(),
    MONGODB_ATLAS_PUBLIC_KEY:z.string(),
    MONGODB_ATLAS_PRIVATE_KEY:z.string(),
    MONGODB_ATLAS_PROJECT_ID:z.string(),
})

export type DatabaseConfigurationType = z.infer<typeof DatabaseConfigurationSchema>