import { k8sService, prisma } from "../config/config.js"
import { Request, Response } from "express"
import { API_DEPLOYMENT_SPEC, k8S_DEPLOYMENT } from "../constants.js"
import { generateKey } from "../utils.js"

export const DeployApi = async (req: Request, res: Response) => {
    let namespace = await k8sService.getNamespace(req.namespace as string)
    try {
        const apiId = req.params.apiId as string
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
        const key = generateKey(req.projectId as string,apiSpec.name)
        const deployment = await k8sService.getDeployment(req.namespace as string,`deployment-${key}`)
        if (!deployment) {
            const appLabel = apiSpec.name.toLowerCase().trim().replace(/ /g, '-')
            
            await k8sService.createConfigMap(
                req.namespace as string,
                `config-map-${key}`,
                { "api.json": JSON.stringify(apiSpec) }
            )

            const dbSecrets = await prisma.secret.findFirst({
                where:{
                    project_id:req.projectId as string,
                    key:"MONGO_URI"
                },
                select:{
                    value:true
                }
            })

            await k8sService.createSecret(
                req.namespace as string,
                `secret-${key}`,
                {
                    PORT: "5000",
                    SPEC_PATH: `/${apiSpec.id}/api.json`,
                    MONGO_URI: dbSecrets?.value || ""
                }
            )

            await k8sService.Client.k8sClient.createNamespacedDeployment({
                namespace: req.namespace as string,
                body: k8S_DEPLOYMENT({
                    namespace: req.namespace as string,
                    name: `deployment-${key}`,
                    label: appLabel,
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

            await k8sService.createService(
                req.namespace as string,
                `service-${key}`,
                { app: appLabel },
                80,
                5000
            )

            await k8sService.createIngress(
                req.namespace as string,
                `ingress-${key}`,
                `${appLabel}.local`,
                `service-${key}`,
                80
            )
        }else{
            await k8sService.restartDeployment(req.namespace as string,deployment.metadata?.name as string)
        }
        return res.json({
            message: "Deployment initiated successfully",
        })
    } catch (e) {
        console.log(e)
        if(namespace){
            await k8sService.Client.k8sCore.deleteNamespace({
                name:req.namespace as string,
            })
        }
        return res.status(400).json({
            message: (e as any).message || "Unknown error occured"
        })
    }
}