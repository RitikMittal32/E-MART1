import Review from "../models/reviewModal.js";
import AdminMessage from "../models/adminModel.js";
import productModel from "../models/productModel.js";
import MessageThread from "../models/messageModel.js";
// Submit a new review
export const submitReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  if (!productId || !rating || !comment) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const review = new Review({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    const savedReview = await review.save();

    // Add review to product
    product.reviews.push(savedReview._id);
    await product.save();

    // Create an admin message
    const adminMessage = new AdminMessage({
      user: req.user._id,
      product: productId,
      review: savedReview._id,
      issue: comment, // Assuming comment can contain issues
    });

    await adminMessage.save();

    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};


export const getProductReviews = async (req, res) => {
          try {
            const reviews = await Review.find({ product: req.params.productId })
              .populate('user', 'name') // Populate user name
              .sort({ createdAt: -1 }); // Latest first
        
            res.json(reviews);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error.' });
          }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Please provide the productId.' });
  }

  try {
    // Find the review by reviewId from the URL parameter
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    // Check if the user is the owner of the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this review.' });
    }

    // Remove the review from the product
    const product = await productModel.findById(productId);
    if (product) {
      product.reviews = product.reviews.filter((r) => r.toString() !== reviewId);
      await product.save();
    }

    // Delete the review
    await review.remove();

    const deletedThread = await MessageThread.findOneAndDelete({ review: reviewId });

    if (!deletedThread) {
      return res.status(404).json({ message: 'Message thread not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Please provide rating and comment.' });
  }

  try {
    // Find the review by reviewId from the URL parameter
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    // Check if the user is the owner of the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this review.' });
    }

    // Update the review fields
    review.rating = rating;
    review.comment = comment;

    const updatedReview = await review.save();

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

