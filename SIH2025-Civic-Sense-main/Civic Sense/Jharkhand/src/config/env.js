import dotenv from 'dotenv';
dotenv.config();


export const env = {
port: process.env.PORT || 8080,
nodeEnv: process.env.NODE_ENV || 'development',
clientUrl: process.env.CLIENT_URL || '*',
mongoUri: process.env.MONGODB_URI,
jwtSecret: process.env.JWT_SECRET,
jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
cloudinary: {
cloudName: process.env.CLOUDINARY_CLOUD_NAME,
apiKey: process.env.CLOUDINARY_API_KEY,
apiSecret: process.env.CLOUDINARY_API_SECRET,
secure: process.env.CLOUDINARY_SECURE === 'true',
},
};


if (!env.mongoUri || !env.jwtSecret || !env.cloudinary.cloudName) {
console.warn('[env] Missing some required environment variables.');
}