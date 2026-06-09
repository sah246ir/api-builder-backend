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
    const deployment = await prisma.deployment.findFirst({
        where: {
            api_id: apiId,
            status: DeploymentStatus.deployed
        }
    })
    if (!deployment) {
        await k8sService.DeployApi({
            api: apiSpec,
            key: key,
            namespace: namespace,
            projectId: projectId
        })
    }else{
        await k8sService.RedeployApi({
            deploymentId: deploymentId,
            namespace: namespace,
            key: key,
            api: apiSpec
        })
    }
}