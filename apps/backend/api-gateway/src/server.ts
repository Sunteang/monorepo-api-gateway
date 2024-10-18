import app from "./app";
import config from "./config";

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
