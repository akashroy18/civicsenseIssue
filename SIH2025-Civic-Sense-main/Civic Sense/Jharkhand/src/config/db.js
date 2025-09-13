import mongoose from 'mongoose';
import { env } from './env.js';


export async function connectDB() {
try {
mongoose.set('strictQuery', true);
await mongoose.connect(env.mongoUri, {
serverSelectionTimeoutMS: 15000,
});
console.log('[db] Connected to MongoDB');
} catch (err) {
console.error('[db] Mongo connection error:', err.message);
process.exit(1);
}
}