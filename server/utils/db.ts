import mongoose from "mongoose";

export const connectDB = async () => {
  const config = useRuntimeConfig();

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(config.mongodbUri);
};
