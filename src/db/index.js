import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect
            (`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("MongoDB Connnected")
    } catch (err) {
        console.log("MongoDB ERROR : ", err);
        process.exit(1)
    }
}

export default connectDB