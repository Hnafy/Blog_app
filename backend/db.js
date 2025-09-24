import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBURI = process.env.MONGODB_URI;

const connection = () => {
  if (!DBURI) {
    console.error("❌ MONGODB_URI is not defined");
    return;
  }

  console.log("Mongo URI:", DBURI);

  mongoose
    .connect(DBURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("✅ Good Connection to MongoDB");
    })
    .catch((err) => {
      console.error("❌ Bad connection to MongoDB:", err.message);
    });
};

export default connection;
