import app from "./app";
import config from "./config";

function runSever() {
  app.listen(config.PORT, () => {
    console.log("the auth's server is running on port:", config.PORT);
  });
}
runSever();
