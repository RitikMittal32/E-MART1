import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import http from 'http';
import MongoStore from "connect-mongo";
import cookieParser from 'cookie-parser';
import session from "express-session";


dotenv.config();

connectDB();


const app = express();


app.use(
  session({
    secret: process.env.SESSION_SECRET || "Key that will Sign cookie",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, 
      ttl: 14 * 24 * 60 * 60, 
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
    },
  })
);


app.use(cookieParser());
app.use(cors({
  origin: "https://e-mart-1.vercel.app", 
  credentials: true, 
}));
app.use(express.json());
app.use(morgan("dev"));

app.get('/protected-route', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  res.send({ message: "Access granted", token });
});

app.get('/profile', (req, res) => {
  const userCookie = req.cookies.user;
  if (!userCookie) {
    return res.status(401).send({ message: "User not logged in" });
  }
  const user = JSON.parse(userCookie); 
  res.send({ success: true, user });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/users", userRoutes);


const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white);
});