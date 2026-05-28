import { TaskQueue } from "./Queue.js"

export const DeployApiJob = async ({
    apiId,
    namespace,
    projectId,
    key,
}: {
    apiId: number,
    namespace: string,
    projectId: string,
    key: string,
}) => {
    return TaskQueue.add("deploy", { type: "deploy", apiId, namespace, projectId, key })
}