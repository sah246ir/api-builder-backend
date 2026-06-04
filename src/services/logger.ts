import { LogSource, PrismaClient } from "@prisma/client";

export type LogLevel = "INFO" | "WARN" | "ERROR";

export interface LogEvent {
    deploymentId: number;
    level: LogLevel;
    message: string;
    timestamp: Date;
    source?: string;
    metadata?: Record<string, any>;
    type?: "success" | "error" | "warning" | "info" | "log";
}
export interface Logger {
    log(event: LogEvent): Promise<void>;
}
export interface LogHandler {
    handle(event: LogEvent): Promise<void>;
}

export class LogManager implements Logger {
    private handlers: LogHandler[];

    constructor(handlers: LogHandler[]) {
        this.handlers = handlers;
    }

    async log(event: LogEvent): Promise<void> {
        for (const handler of this.handlers) {
            await handler.handle(event);
        }
    }
}

export class ConsoleLogHandler implements LogHandler {
    async handle(event: LogEvent): Promise<void> {
        console.log(JSON.stringify(event, null, 2));
    }
}
export class DBLogHandler implements LogHandler {
    constructor(private prisma: PrismaClient) { }

    async handle(event: LogEvent): Promise<void> {
        await this.prisma.deploymentLog.create({
            data: {
                deployment_id: event.deploymentId,
                level: event.level,
                message: event.message,
                source: event.source as LogSource,
                created_at: event.timestamp,
                type: event.type,
            },
        });
    }
}


export class SSELogHandler implements LogHandler {
    private clients: Map<number, Set<any>> = new Map();

    addClient(deploymentId: number, res: any) {
        if (!this.clients.has(deploymentId)) {
            this.clients.set(deploymentId, new Set());
        }

        this.clients.get(deploymentId)!.add(res);
    }

    removeClient(deploymentId: number, res: any) {
        this.clients.get(deploymentId)?.delete(res);
    }

    async handle(event: LogEvent): Promise<void> {
        const clients = this.clients.get(event.deploymentId);
        if (!clients) return;

        for (const res of clients) {
            res.write(`data: ${JSON.stringify(event)}\n\n`);
        }
    }
}