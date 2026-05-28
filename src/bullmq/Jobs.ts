import { TaskQueue } from "./Queue.js"

export const DeployApiJob =  ({
    deploymentId,
    apiId,
    namespace,
    projectId,
    key,
}: {
    deploymentId: number,
    apiId: number,
    namespace: string,
    projectId: string,
    key: string,
}) => {
    return TaskQueue.add("deploy", { type: "deploy", deploymentId, apiId, namespace, projectId, key })
}