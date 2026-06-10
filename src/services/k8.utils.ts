import { K8sService } from "./k8.js"
import { LogManager } from "../services/logger.js";
import { k8sService, prisma } from "../config/config.js";
import { DeploymentStatus } from "@prisma/client";
import { generateKey } from "../utils.js";
import { API_DEPLOYMENT_SPEC } from "../constants.js";

export class K8sUtils extends K8sService {
    logger: LogManager
    constructor(logger: LogManager) {
        super()
        this.logger = logger
    }

    async DeployApi({
        api,
        key,
        namespace,
        projectId,
    }: {
        api: {
            id: number,
            name: string,
        },
        key: string,
        namespace: string,
        projectId: string,
    }) {
        const apiSpec = await prisma.api.findFirst({
            where: {
                id: api.id
            },
            select: API_DEPLOYMENT_SPEC
        })
        const DbDeployment = await prisma.deployment.create({
            data: {
                api_id: api.id,
                namespace: namespace as string,
                deployment_name: `deployment-${key}`,
                status: DeploymentStatus.pending,
                version: 1
            }
        })
        const appLabel = api.name.toLowerCase().trim().replace(/ /g, '-')
        let knamespace = await this.getNamespace(namespace)
        if (!knamespace) {
            knamespace = await this.Client.k8sCore.createNamespace({
                body: {
                    metadata: {
                        name: namespace,
                    }
                }
            })
        }
        this.logger.log({
            deploymentId: DbDeployment.id,
            level: "INFO",
            message: `Getting your application's specifications`,
            source: "DEPLOYMENT",
            timestamp: new Date(),
            type: "info"
        })
        await this.createConfigMap(
            namespace,
            `config-map-${key}`,
            { "api.json": JSON.stringify(apiSpec) }
        )

        this.logger.log({
            deploymentId: DbDeployment.id,
            level: "INFO",
            message: `Getting your database credentials`,
            source: "DEPLOYMENT",
            timestamp: new Date(),  
            type: "info"
        })
        const dbSecrets = await prisma.secret.findFirst({
            where: {
                project_id: projectId,
                key: "MONGO_URI"
            },
            select: {
                value: true
            }
        })

        this.logger.log({
            deploymentId: DbDeployment.id,
            level: "INFO",
            message: `Configuring your deployment`,
            source: "DEPLOYMENT",
            timestamp: new Date(),
            type: "info"
        })
        await this.createSecret(
            namespace as string,
            `secret-${key}`,
            {
                PORT: "5000",
                SPEC_PATH: `/${apiSpec?.id}/api.json`,
                MONGO_URI: dbSecrets?.value || ""
            }
        )

        this.logger.log({
            deploymentId: DbDeployment.id,
            level: "INFO",
            message: `Pushing your deployment to the cluster`,
            source: "DEPLOYMENT",
            timestamp: new Date(),
            type: "info"
        })
        await this.createDeployment({
            namespace: namespace as string,
            name: `deployment-${key}`,
            label: appLabel,
            secretRef: `secret-${key}`,
            volumeMounts: [
                {
                    mountPath: `/${apiSpec?.id}`,
                    name: apiSpec?.id.toString() || ""
                }
            ],
            volumes: [
                {
                    configMap: {
                        name: `config-map-${key}`
                    },
                    name: apiSpec?.id.toString() || ""
                }
            ]
        })

        this.logger.log({
            deploymentId: DbDeployment.id,
            level: "INFO",
            message: `Exposing your api to the internet`,
            source: "DEPLOYMENT",
            timestamp: new Date(),
            type: "info"
        })
        await this.createService(
            namespace as string,
            `service-${key}`,
            { app: appLabel },
            80,
            5000
        )
        console.log(`ingress-${key}`)
        await this.createIngress(
            namespace as string,
            `ingress-${key}`,
            `baas.local`,
            `service-${key}`,
            80,
            `/`
        )
        await prisma.deployment.update({
            where: {
                id: DbDeployment.id,
            },
            data: {
                status: DeploymentStatus.deployed,
            }
        })
    }

    async RedeployApi({
        namespace,
        key,
        api,
    }: {
        namespace: string,
        key: string,
        api: {
            id: number,
            name: string,
        },
    }) {
        const apiSpec = await prisma.api.findFirst({
            where: {
                id: api.id
            },
            select: API_DEPLOYMENT_SPEC
        })
        const DbDeployment = await prisma.deployment.create({
            data: {
                api_id: api.id,
                namespace: namespace as string,
                deployment_name: `deployment-${key}`,
                status: DeploymentStatus.pending,
                version: 1
            }
        })
        this.logger.log({
            deploymentId: DbDeployment.id,
            level: "INFO",
            message: `Restarting your deployment`,
            source: "DEPLOYMENT",
            timestamp: new Date(),
            type: "info"
        })
        await this.updateConfigMap(
            namespace as string, 
            `config-map-${key}`, 
            [{ 
            op: "add",
            path: "/data/api.json",
            value: JSON.stringify(apiSpec)
         }]
        )
        await this.restartDeployment(namespace as string, `deployment-${key}`)
        this.logger.log({
            deploymentId: DbDeployment.id,
            level: "INFO",
            message: `Deployment restarted successfully.`,
            source: "DEPLOYMENT",
            timestamp: new Date(),
            type: "success"
        })
        await prisma.deployment.update({
            where: {
                id: DbDeployment.id,
            },
            data: {
                status: DeploymentStatus.deployed,
            }
        })
    }

    async DestroyApi({
        namespace,
        key,
    }: {
        namespace: string,
        key: string,
    }) {
        await this.Client.k8sCore.deleteNamespace({
            name: namespace,
        })
        
    }
}