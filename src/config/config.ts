import { PrismaClient } from "@prisma/client";
import { K8sService } from "../services/k8.js";
import { CLIENTS } from "./env.js";
import { DBLogHandler, LogManager } from "../services/logger.js";

export const prisma = new PrismaClient();
export const clients = CLIENTS ? CLIENTS.split(",") : [];
export const k8sService = new K8sService();

const dbLogHandler = new DBLogHandler(prisma);
export const logger = new LogManager([
    dbLogHandler
])