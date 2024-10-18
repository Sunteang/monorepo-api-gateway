
import mongoose from "mongoose";

const connectToMongoDB = async () => {
  const url =
    process.env.MONGODB_URL ||
    "mongodb+srv://sereysunteang:p4ssw0rd@cluster0.drkax.mongodb.net/ProductCatalog?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true";

  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000, // Adjust as needed
    });
    console.log("MongoDB is connected successfully.");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

export default connectToMongoDB;
