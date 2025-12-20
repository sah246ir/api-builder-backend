import {z} from "zod"

export const SecretSchema = z.object({
    key:z.string(),
    type:z.enum(["database","general"]).default("general"),
    value:z.string(), 
})

export type SecretType = z.infer<typeof SecretSchema>