import * as kubeclient from '@kubernetes/client-node';
export class K8sService {
    Client: {
        k8sClient: kubeclient.AppsV1Api
        k8sCore: kubeclient.CoreV1Api
        k8sNetworking: kubeclient.NetworkingV1Api
    }
    constructor() {
        const k8s = new kubeclient.KubeConfig()
        k8s.loadFromDefault()
        this.Client = {
            k8sClient: k8s.makeApiClient(kubeclient.AppsV1Api),
            k8sCore: k8s.makeApiClient(kubeclient.CoreV1Api),
            k8sNetworking: k8s.makeApiClient(kubeclient.NetworkingV1Api),
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

    async getDeployment(namespace: string, key: string) {
        try {
            const deployment = await this.Client.k8sClient.readNamespacedDeployment({
                namespace: namespace,
                name: key
            })
            return deployment
        } catch (e) {
            return undefined
        }
    }

    async restartDeployment(namespace: string, key: string) {
        const now = new Date()
        console.log(now.toISOString(), now.getTime())
            await this.Client.k8sClient.patchNamespacedDeployment(
                {
                    name: key,
                    namespace: namespace,
                    body: [
                        {
                            op: "add",
                            path: "/spec/template/metadata/annotations/kubectl.kubernetes.io~1restartedAt",
                            value: Date.now().toString()
                        }
                    ]
                }
            )
    }

    async createConfigMap(namespace: string, name: string, data: Record<string, string>) {
        return await this.Client.k8sCore.createNamespacedConfigMap({
            namespace: namespace,
            body: {
                metadata: {
                    name: name,
                },
                data: data
            },
        })
    }
    async updateConfigMap(namespace: string, name: string, data: any[]) {
        return await this.Client.k8sCore.patchNamespacedConfigMap({
            namespace: namespace,
            name: name,
            body: data
        })
    }
    async createSecret(namespace: string, name: string, stringData: Record<string, string>) {
        return await this.Client.k8sCore.createNamespacedSecret({
            namespace: namespace,
            body: {
                stringData: stringData,
                metadata: {
                    name: name
                }
            }
        })
    }

    async createService(namespace: string, name: string, selector: Record<string, string>, port: number, targetPort: number, type: string = "NodePort") {
        return await this.Client.k8sCore.createNamespacedService({
            namespace: namespace,
            body: {
                metadata: {
                    name: name,
                },
                spec: {
                    type: type,
                    selector: selector,
                    ports: [
                        {
                            port: port,
                            targetPort: targetPort,
                        }
                    ]
                }
            }
        })
    }

    async createIngress(namespace: string, name: string, host: string, serviceName: string, servicePort: number, path: string = "/", pathType: string = "Prefix") {
        return await this.Client.k8sNetworking.createNamespacedIngress({
            namespace: namespace,
            body: {
                metadata: {
                    name: name
                },
                spec: {
                    rules: [
                        {
                            host: host,
                            http: {
                                paths: [
                                    {
                                        path: path,
                                        pathType: pathType,
                                        backend: {
                                            service: {
                                                name: serviceName,
                                                port: {
                                                    number: servicePort
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        })
    }
}