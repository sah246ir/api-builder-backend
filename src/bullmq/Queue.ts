import { Queue } from "bullmq";
import { Queueworker } from "./Worker.js";

export const TaskQueue = new Queue('queue', {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  }
}) 

Queueworker.run()