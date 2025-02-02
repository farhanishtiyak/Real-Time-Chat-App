import mongoose from "mongoose";

export default async function connectToMongoDb() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}