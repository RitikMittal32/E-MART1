import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

// export const allUsers = asyncHandler(async (req, res) => {
//   const keyword = req.query.search
//     ? {
//         $or: [
//           { name: { $regex: req.query.search, $options: "i" } },
//           { email: { $regex: req.query.search, $options: "i" } },
//         ],
//       }
//     : {};

//   // Ensure req.user is available
//   if (!req.user) {
//     return res.status(401).json({ message: "Not authorized, no user information" });
//   }

//   // Find users based on keyword and exclude the current user
//   const users = await userModel.find({
//     ...keyword,
//     _id: { $ne: req.user._id }
//   });

//   res.status(200).json(users);  // Send response with status code
// });

export const allUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password"); // Exclude password
    // res.json(users);
    res.status(200).json({
      success: true, 
      message: "User details uploaded", 
      data : users
    })
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};




export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

// token-cookie
export const protectedRoute = (req, res) => {
  // Get the token from cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token found" });
  }

  try {
    // Verify the token
    const decoded = JWT.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    if(decoded){
      res.status(200).json({ message: "Access granted", token: token });
    }

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// profile-cookie
export const getProfile = async (req, res) => {
  // Get the user cookie
  const userCookie = req.cookies.user;

  if (!userCookie) {
    return res.status(401).json({ message: "User not logged in" });
  }

  try {
    const user = JSON.parse(userCookie); // Deserialize user data

    // Optional: Fetch additional user info from the database (if needed)
    // const userInfo = await User.findById(user.id); 

    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// delete-cookie
export const logOut = (req, res) => {
  // Clear the cookies from the server side by setting their expiration to a past date
  res.clearCookie("user", { httpOnly: true, secure: true, path: "/" });
  res.clearCookie("token", { httpOnly: true, secure: true, path: "/" });

  // Optionally, send a response to the client
  res.status(200).json({
    message: "Logged out successfully",
  });
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const userInfo = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      phone: user.phone
    };

    res.cookie("user", JSON.stringify(userInfo), {
      httpOnly: true, // Consider changing this to true if this cookie doesn't need to be accessed by client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Ensure HTTPS in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? 'None' : 'Lax', // Use 'None' for cross-origin in production, 'Lax' for development
      path: "/", // Ensure cookie is accessible across the entire app
    });
    
    res.cookie("token", token, {
      httpOnly: true, // Should be true to prevent client-side JS access
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? 'None' : 'Lax', // Use 'None' for cross-origin in production
      path: "/", // Ensure cookie is accessible across the entire app
    });
    
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    if (password && password.length < 6) {
      return res.json({ error: "Password must be at least 6 characters long." });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    const updatedUserInfo = {
      _id: updatedUser._id,
      name: name,
      email: email,
      role: updatedUser.role,
      address: address,
      phone: phone
    };

    // Create a new token (if needed)
    const token = JWT.sign({ _id: updatedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set the secure cookie with the updated user and token
    res.cookie('user', JSON.stringify(updatedUserInfo), {
      httpOnly: true,    // Cookie cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS only)
      maxAge: 7 * 24 * 60 * 60 * 1000,  // Expire in 7 days
      sameSite: process.env.NODE_ENV === "production" ? 'None' : 'Lax',  // Prevent sending the cookie with cross-origin requests
      path: '/',           // Set cookie accessible for the entire domain
    });

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};
