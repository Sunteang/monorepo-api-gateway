import app from "./app";
import config from "./config";

async function runSever() {
  try {
    app.listen(config.PORT, () => {
      console.log("the auth's server is running on port:", config.PORT);
    });
  } catch (error) {
    console.error("Failed to start the application:", error);

    process.exit(1);
  }
}
runSever();
