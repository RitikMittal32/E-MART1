import express from 'express';
import { submitReview, getProductReviews } from '../controllers/reviewController.js';
import { protect } from "../middlewares/authMiddleware.js";
import { deleteReview, updateReview } from '../controllers/reviewController.js';
const router = express.Router();

// Route to submit a new review
router.post('/', protect, submitReview);
router.get('/:productId', getProductReviews);
// Route to delete a review
router.delete('/delete-review/:reviewId', protect, deleteReview);
// Route to update a review
router.put('/update-review/:reviewId', protect, updateReview);

export default router;
