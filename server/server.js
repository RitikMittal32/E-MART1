import express from "express";
import colors from "colors";
import fs from 'fs';
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import path from "path";
import { Server } from 'socket.io';
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import Review from "./models/reviewModal.js";
import MessageThread from "./models/messageModel.js";
import productModel from "./models/productModel.js";
import http from 'http';
import messageRoutes from "./routes/messageRoutes.js";
import userModel from "./models/userModel.js";
import MongoStore from "connect-mongo";
import cookieParser from 'cookie-parser';
import session from "express-session";
// Define __filename and __dirnam
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure env
dotenv.config();

// Database config
connectDB();


const app = express();


app.use(
  session({
    secret: process.env.SESSION_SECRET || "Key that will Sign cookie",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, // MongoDB connection string
      ttl: 14 * 24 * 60 * 60, // 14 days expiration in seconds
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
      httpOnly: true, // Secure against XSS attacks
      secure: process.env.NODE_ENV === "production", // HTTPS in production
    },
  })
);

// Midlewares
app.use(cookieParser());
app.use(cors({
  origin: "https://e-mart-1.vercel.app", // Must match exactly
  credentials: true, // Allow cookies/session
}));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get('/protected-route', (req, res) => {
  const token = req.cookies.token; // Retrieve the token from cookies
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
  const user = JSON.parse(userCookie); // Deserialize user data
  res.send({ success: true, user });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/message", messageRoutes)
// Rest API

// app.use(express.static(path.join(__dirname, './client/build')));

// // Render Client for any path
// app.get("*", (req,res) => 
//   res.sendFile(path.join(__dirname,"./client/build/index.html"))
// );
app.get("/", (req, res) => {
  req.session.isAuth = true;
  res.send("<h1>Welcome to ecommerce app</h1>");
});


// PORT
const PORT = process.env.PORT || 3000;

// console.log(__dirname, " ", __filename); 

const server = http.createServer(app);
// const io = new Server(server);



const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://e-mart-1.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO eventsa
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // User setup
  socket.on("setup", (_id) => {
    if (_id) {
      socket.join(_id); // Join the room with the user's ID
      socket.emit("connected"); // Acknowledge connection
      // console.log(`User with ID ${_id} joined their room`);
    } else {
      console.error("User ID is undefined, cannot join room.");
    }
  });
  socket.on("admin setup", async () => {
    try {
      // Fetch all users who have sent messages (or any other condition you need)
      const allUsers = await userModel.find().distinct('_id');
      
      allUsers.forEach(userId => {
        socket.join(userId);
        // console.log(`Admin joined room of user ${userId}`);
      });
      
    //  console.log(`Admin joined room`);
      socket.emit("admin joined all user rooms");
    } catch (error) {
      console.error("Error joining user rooms for admin:", error);
    }
  });

  // User joins chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  // Typing events for both users and admins
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });
  
  socket.on("dummy message", async (data) =>{
    // console.log('Received from client:', data);
    let {reviewId, num, userId} = data; 
    num = num + 1;
    // console.log(`Message send to this user: ${userId}`);
    io.to(userId).emit("dummy response", { userId, reviewId, num });
  })
  // New message event
  socket.on("new message", async (newMessageReceived) => {
    try {
      // Save review if it’s a review message

      if (newMessageReceived.isReview) {
        const {productId , sender, isReview, rating , comment} = newMessageReceived;
        if (!productId) {
          throw new Error("Product ID is undefined or missing");
        }
        const reviewData = {
          product: productId,
          user: sender,
          rating: rating,
          comment: comment,
        };
        
        // Find the product by their id
        const product = await productModel.findById(productId).populate('name');

        // Create the review
        const review = await Review.create(reviewData);
        // Create a new message thread for the review
 
        const messageThread = await MessageThread.create({
          review: review._id, // Reference to the review
          product: {
            productId : productId,
            name : product.name,
          },
          messages: [{
            sender: sender, // The user who sent the message
            message: comment, // The content of the message
            timestamp: new Date(), // Optionally set the timestamp
          }],
        });

        // Update the review with the message thread ID
        review.messageThread = messageThread._id;
        await review.save();

            
        console.log("Message sent successfully");
        if(review){
          const reviewId = review._id; 
          io.emit("message received", {
            product, 
            sender, 
            rating, 
            comment,
            reviewId
          });
        }
      
      } else {
        // If not a review message, add to the existing thread
        console.log("before the tabahi");
        const existingMessageThread = await MessageThread.findOne({ review: newMessageReceived.reviewId });
        if (existingMessageThread) {
          existingMessageThread.messages.push({
            sender: newMessageReceived.sender._id,
            message: newMessageReceived.comment,
            timestamp: new Date(),
          });
          await existingMessageThread.save();
          console.log("after the tabahi"); 
          // Emit the message to the admin and users
          socket.to(newMessageReceived.sender._id).emit("message received", newMessageReceived);
          // socket.broadcast.emit("admin new message", newMessageReceived);
          // const adminId = "6595132ddd5e54715069ab59"
          // socket.to(adminId).emit("message received", newMessageReceived);
        }
      }
    } catch (error) {
      console.error("Error handling new message:", error);
    }
  });

  socket.on("admin message", async (adminMessageData) => {
    const { adminId, message, reviewId , userId} = adminMessageData;
    
    try {
      // Find the review by ID and get the user details
      const review = await Review.findById(reviewId).populate('user');

      if (review) {
        // Update the existing message thread with the admin's response
        const messageThread = await MessageThread.findOne({ review: reviewId });
        
        if (messageThread) {
          // Add the admin's message to the thread
          messageThread.messages.push({
            sender: adminId, // Admin ID
            message: message, // Admin message
            timestamp: new Date(), // Current timestamp
          });
          await messageThread.save();
          
          // Log to verify admin message thread updated successfully
          // console.log("Admin message added to thread:", messageThread);
        }
  
        // Notify the specific user who made the review
          // console.log(`Sending admin response to user ${userId}`);
          
          socket.to(userId).emit("admin response", {
            message,
            adminId,
            reviewId,
          });
  
          // console.log("Admin response sent successfully to user.");
       
      }
    } catch (error) {
      console.error("Error handling admin message:", error);
    }
  });
  

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});

server.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white);
});