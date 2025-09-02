// import React, { useState, useEffect , useRef} from 'react';
// import axios from '../config/axiosConfig';
// import { io } from 'socket.io-client';
// import { useAuth } from '../context/auth';
// import { ChatState } from '../context/ChatProvider';


// const AdminChatWindow = ({ selectedChat}) => {
//   const [messageThreads, setMessageThreads] = useState([]);
//   const [input, setInput] = useState('');
//   const [available, setAvailable] = useState(false);
//   const [user, setUser] = useAuth();
//   const [selectedReviewId, setSelectedReviewId] = useState(null);
//   const [selectedMessage, setSelectedMessage] = useState(null); // New state for selected message for reply
//   const { socket } = ChatState();
  
//   const fetchMessages = async () => {
//     if (selectedChat && user && user.token) {
//       try {
//         setSelectedMessage(null);
//         setSelectedReviewId(null);
//         const config = {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         };

//         const { data } = await axios.get(`/api/v1/message/${selectedChat._id}`, config);

//         if (data && Array.isArray(data)) {
//           setMessageThreads(data);
//           setAvailable(true);
//         } else {
//           console.warn('No message threads found or data format is incorrect.');
//           setAvailable(false);
//         }
//       } catch (error) {
//         console.error('Error fetching message threads:', error);
//         setAvailable(false);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//     // console.log('connected..bro');

//     if (socket) {
//       const handleMessageReceived = (newMessageReceived) => {
//         setMessageThreads((prevThreads) => {
//           const updatedThreads = [...prevThreads];
//           const threadIndex = updatedThreads.findIndex(
//             (thread) => thread.review === newMessageReceived.reviewId
//           );

//           if (threadIndex !== -1) {
//             updatedThreads[threadIndex].messages.push({
//               product: newMessageReceived.product,
//               sender: { _id: newMessageReceived.sender._id, name: newMessageReceived.sender.name },
//               message: newMessageReceived.comment,
//               timestamp: new Date(),
//             });
//           } else {
//             updatedThreads.push({
//               product: newMessageReceived.product,
//               review: { _id: newMessageReceived.reviewId },
//               messages: [{
//                 sender: { _id: newMessageReceived.sender._id, name: newMessageReceived.sender.name },
//                 message: newMessageReceived.comment,
//                 timestamp: new Date(),
//               }],
//             });
//           }

//           return updatedThreads;
//         });
//       };

//       socket.on('message received', handleMessageReceived);
//       return () => {
//         socket.off('message received', handleMessageReceived);
//       };
//     }
//   }, [socket, selectedChat]);

//   const sendMessage = () => {
//     if (input.trim() && selectedReviewId) {
//       const messageData = {
//         adminId: user.user._id,
//         message: input,
//         reviewId: selectedReviewId,
//         userId: selectedChat._id,
//       };

//       socket.emit('admin message', messageData);
//       console.log('You sent the data to the server');

//       setMessageThreads((prevThreads) => {
//         const updatedThreads = [...prevThreads];
//         const threadIndex = updatedThreads.findIndex(
//           (thread) => thread.review === selectedReviewId
//         );

//         const newMessage = {
//           sender: { name: user.user.name, _id: user.user._id },
//           message: input,
//           timestamp: new Date(),
//         };

//         if (threadIndex !== -1) {
//           updatedThreads[threadIndex].messages.push(newMessage);
//         } else {
//           updatedThreads.push({
//             review: { _id: selectedReviewId },
//             messages: [newMessage],
//           });
//         }

//         return updatedThreads;
//       });

//       setInput('');
//       handleUntick();
//     }
//   };

//   const handleDoubleClick = (message, thread) => {
//     if (message.sender._id !== user.user._id) {
//       setSelectedMessage(message);
//       setSelectedReviewId(thread.review);
//     }
//   };

//   const handleTick = (message, thread) => {
//     if (message.sender._id !== user.user._id) {
//       setSelectedMessage(message);
//       setSelectedReviewId(thread.review);
//     }
//   };

//   const handleUntick = () => {
//     setSelectedMessage(null);
//     setSelectedReviewId(null);
//   };
//   const containerRef = useRef();

// useEffect(() => {
//   if (containerRef.current) {
//     containerRef.current.scrollTop = containerRef.current.scrollHeight;
//   }
// }, [messageThreads]);

//   if (!selectedChat) {
//     return (
//       <div className="flex-grow flex items-center justify-center text-xl text-gray-500">
//         Select a chat to start messaging, ok admin.
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col">
//       <h2 className="mb-4 text-3xl">Chat with {selectedChat.name}</h2>
//       <div
//   className="mb-4 p-4 bg-gray-50 border rounded-lg"
//   style={{
//     height: "100vh",
//     overflowY: "auto",
//     display: "flex",
//     flexDirection: "column",
//   }}
//   ref={containerRef} // Add a ref to scroll to the bottom
// >
//         {available ? (
//           messageThreads.length > 0 ? (
//             messageThreads.map((thread, index) => (
//               <div key={index} className="mb-4">
//                 {thread.product && (
//                   <div className="flex items-center mb-4">
//                     <img
//                       src={`https://e-mart-1.onrender.com/api/v1/product/product-photo/${thread.product.productId}`}
//                       alt={thread.product.name}
//                       className="w-16 h-16 rounded-full mr-4"
//                     />
//                     <strong className="text-lg">{thread.product.name}</strong>
//                     {/* <strong className="text-lg">{thread.product.productId}</strong> */}

//                   </div>
//                 )}
//                 {thread.messages && thread.messages.length > 0 ? (
//                   thread.messages.map((message, msgIndex) => (
//                     <div
//                       key={msgIndex}
//                       className={`mb-2 flex ${
//                         message.sender._id === user.user._id ? 'justify-end' : 'justify-start'
//                       }`}
//                       onDoubleClick={() => handleDoubleClick(message, thread)}
//                     >
//                       <div
//                         className={`p-2 rounded-lg ${
//                           message.sender._id === user.user._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
//                         }`}
//                       >
//                         <strong>{message.sender.name}:</strong> {message.message}

//                         {/* {message.sender._id !== user.user._id && (
//                           <div className="flex space-x-2 mt-2">
//                             <span
//                               onClick={() => handleTick(message, thread)}
//                               className="cursor-pointer text-green-500"
//                             >
//                               ✓
//                             </span>
//                             <span
//                               onClick={handleUntick}
//                               className="cursor-pointer text-red-500"
//                             >
//                               ✗
//                             </span>
//                           </div>
//                         )} */}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-gray-500">No messages for this review.</div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="text-gray-500">No messages found.</div>
//           )
//         ) : (
//           <div className="text-gray-500">No messages found.</div>
//         )}
//       </div>

//       {selectedMessage && (
//         <div className="p-2 border rounded-lg bg-gray-100 mt-4 justify-between flex">
//           <div>
//           <strong>Replying to:</strong> {selectedMessage.message}
//           </div>
//           <div className='justify-end'>
//           <span
//             onClick={handleUntick}
//             className="cursor-pointer text-red-500"
//           >
//             ✗
//           </span>
//           </div>
//         </div>
//       )}

//       <div className="flex space-x-2 z-10">
//         <textarea
//           rows="3"
//           className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Type your message here..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           disabled={!selectedReviewId}
//         />
//         <button
//           className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
//           onClick={sendMessage}
//           disabled={!selectedReviewId}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminChatWindow;
