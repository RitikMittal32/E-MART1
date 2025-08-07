import express from 'express';
// import { getAllAdminMessages } from '../controllers/adminController.js';
import { protect} from '../middlewares/authMiddleware.js';
import { getMessagesByUserId } from '../controllers/messageController.js';
const router = express.Router();

// Route to get all admin messages
router.get('/:userId', protect, getMessagesByUserId);

export default router;
