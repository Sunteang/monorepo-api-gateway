//V2
import express, { Request, Response } from "express";
import setupProxy from "./middlewares/proxyMiddleware";
import {
  routeConfigMiddleware,
  authenticateToken,
  authorizeRole,
} from "../src/middlewares/auth";

// ========================
// Initialize App Express
// ========================
const app = express();

// ========================
// Global Middleware
// ========================

// ========================
// Auth Middleware
// ========================
app.use(routeConfigMiddleware);
app.use(authenticateToken);
app.use(authorizeRole);

// ========================
// Set up the proxy middleware
// ========================
setupProxy(app);

app.get("/v1/gateway", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "OK",
  });
});

export default app;
