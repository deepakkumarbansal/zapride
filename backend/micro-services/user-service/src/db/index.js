import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectToDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`Connected to mongodb DB :: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`Unable to connect to mongodb DB :: ${error.message}`);
        process.exit(1);
    }
};
