// import express, { Request, Response } from "express";
// // import { createProxyMiddleware } from "http-proxy-middleware";
// import setupProxy from "./middlewares/proxyMiddleware";
// // ========================
// // Initialize App Express
// // ========================
// const app = express();

// // ========================
// // Global Middleware
// // ========================
// app.use(express.json()); // Help to get the json from request body

// // ========================
// // Set up the proxy middleware
// // ========================
// setupProxy(app);

// app.get("/v1/gateway", (_req: Request, res: Response) => {
//   res.status(200).json({
//     message: "OK",
//   });
// });

// // app.use(
// //   "/product",
// //   createProxyMiddleware({
// //     target: "http://localhost:4001/v2/product", // Microservice 1
// //     changeOrigin: true,
// //   })
// // );

// // app.use(
// //   "/auth",
// //   createProxyMiddleware({
// //     target: "http://localhost:4002/auth", // Microservice 2
// //     changeOrigin: true,
// //   })
// // );
// //=================
// // AUTH Middleware
// //=================

// // ========================
// // ERROR Handler
// // ========================

// export default app;

//V2
import express, { Request, Response } from "express";
import setupProxy from "./middlewares/proxyMiddleware";

// ========================
// Initialize App Express
// ========================
const app = express();

// ========================
// Global Middleware
// ========================
app.use(express.json()); // Parse incoming request bodies as JSON

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
