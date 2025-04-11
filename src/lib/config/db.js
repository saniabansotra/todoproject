import mongoose from "mongoose";
import dotenv from 'dotenv';


dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_STRING);
        console.log("DB connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}