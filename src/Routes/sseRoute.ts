import { Router } from "express";
import { sseLogHandler } from "../config/config.js";

const sseRouter = Router();

sseRouter.get("/:deploymentId", (req, res) => {
    const deploymentId = Number(req.params.deploymentId);

    if (Number.isNaN(deploymentId)) {
        return res.status(400).json({
            error: "Invalid deploymentId",
        });
    }

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Optional but recommended for nginx/proxies
    res.setHeader("X-Accel-Buffering", "no");

    // Flush headers immediately
    res.flushHeaders?.();

    // Initial connection event (optional)
    res.write(`event: connected\n`);
    res.write(`data: SSE connected\n\n`);

    // Register client
    sseLogHandler.addClient(deploymentId, res);

    // Cleanup when client disconnects
    req.on("close", () => {
        console.log(`SSE client disconnected: ${deploymentId}`);

        sseLogHandler.removeClient(deploymentId, res);
        res.end();
    });
});

export default sseRouter;