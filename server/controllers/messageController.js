import asyncHandler from 'express-async-handler';
import MessageThread from '../models/messageModel.js'; // Adjust the import path as necessary

// Controller to get message threads by user ID
export const getMessagesByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all message threads where the user is the sender of any message in the thread
    const messageThreads = await MessageThread.find({
      'messages.sender': userId,
    }).populate('messages.sender'); // Optionally populate sender details (like name)

    // Check if any message threads were found
    if (!messageThreads || messageThreads.length === 0) {
      return res.status(404).json({ message: 'No messages found for this user.' });
    }

    // Success response
    console.log("Message threads sent successfully");
    res.status(200).json(messageThreads);
    
  } catch (error) {
    // Error response
    console.error("Error fetching messages for user:", error);
    res.status(500).json({ message: 'An error occurred while fetching messages.' });
  }
});