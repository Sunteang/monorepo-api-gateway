import app from "./app";
import config from "./config";
import { connectToDB } from "./database/connection";

function runSever() {
  connectToDB();
  app.listen(config.PORT, () => {
    console.log("============================================>");
    console.log("the product's server is running on port:", config.PORT);
    console.log("============================================>");
  });
}
runSever();
