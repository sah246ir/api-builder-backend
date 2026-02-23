 
import express,{Request,Response,NextFunction} from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import { corsHeaders } from "./Middlewares/cors-headers.js"; 
import { config } from "dotenv";
import { SecretsRouter } from "./Routes/ProjectRoutes/secretsRoute.js";
import { PrismaClient } from "@prisma/client";
import { DatabaseRouter } from "./Routes/ProjectRoutes/DataseRoute.js";
import { ProjectRouter } from "./Routes/ProjectRoutes/ProjectRoute.js";
import { CollectionRouter } from "./Routes/ProjectRoutes/CollectionRoute.js";
import { ApiRouter } from "./Routes/ProjectRoutes/ApiRoute.js";
import { RequestSchemaRouter } from "./Routes/ProjectRoutes/RequestSchemaRoute.js";
import * as kubeclient from '@kubernetes/client-node';
import { K8sService } from "./services/k8.js";
import { DeploymentRouter } from "./Routes/ProjectRoutes/DeploymentRoute.js";
 

declare global {
    namespace Express {
        interface Request { 
            projectId?: string; 
            organization?: string; 
            organizationName?: string; 
            namespace?: string; 
        }
    }
}

config()
const app = express() 
export const prisma = new PrismaClient()
// initialize services
export const clients = (process.env.CLIENTS || "").split(",")
export const HASHING_SALT = (process.env.HASHING_SALT || "")

// initialize kubernetes client
const k8s = new kubeclient.KubeConfig()
k8s.loadFromDefault()
export const k8sClient = k8s.makeApiClient(kubeclient.AppsV1Api)
export const k8sCore = k8s.makeApiClient(kubeclient.CoreV1Api)
export const k8sNetworking = k8s.makeApiClient(kubeclient.NetworkingV1Api)
export const k8sService = new K8sService(k8sClient, k8sCore, k8sNetworking)
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
app.use("/api/v1/deployments", DeploymentRouter) 
 

// server listen
const server = app.listen(process.env.PORT, () => {
    console.log("server listening on http://localhost:"+process.env.PORT)
})

 
 


 
