import app from "./app";
import connectToMongoDB from "./database/connection";
import configs from "./config";

async function run() {
  try {
    await connectToMongoDB();
    app.listen(configs.port, () => {
      console.log("===============================>");
      console.log(`auth's server running port: ${configs.port}`);
      console.log("===============================>");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
