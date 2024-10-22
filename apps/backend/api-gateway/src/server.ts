import app from "./app";
import config from "./config";
import createLogger from "./utils/logger";

export const gatewayLogger = createLogger({
  service: "api-gateway",
  level: "info",
  logGroupName: config.AWS_CLOUDWATCH_LOGS_GROUP_NAME,
});

async function runServer() {
  try {
    app.listen(config.PORT, () => {
      console.log("=========================================>");
      console.log(`API Gateway is running on port: ${config.PORT}`);
      console.log("=========================================>");
    });
  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1);
  }
}

runServer();
