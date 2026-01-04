import * as kubeclient from '@kubernetes/client-node';
export class K8sService {
    Client: {
        k8sClient: kubeclient.AppsV1Api
        k8sCore: kubeclient.CoreV1Api
    }
    constructor(k8sClient: kubeclient.AppsV1Api, k8sCore: kubeclient.CoreV1Api) {
        this.Client = {
            k8sClient,
            k8sCore
        }
    }

    async getNamespace(name: string) {
        try {
            const namespace = await this.Client.k8sCore.readNamespace({
                name: name
            })
            return namespace
        } catch (e) {
            return undefined
        }
    }

    async getDeployment(namespace: string,projectId: string,apiName: string) {
        try {
            const deployment = await this.Client.k8sClient.readNamespacedDeployment({
                namespace:namespace,
                name:`deployment-${projectId}-${apiName.toLowerCase().trim().replace(/ /g, '-')}`
            })
            return deployment
        } catch (e) {
            return undefined
        }
    }

}