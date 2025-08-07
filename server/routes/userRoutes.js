import express from "express";
import {allUsers, testController} from "../controllers/authController.js";
import { protect, requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", allUsers);
// router.get("/", protect, allUsers);
router.get("/test", protect, testController);


export default router;
