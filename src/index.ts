 
import express,{Request,Response,NextFunction} from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import { corsHeaders } from "./Middlewares/cors-headers"; 
import { config } from "dotenv";
import { SecretsRouter } from "./Routes/ProjectRoutes/secretsRoute";
import { PrismaClient } from "@prisma/client";
import { DatabaseRouter } from "./Routes/ProjectRoutes/DataseRoute";
import { ProjectRouter } from "./Routes/ProjectRoutes/ProjectRoute";
import { CollectionRouter } from "./Routes/ProjectRoutes/CollectionRoute";
import { ApiRouter } from "./Routes/ProjectRoutes/ApiRoute";
import { RequestSchemaRouter } from "./Routes/ProjectRoutes/RequestSchemaRoute";
 

declare global {
    namespace Express {
        interface Request { 
            projectId?: string; 
            organization?: string; 
        }
    }
}

config()
const app = express() 
export const prisma = new PrismaClient()
// initialize services
export const clients = (process.env.CLIENTS || "").split(",")
export const HASHING_SALT = (process.env.HASHING_SALT || "")

app.use(cors({
    origin: clients,// array of client urls
    credentials: true
}))

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false })) 

// custom headers
app.use(corsHeaders);

// routes
app.use("/api/v1/secrets", SecretsRouter) 
app.use("/api/v1/database", DatabaseRouter) 
app.use("/api/v1/project", ProjectRouter) 
app.use("/api/v1/collection", CollectionRouter) 
app.use("/api/v1/api", ApiRouter) 
app.use("/api/v1/request-schema", RequestSchemaRouter) 
 

// server listen
const server = app.listen(process.env.PORT, () => {
    console.log("server listening on http://localhost:"+process.env.PORT)
})

 
 


 
