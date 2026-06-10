import { Job, JobType, Worker } from "bullmq";
import { ApiDeploymentHandler } from "./handlers/ApiDeploymentHandler.js";

interface BaseJobData {
    type:"deploy" | "redeploy";
}
interface JobData extends BaseJobData {
    apiId: number;
    namespace: string;
    projectId: string;
    key: string;
    deploymentId: number;
}
export const Queueworker = new Worker('queue', 
    async (job:Job<JobData>) => {
        switch (job.data.type) {
            case "deploy": 
            case "redeploy":
                ApiDeploymentHandler({
                    apiId: job.data.apiId,
                    namespace: job.data.namespace,
                    projectId: job.data.projectId,
                    key: job.data.key,
                });
                break;
        }
    },
    {
        connection: {
          host: "127.0.0.1",
          port: 6379,
        },
        autorun: false,
      }

) 