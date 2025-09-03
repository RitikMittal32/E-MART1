import React, { useState, useEffect } from "react";
import axios from "../../config/axiosConfig.js";
import { useAuth } from "../../context/auth.js";
import { Box, Text, Button } from "@chakra-ui/react";
import toast from "react-hot-toast";

const ReviewComponent = ({ productId , product }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [comment, setComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateReviewId, setUpdateReviewId] = useState(null);
  const [user, setUser] = useAuth();

  useEffect(() => {
    if(productId){
      fetchReviews(productId);
    }
  }, [productId]);

  const fetchReviews = async (pid) => {
    try {
      const response = await axios.get(`/api/v1/review/${pid}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

 const handleNewMessage = async (e) => {
  e.preventDefault();
  try {
    const messageData = {
      productId,
      rating,
      comment,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.post("/api/v1/review", messageData, config);

    setRating(0);
    setComment("");
    toast.success("Review Send Successfully");
    fetchReviews(productId);
  } catch (error) {
    console.error("Error submitting review:", error);
  }
};


  const handleUpdateClick = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setUpdateReviewId(review._id);
    setIsUpdating(true);
  };

  const deleteReview = async (reviewId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        data: { productId },
      };
      await axios.delete(`/api/v1/review/delete-review/${reviewId}`, config);
       toast.success("Review Delete Successfully");
      fetchReviews(productId);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="flex sm:flex-row flex-col">
      <div className="bg-white rounded-lg mb-8 sm:w-1/2 w-full">
        <div className="">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isUpdating ? "Update Your Review" : "Write a Review"}
          </h2>
          <form onSubmit={handleNewMessage} className="flex flex-col justify-center items-center">
            <div className="flex w-full justify-between">
            <div className="w-[75%]">
              <label className="block mb-2 text-sm font-medium text-gray-700">Comment:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                rows="4"
                placeholder="Write your review here..."
              ></textarea>
            </div>

        <div className=" max-w-sm mx-auto p-4 bg-white rounded-xl ">
  <div className="mb-4">
    <label className="block mb-2 text-sm font-medium text-gray-700">
      Rating
    </label>
    <select
      value={rating}
      onChange={(e) => setRating(e.target.value)}
      required
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">Select rating</option>
      {[5, 4, 3, 2, 1].map((num) => (
        <option key={num} value={num}>
          {num} Stars
        </option>
      ))}
    </select>
  </div>
</div>
</div>
  <button
    type="submit"
    className=" bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
  >
    {isUpdating ? "Update Review" : "Submit Review"}
  </button>
          </form>
        </div>
      </div>

<div className="sm:w-1/2 w-full">
<Box width="100%">
  <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={4}>
    Customer Reviews
  </Text>

  <Box 
    bg="gray.100" 
    p={4} 
    rounded="lg" 
    overflowY="auto" 
    height="300px"
  >
    {reviews.length > 0 ? (
      reviews.map((review) => (
        <Box key={review._id} bg="white" shadow="lg" rounded="lg" p={6} mb={2}>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Text fontSize="lg" color="gray.500">
                {review.user.name} - {new Date(review.createdAt).toLocaleDateString()}
              </Text>
              <Text color="yellow.500">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <div>
            <Text mt={2} color="gray.700">
              {review.comment}
            </Text>
            </div>
            <div>
              <Button
                onClick={() => deleteReview(review._id)}
                bg="red.500"
                color="white"
                px={4}
                py={2}
                _hover={{ bg: "red.600" }}
              >
                Delete
              </Button>
              </div>
              </Box>
          </Box>
        </Box>
      ))
    ) : (
      <Text color="gray.600">No reviews yet. Be the first to review!</Text>
    )}
  </Box>
</Box>
</div>
    </div>
  );
};

export default ReviewComponent;
