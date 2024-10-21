//V2
import { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const setupProxy = (app: Express) => {
  // Use environment variables or default to localhost
  const productTarget =
    process.env.PRODUCT_SERVICE_URL || "http://localhost:4001";
  const authTarget = process.env.AUTH_SERVICE_URL || "http://localhost:4002";

  // Middleware to log requests for debugging purposes
  const requestLogger = (req: any, _res: any, next: Function) => {
    console.log(`[Proxy Log] Request URL: ${req.originalUrl}`);
    next();
  };

  // Proxy for Product service
  app.use(
    "/api/v1/product",
    requestLogger, // Add logging middleware before the proxy
    createProxyMiddleware({
      target: productTarget,
      changeOrigin: true,
      pathRewrite: { "^/api/v1/product": "/v2/product" }, // Ensure to rewrite to /v2/product
    })
  );

  // Proxy for Auth service
  app.use(
    "/api/v1/auth",
    requestLogger, // Add logging middleware before the proxy
    createProxyMiddleware({
      target: authTarget,
      changeOrigin: true,
      pathRewrite: { "^/api/v1/auth": "/auth" }, // Ensure to rewrite to /auth
    })
  );
};

export default setupProxy;
