import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import asyncHandler from "express-async-handler";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  // console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ){
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log("Extracted Token:", token);
    const decode = JWT.verify(
      token,
      process.env.JWT_SECRET
    );
    // console.log("Decoded Token:", decode);
    req.user = decode;
    next();
  } catch (error) {
    res.status(401);
    console.log(error);
    throw new Error(`Not authorized, ${error}`);
  }
}

};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = JWT.verify(token, process.env.JWT_SECRET);
      // console.log(decoded); 
      req.user = await userModel.findById(decoded._id).select("-password");
      // console.log("Authorization Header:", req.headers.authorization);
      // console.log("Decoded User:", req.user);

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
