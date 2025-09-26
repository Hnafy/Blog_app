import express from 'express';
import db from './db.js';
import user from './routes/user.js';
import post from './routes/post.js';
import comment from './routes/comment.js';
import category from './routes/category.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';

dotenv.config();
db();

const app = express();

app.set("trust proxy", 1);
// Middleware
app.use(cors({
  origin: [
    "https://hanfy-blog.netlify.app",
    "http://localhost:5173",
    "https://blog-app-gray-theta.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  credentials: true
}));


app.use(helmet());
app.use(hpp());

app.use(rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200
}));

app.use(express.json());

// Routes
app.use("/user", user);
app.use("/post", post);
app.use("/comment", comment);
app.use("/category", category);

// Static files
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// ❌ Vercel prevent app.listen
// app.listen(process.env.PORT || 3000, () => {
//   console.log(`http://localhost:${process.env.PORT || 3000}`);
// });

// ✅ Export app for Vercel
export default app;
