import { z } from "zod";

export const TypeEnum = z.enum(["string","object","boolean","number","objectid"])
export const FieldSchema = z.object({
    field: z.string(),
    array: z.boolean().optional(),
    required: z.boolean().optional(),
    type:z.any()
});
export const CollectionSchema = z.array(FieldSchema)
export const DatabaseCollectionSchema = z.object({
    collection_name:z.string(),
    collection_description:z.string(),
    endpoint:z.string(),
    schema:z.array(FieldSchema)
})


export type DatabaseCollectionType = z.infer<typeof DatabaseCollectionSchema>
