import React, { useState, useEffect } from "react";
import axios from "../../config/axiosConfig.js";
import { ChatState } from "../../context/ChatProvider.js";
import { io } from 'socket.io-client';
import { useAuth } from "../../context/auth.js";
import { Box, Text, Button } from "@chakra-ui/react";

const ReviewComponent = ({ productId , product }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  // const [sockets, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [comment, setComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateReviewId, setUpdateReviewId] = useState(null);
  const {socket} = ChatState(); 
  const [user, setUser] = useAuth();

  // useEffect(() => {
  //   const newSocket = io("http://localhost:4300", {
  //     transports: ["websocket"], // Optional: to force WebSocket transport
  //   });
  //   setSocket(newSocket);

  //   newSocket.on('connected', () => {
  //     console.log('Connected to socket');
  //     newSocket.emit('setup', { _id: user.user._id });
  //   });
  // }, [productId]);

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

  const handleNewMessage = (e) => {
    e.preventDefault();
    const messageData = {
      productId,
      sender : {_id : user.user._id, name : user.user.name}, 
      isReview: true, // Specify if it's a review
      rating, // Send the rating value
      comment, // Send the comment value
    };

    // Emit the new review as a message
    socket.emit('new message', messageData);
    
    // Reset the input fields
    setRating(0);
    setComment('');
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
        data: { productId }, // Include the productId in the config object under `data`
      };
      await axios.delete(`/api/v1/review/delete-review/${reviewId}`, config);
      console.log(`Review with ID ${reviewId} deleted successfully.`);
      fetchReviews(productId); // Refresh the review list after deletion
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="flex sm:flex-row flex-col">
      {/* Review Form */}
      <div className="bg-white rounded-lg mb-8 sm:w-1/2 w-full">
        <div className="">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isUpdating ? "Update Your Review" : "Write a Review"}
          </h2>
          <form onSubmit={handleNewMessage} className="flex flex-col justify-center items-center">
            {/* Comment */}
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

            {/* Rating */}
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

  {/* Submit Button */}

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

      {/* Reviews List */}
{/* Reviews List */}
<div className="sm:w-1/2 w-full">
<Box width="100%">
  <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={4}>
    Customer Reviews
  </Text>

  {/* Scrollable Container */}
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
              {/* User Name and Date */}
              <Text fontSize="lg" color="gray.500">
                {review.user.name} - {new Date(review.createdAt).toLocaleDateString()}
              </Text>
              {/* Rating */}
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
          
              {/* <Button
                onClick={() => handleUpdateClick(review)}
                bg="green.500"
                color="white"
                px={4}
                py={2}
                mr={2}
                _hover={{ bg: "green.600" }}
              >
                Update
              </Button> */}
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
