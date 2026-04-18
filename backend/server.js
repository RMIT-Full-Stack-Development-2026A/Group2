const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./src/app");

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "tictactoang";
async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables.");
    }

    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB (${DB_NAME})`);

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
