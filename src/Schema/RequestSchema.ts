import { z } from "zod";
import { FieldSchema } from "./DatabaseCollection";

 
  
export const UpdateRequestSchema = z.object({
    schema:z.array(FieldSchema)
})


export type UpdateRequestSchemaType = z.infer<typeof UpdateRequestSchema>
