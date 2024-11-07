import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";

const connectDB = async()=>{
  try {
    const connectionInstance = await mongoose.connect(`${process.env.URI}`);
    console.log(`\nMongoDB CONNECTED! DB:${connectionInstance.connection.name}`, `DB_HOST:${connectionInstance.connection.host}`)

  } catch (error) {
    console.log("MONGO CONNECTION FAILED",error)
    process.exit(1);
  }
}

export default connectDB;






