// import { Request, Response, NextFunction } from "express";
// import config from "@/config";
// import axios from "axios";

//V2
import { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { IncomingMessage, ServerResponse } from "http";

const setupProxy = (app: Express) => {
  const isDocker = process.env.DOCKER_ENV === "true";

  const productTarget =
    process.env.PRODUCT_SERVICE_URL ||
    (isDocker ? "http://host.docker.internal:4001" : "http://localhost:4001");

  const authTarget =
    process.env.AUTH_SERVICE_URL ||
    (isDocker ? "http://host.docker.internal:4002" : "http://localhost:4002");

  // Function to handle proxy errors with proper typing
  const handleProxyError = (
    err: Error,
    _req: IncomingMessage,
    res: ServerResponse
  ) => {
    console.error("Proxy error:", err.message);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Service is unavailable" }));
    }
  };

  // Proxy for Product service
  app.use("/api/v1/product", (req, res, next) => {
    const proxy = createProxyMiddleware({
      target: productTarget,
      changeOrigin: true,
      pathRewrite: { "^/api/v1/product": "/product" },
    });

    // Handle errors for the proxy
    proxy(req, res, (proxyError) => {
      if (proxyError) {
        handleProxyError(proxyError, req, res);
      } else {
        next();
      }
    });
  });

  // Proxy for Auth service
  app.use("/api/v1/auth", (req, res, next) => {
    const proxy = createProxyMiddleware({
      target: authTarget,
      changeOrigin: true,
      pathRewrite: { "^/api/v1/auth": "/auth" }, // Optionally remove the base path
    });

    // Handle errors for the proxy
    proxy(req, res, (proxyError) => {
      if (proxyError) {
        handleProxyError(proxyError, req, res);
      } else {
        next();
      }
    });
  });
};

export default setupProxy;
