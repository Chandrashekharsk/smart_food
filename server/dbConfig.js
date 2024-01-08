import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

// const connectDB = async()=>{
//   try {
//       const connectionInstance = await mongoose.connect(`${process.env.URI}/${DB_NAME}`);
//       console.log(`\nMongoDB connected ! DATABASE:${connectionInstance.connection.name} DB Host: ${connectionInstance.connection.host} `);
//   } catch (error) {
//       console.log('MONGO CONNECTON FAILED',error);
//       process.exit(1);
//   }
// }
// export default connectDB;

const connectDB = async()=>{
  try {
    console.log(`validation:${process.env.URI}/${process.env.DB_NAME}`)
    const connectionInstance = await mongoose.connect(`${process.env.URI}/${process.env.DB_NAME}`);
    console.log(`\nMongoDB CONNECTED! DB:${connectionInstance.connection.name} DB_HOST:${connectionInstance.connection.host}`)

  } catch (error) {
    console.log("MONGO CONNECTION FAILED",error)
    process.exit(1);
  }
}

export default connectDB;






