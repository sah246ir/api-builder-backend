import express,{Request,Response,NextFunction} from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import { corsHeaders } from "./Middlewares/cors-headers.js"; 
import { SecretsRouter } from "./Routes/ProjectRoutes/secretsRoute.js";
import { DatabaseRouter } from "./Routes/ProjectRoutes/DataseRoute.js";
import { ProjectRouter } from "./Routes/ProjectRoutes/ProjectRoute.js";
import { CollectionRouter } from "./Routes/ProjectRoutes/CollectionRoute.js";
import { ApiRouter } from "./Routes/ProjectRoutes/ApiRoute.js";
import { RequestSchemaRouter } from "./Routes/ProjectRoutes/RequestSchemaRoute.js";
import { DeploymentRouter } from "./Routes/ProjectRoutes/DeploymentRoute.js";
import { clients } from "./config/config.js";
import { PORT } from "./config/env.js";

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

const app = express()
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
const server = app.listen(PORT, () => {
    console.log("server listening on http://localhost:"+PORT)
})

 
 


 
