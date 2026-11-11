import mongoose from "mongoose";
import {env} from "../config/env";

export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(env.db.url);
        console.log('DB connected successfully');
    } catch (error) {
        console.log('fail to connect to DB', error);
    }
}
