import { k8sService, logger, prisma } from "../config/config.js"
import { Request, Response } from "express"
import { API_DEPLOYMENT_SPEC, k8S_DEPLOYMENT } from "../constants.js"
import { generateKey } from "../utils.js"
import { DeploymentStatus } from "@prisma/client"

export const DeployApi = async (req: Request, res: Response) => {
    const apiId = req.params.apiId as string
    const apiSpec = await prisma.api.findFirst({
        where: {
            id: parseInt(apiId)
        },
        select: API_DEPLOYMENT_SPEC
    })
    if (!apiSpec) {
        return res.status(400).json({
            message: "Api not found"
        })
    }
    const Deployment = await prisma.deployment.create({
        data: {
            api_id: parseInt(req.params.apiId as string),
            namespace: req.namespace as string,
            deployment_name: `deployment-${generateKey(req.projectId as string, apiSpec.name)}`,
            status: DeploymentStatus.pending,
            version: 1
        }
    })
    logger.log({
        deploymentId: Deployment.id,
        level: "INFO",
        message: "Deployment initiated",
        source: "DEPLOYMENT",
        timestamp: new Date(),
        type: "info"
    })
    logger.log({
        deploymentId: Deployment.id,
        level: "INFO",
        message: "Getting your project's namespace",
        source: "DEPLOYMENT",
        timestamp: new Date(),
        type: "info"
    })
    let namespace = await k8sService.getNamespace(req.namespace as string)
    try {
        if (!namespace) {
            logger.log({
                deploymentId: Deployment.id,
                level: "INFO",
                message: "There was no namespace found for your project, creating one",
                source: "DEPLOYMENT",
                timestamp: new Date(),
                type: "warning"
            })
            namespace = await k8sService.Client.k8sCore.createNamespace({
                body: {
                    metadata: {
                        name: req.namespace as string
                    }
                },
            })
            logger.log({
                deploymentId: Deployment.id,
                level: "INFO",
                message: `Namespace (${namespace.metadata?.name}) created for your project`,
                source: "DEPLOYMENT",
                timestamp: new Date(),
                type: "info"
            })
        }else{
            logger.log({
                deploymentId: Deployment.id,
                level: "INFO",
                message: `Namespace (${namespace.metadata?.name}) found for your project`,
                source: "DEPLOYMENT",
                timestamp: new Date(),
                type: "success"
            })
        }
        const key = generateKey(req.projectId as string, apiSpec.name)
        const deployment = await k8sService.getDeployment(req.namespace as string, `deployment-${key}`)
        if (!deployment) {
            await k8sService.DeployApi({
                api: {
                    id: parseInt(apiId),
                    name: apiSpec.name
                },
                key: key,
                namespace: req.namespace as string,
                projectId: req.projectId as string
            })
        } else {
            await k8sService.RedeployApi({
                deploymentId: Deployment.id,
                namespace: req.namespace as string,
                key: key,
                api: {
                    id: parseInt(apiId),
                    name: apiSpec.name
                }
            })
        }
        await prisma.deployment.update({
            where: {
                id: Deployment.id
            },
            data: {
                status: DeploymentStatus.deployed,
                completed_at: new Date()
            }
        })
        return res.json({
            message: "Deployment initiated successfully",
        })
    } catch (e) { 
        console.log(e)
        logger.log({
            deploymentId: Deployment.id,
            level: "ERROR",
            message: "Unknown error occured",
            source: "DEPLOYMENT",
            timestamp: new Date(),  
            type: "error"
        })
        await prisma.deployment.update({
            where: {
                id: Deployment.id
            },
            data: {
                status: DeploymentStatus.failed
            }
        })
        return res.status(400).json({
            message: (e as any).message || "Unknown error occured"
        })
    }
}



export const getDeployments = async (req: Request, res: Response) => {
    const apiId = req.params.apiId as string
    const api = await prisma.api.findFirst({
        where: {
            id: parseInt(apiId)
        }
    })
    if (!api) {
        return res.status(400).json({
            message: "Api not found"
        })
    }
    const deployments = await prisma.deployment.findMany({
        where: {
            api_id: api.id
        },
        orderBy: {
            initiated_at: "desc"
        }
    })
    return res.json(deployments)
}

export const getDeploymentLogs = async (req: Request, res: Response) => {
    const deploymentId = req.params.deploymentId as string
    const deployment = await prisma.deployment.findFirst({
        where: {
            id: parseInt(deploymentId)
        }
    })
    if (!deployment) {
        return res.status(400).json({
            message: "Deployment not found"
        })
    }
    const logs = await prisma.deploymentLog.findMany({
        where: {
            deployment_id: deployment.id
        }
    })
    return res.json(logs)
}