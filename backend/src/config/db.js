const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbName = process.env.DB_NAME || "tictactoang";
    await mongoose.connect(process.env.MONGO_URI, { dbName });
    console.log(`MongoDB connected (${dbName})`);
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };