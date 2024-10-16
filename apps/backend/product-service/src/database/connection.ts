import config from "@/config";
import mongoose from "mongoose";

export async function connectToDB() {
  try {
    await mongoose.connect(`${config.MONGO_URL}`);
    console.log("Success Connect to DB");
  } catch (error) {
    console.error("DB Connection error:", error);
    process.exit(1);
  }
}
