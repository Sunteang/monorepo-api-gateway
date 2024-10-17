import config from "@/config";
import mongoose from "mongoose";

export async function connectToDB() {
  try {
    await mongoose.connect(`${config.MONGO_URL}`);

    console.log("-------------------->");
    console.log("Success Connect to DB");
    console.log("-------------------->");
  } catch (error) {
    console.log("----------------------------->");
    console.error("DB Connection error:", error);
    console.log("----------------------------->");
    process.exit(1);
  }
}
