import { DeploymentStatus } from "@prisma/client"
import { k8sService, logger, prisma } from "../../config/config.js"
import { API_DEPLOYMENT_SPEC } from "../../constants.js"

export const ApiDeploymentHandler = async ({
    apiId,
    namespace,
    projectId,
    key,
    deploymentId,
}: {
    apiId: number,
    namespace: string,
    projectId: string,
    key: string,
    deploymentId: number,
}) => {
    const apiSpec = await prisma.api.findFirst({
        where: {
            id: apiId
        },
        select: API_DEPLOYMENT_SPEC
    })
    if (!apiSpec) {
        throw new Error("Api not found")
    }
    logger.log({
        deploymentId: deploymentId,
        level: "INFO",
        message: "Deployment initiated",
        source: "DEPLOYMENT",
        timestamp: new Date(),
        type: "info"
    })
    logger.log({
        deploymentId: deploymentId,
        level: "INFO",
        message: "Getting your project's namespace",
        source: "DEPLOYMENT",
        timestamp: new Date(),
        type: "info"
    })

    let kNamespace = await k8sService.getNamespace(namespace)
    if (!kNamespace) {
        logger.log({
            deploymentId: deploymentId,
            level: "INFO",
            message: "There was no namespace found for your project, creating one",
            source: "DEPLOYMENT",
            timestamp: new Date(),
            type: "warning"
        })
        kNamespace = await k8sService.Client.k8sCore.createNamespace({
            body: {
                metadata: {
                    name: namespace
                }
            },
        })
        logger.log({
            deploymentId: deploymentId,
            level: "INFO",
            message: `Namespace (${kNamespace.metadata?.name}) created for your project`,
            source: "DEPLOYMENT",
            timestamp: new Date(),
            type: "info"
        })
    } else {
        logger.log({
            deploymentId: deploymentId,
            level: "INFO",
            message: `Namespace (${kNamespace.metadata?.name}) found for your project`,
            source: "DEPLOYMENT",
            timestamp: new Date(),
            type: "success"
        })
    }
    const deployment = await k8sService.getDeployment(namespace, `deployment-${key}`)
    if (!deployment) {
        await k8sService.DeployApi({
            api: {
                id: apiId,
                name: apiSpec.name
            },
            key: key,
            namespace: namespace,
            projectId: projectId
        })
    } else {
        await k8sService.RedeployApi({
            deploymentId: deploymentId,
            namespace: namespace,
            key: key,
            api: {
                id: apiId,
                name: apiSpec.name
            }
        })
    }
    await prisma.deployment.update({
        where: {
            id: deploymentId
        },
        data: {
            status: DeploymentStatus.deployed,
            completed_at: new Date()
        }
    })
}