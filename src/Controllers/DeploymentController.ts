import { k8sService, logger, prisma } from "../config/config.js"
import { Request, Response } from "express"
import { API_DEPLOYMENT_SPEC, k8S_DEPLOYMENT } from "../constants.js"
import { generateKey } from "../utils.js"
import { DeploymentStatus } from "@prisma/client"
import { DeployApiJob } from "../bullmq/Jobs.js"

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
            api_id: parseInt(apiId),
            namespace: req.namespace as string,
            deployment_name: `deployment-${generateKey(req.projectId as string, apiSpec.name)}`,
            status: DeploymentStatus.pending,
            version: 1
        }
    })
    const job = await DeployApiJob({
        deploymentId: Deployment.id,
        apiId: parseInt(apiId),
        namespace: req.namespace as string,
        projectId: req.projectId as string,
        key: generateKey(req.projectId as string, apiSpec.name)
    }) 
    return res.status(200).json({
        deploymentId: Deployment.id,
        jobId: job?.id || "",
        status: DeploymentStatus.pending
    })
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