import { PrismaClient } from "@prisma/client";
import { K8sUtils } from "../services/k8.utils.js";
import { CLIENTS } from "./env.js";
import { ConsoleLogHandler, DBLogHandler, LogManager, SSELogHandler } from "../services/logger.js";

export const prisma = new PrismaClient();
export const clients = CLIENTS ? CLIENTS.split(",") : [];
const dbLogHandler = new DBLogHandler(prisma);
export const sseLogHandler = new SSELogHandler();
export const logger = new LogManager([
    new ConsoleLogHandler(),
    dbLogHandler,
    sseLogHandler
])
export const k8sService = new K8sUtils(logger); 