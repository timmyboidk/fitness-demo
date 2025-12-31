import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://zaiyangyu369_db_user:gqAhs5wQpRT1sRIu@cluster0.zh6ahqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// 缓存连接防止冷启动
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase;