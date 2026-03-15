import z from "zod";
import { FieldSchema, TypeEnum } from "./DatabaseCollection.js";




const HttpMethod = z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]);

const RouteActionSchema = z.object({
    action: z.string(),
    collection: z.string().optional(),
    filterBy: z.array(FieldSchema).optional()
});

const HttpSchema = z.object({
    field: z.string(),
    type: TypeEnum,
    required: z.boolean().optional()
});

const ApiTemplateRoute = z.object({
    method: HttpMethod,
    endpoint: z.string(),
    action: z.string(),
    RequestBodyFromCollection:z.boolean().default(false),
    queryParams: z.array(HttpSchema).optional(),
    routeActions: z.array(RouteActionSchema).min(1)
});

export const ApiTemplateSchema = z.object({
    name: z.string(),
    template: z.array(ApiTemplateRoute)
});

export type ApiTemplateType = z.infer<typeof ApiTemplateSchema>

export const CreateApiFromTemplateSchema = z.object({
    collection:z.string(),
    endpoint:z.string(),
    name:z.string(),
})

export type CreateApiFromTemplateType = z.infer<typeof CreateApiFromTemplateSchema>


