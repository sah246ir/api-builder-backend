import { k8sClient, k8sCore, k8sService, prisma } from "../index.js"
import { Request, Response } from "express"
import { API_DEPLOYMENT_SPEC, k8S_DEPLOYMENT } from "../constants.js"

export const DeployApi = async (req: Request, res: Response) => {
    try {
        const apiId = req.params.apiId as string
        let namespace = await k8sService.getNamespace(req.namespace as string)
        if (!namespace) {
            namespace = await k8sService.Client.k8sCore.createNamespace({
                body: {
                    metadata: {
                        name: req.namespace as string
                    }
                },
            })
        }
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
        const key = `${req.projectId}-${apiSpec.name.toLowerCase().trim().replace(/ /g, '-')}`
        const deployment = await k8sService.getDeployment(req.namespace as string, req.projectId as string, apiSpec.name)
        if (!deployment) {
            const configMap = await k8sService.Client.k8sCore.createNamespacedConfigMap({
                namespace: req.namespace as string,
                body: {
                    metadata: {
                        name: `config-map-${key}`, 
                    },
                    data:{
                        "api.json": JSON.stringify(apiSpec)
                    }
                },
            })
            const dbSecrets = await prisma.secret.findFirst({
                where:{
                    project_id:req.projectId as string,
                    type:"database",
                    key:"MONGO_URI"
                },
                select:{
                    value:true
                }
            })
            const secret = await k8sService.Client.k8sCore.createNamespacedSecret({
                namespace: req.namespace as string,
                body:{
                    data:{
                        PORT:"5000",
                        SPEC_PATH:"/api.json",
                        MONGO_URI:dbSecrets?.value || ""
                    },
                    metadata:{
                        name:`secret-${key}`
                    }
                }
            })

            await k8sService.Client.k8sClient.createNamespacedDeployment({
                namespace: req.namespace as string,
                body: k8S_DEPLOYMENT({
                    namespace: req.namespace as string,
                    name: `deployment-${key}`,
                    label: apiSpec.name.toLowerCase().trim().replace(/ /g, '-'),
                    secretRef: `secret-${key}`,
                    env: [],
                    volumeMounts: [
                        {
                            mountPath:`/${apiSpec.id}`,
                            name:apiSpec.id.toString()
                        }
                    ],
                    volumes: [
                        {
                            configMap:{
                                name:`config-map-${key}`
                            },
                            name:apiSpec.id.toString()
                        }
                    ]
                })
            })

            await k8sService.Client.k8sCore.createNamespacedService({
                namespace: req.namespace as string,
                body: {
                    metadata: {
                        name: `service-${key}`,
                    },
                    spec:{
                        type:"NodePort",
                        ports:[
                            {
                                port:80,
                                targetPort:5000,
                            }
                        ]
                    }
                }
            })

            await k8sService.Client.k8sNetworking.createNamespacedIngress({
                namespace:req.namespace as string,
                body: {
                    metadata: {
                        name: `ingress-${key}`
                    },
                    spec: {
                        rules: [
                            {
                                host: `${apiSpec.name.toLowerCase().trim().replace(/ /g, '-')}.local`,
                                http:{
                                    paths:[
                                        {
                                            path:"/",
                                            pathType:"Prefix",
                                            backend:{
                                                service:{
                                                    name:`service-${key}`,
                                                    port:{
                                                        number:80
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
        return res.json({
            message: "Namespace found",
        })
    } catch (e) {
        return res.status(400).json({
            message: (e as any).message || "Unknown error occured"
        })
    }
}