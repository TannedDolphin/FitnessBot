import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI is not configured. Starting without MongoDB.");
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    return true;
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`);
    console.warn("Starting server anyway because AI routes do not require MongoDB.");
    return false;
  }
};
