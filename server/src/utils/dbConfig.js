import dotenv from 'dotenv';
dotenv.config(); // Ensure dotenv is configured at the very top
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Log out the URI to ensure it's loaded correctly
    console.log(`Connecting to MongoDB with URI: ${process.env.MONGODB_URI}`);

    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`\nMongoDB CONNECTED! DB:${connectionInstance.connection.name}`, `DB_HOST:${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGO CONNECTION FAILED", error);
    process.exit(1);
  }
};

export default connectDB;
