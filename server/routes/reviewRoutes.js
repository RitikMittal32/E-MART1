import express from 'express';
import { submitReview, getProductReviews } from '../controllers/reviewController.js';
import { protect } from "../middlewares/authMiddleware.js";
import { deleteReview, updateReview } from '../controllers/reviewController.js';
const router = express.Router();

router.post('/', protect, submitReview);
router.get('/:productId', getProductReviews);
router.delete('/delete-review/:reviewId', protect, deleteReview);
router.put('/update-review/:reviewId', protect, updateReview);

export default router;
