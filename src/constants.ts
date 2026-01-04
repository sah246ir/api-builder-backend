import { Prisma } from "@prisma/client";

export const API_DEPLOYMENT_SPEC = {
    id: true,
    name: true,
    endpoint: true,
    ApiEndpoint: {
        select: {
            RequestBody: {
                select: {
                    schema: true,
                }
            },
            QueryParams: {
                select: {
                    schema: true,
                }
            },
            definition: true,
            endpoint: true,
            method: true,
        },

    }
}

interface k8S_DEPLOYMENT_INTERFACE {
    namespace: string,
    name: string,
    label: string,
    secretRef: string,
    env: {
        name: string,
        value: string
    }[]
    volumeMounts: {
        name: string,
        mountPath: string
    }[]
    volumes: {
        name: string,
        configMap: {
            name: string
        }
    }[]
}
export const k8S_DEPLOYMENT = ({ namespace, name, label, secretRef, env, volumeMounts, volumes }: k8S_DEPLOYMENT_INTERFACE) => {
    return {
        "apiVersion": "apps/v1",
        "kind": "Deployment",
        "metadata": {
            "name": name,
            "namespace": namespace
        },
        "spec": {
            "replicas": 1,
            "selector": {
                "matchLabels": {
                    "app": label
                }
            },
            "template": {
                "metadata": {
                    "labels": {
                        "app": label
                    }
                },
                "spec": {
                    "containers": [
                        {
                            "name": "api",
                            "image": "sah246ir/dynamic-api:latest",
                            "envFrom": [
                                {
                                    "secretRef": {
                                        "name": secretRef
                                    }
                                }
                            ],
                            "env": env,
                            "volumeMounts": volumeMounts,
                        }
                    ],
                    "volumes": volumes
                }
            }
        }
    }
}
