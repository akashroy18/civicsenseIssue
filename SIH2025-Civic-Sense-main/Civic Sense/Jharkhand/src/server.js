import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import './config/cloudinary.js';
import app from './app.js';


(async () => {
await connectDB();
app.listen(env.port, () => console.log(`[server] Running on port ${env.port}`));
})();