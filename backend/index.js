import express, { json } from 'express'
import db from './db.js'
import user from './routes/user.js'
import post from './routes/post.js'
import comment from './routes/comment.js'
import category from './routes/category.js'
import dotenv from 'dotenv'
dotenv.config()
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { errorHandler , notFoundHandler } from './middleware/error.js'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import limit from 'express-rate-limit'

db()
const app = express()

// middleware
const allowedOrigins = [
  "https://hanfy-blog.netlify.app", // website
  "http://localhost:5173"           // localhost
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
); // connect with frontend
app.use(helmet()) // security headers
app.use(hpp()) // prevent pollution params
app.use(limit({
  windowMs: 10*60*1000, // 10 minutes
  max:200
})) // limit requests
app.use(express.json())
app.use("/user",user)
app.use("/post",post)
app.use("/comment",comment)
app.use("/category",category)
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(notFoundHandler)
app.use(errorHandler)

app.listen(process.env.PORT || 3000, () => {
  console.log(`http://localhost:${process.env.PORT || 3000}`);
});
