// import React, { useState, useEffect, useRef} from 'react';
// import axios from '../config/axiosConfig';
// import { ChatState } from '../context/ChatProvider';
// import { useAuth } from '../context/auth';

// const ChatWindow = () => {
//   const [messageThreads, setMessageThreads] = useState([]);
//   const [input, setInput] = useState('');
//   const [available, setAvailable] = useState(false);
//   const { socket } = ChatState();
//   const [user, setUser] = useAuth();

//   const fetchMessages = async () => {
//     try {
//       if (user && user.token) {
    
      
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       const { data } = await axios.get(`/api/v1/message/${user.user._id}`, config);

//       if (data && Array.isArray(data)) {
//         setMessageThreads(data);
//         setAvailable(true);
//       } else {
//         console.warn("No message threads found or data format is incorrect.");
//         setAvailable(false);
//       }
//     }
//     } catch (error) {
//       console.error("Error fetching message threads:", error);
//       setAvailable(false);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();

//     if (socket) {
//       const handleAdminResponse = (adminMessageData) => {
//         const { message, adminId, reviewId } = adminMessageData;
//         // console.log("ab toh aaya na bhidu");
//         setMessageThreads((prevThreads) => {
//           const updatedThreads = [...prevThreads];
//           const threadIndex = updatedThreads.findIndex(thread => thread.review === reviewId);

//           if (threadIndex !== -1) {
//             updatedThreads[threadIndex].messages.push({
//               sender: { name: "Ritik", _id: adminId },
//               message,
//               timestamp: new Date(),
//             });
//             return updatedThreads;
//           }

//           console.warn("No matching thread found for reviewId: ", reviewId);
//           return prevThreads;
//         });
//       };

//       socket.on('admin response', handleAdminResponse);

//       return () => {
//         socket.off('admin response', handleAdminResponse);
//       };
//     }
//   }, [socket]);

//   const sendMessage = () => {
//     if (input.trim()) {
//       const messageData = {
//         userId: user.user._id,
//         message: input,
//         reviewId: messageThreads[0]?.review._id,
//         isReview: false,
//       };
  
//       socket.emit('new message', messageData);
  
//       setMessageThreads((prevThreads) => {
//         const updatedThreads = [...prevThreads];
//         const newMessage = {
//           sender: { name: user.user.name, _id: user.user._id },
//           message: input,
//           timestamp: new Date(),
//         };
  
//         const threadIndex = updatedThreads.findIndex(thread => thread.review._id === messageData.reviewId);
        
//         if (threadIndex !== -1) {
//           updatedThreads[threadIndex].messages.push(newMessage);
//         } else {
//           console.warn("No matching thread found for reviewId: ", messageData.reviewId);
//         }
  
//         return updatedThreads;
//       });
  
//       setInput('');
//     }
//   };

//   const containerRef = useRef();
//   useEffect(() => {
//     if (containerRef.current) {
//       containerRef.current.scrollTop = containerRef.current.scrollHeight;
//     }
//   }, []);
  
//   return (
//     <div className="flex flex-col">
//       <div className="flex-grow  mb-4 p-4 bg-gray-50 border rounded-lg"
//         style={{
//           height: "100vh",
//           overflowY: "auto",
//           display: "flex",
//           flexDirection: "column",
//         }}
//        ref={containerRef} 
//       >
//         {available ? (
//           messageThreads.length > 0 ? (
//             messageThreads.map((thread, index) => (
//               <div key={index} className={`mb-4'
//               `}>
//                 {thread.product && (
//                   <div className="flex items-center mb-4 justify-end">
//                     <strong className="text-lg mr-4">{thread.product.name}</strong>
//                     <img
//                       src={`https://e-mart-1.onrender.com/api/v1/product/product-photo/${thread.product.productId}`}
//                       alt={thread.product.name}
//                       className="w-16 h-16 rounded-full"
//                     />
//                   </div>
//                 )}
//                 {thread.messages && thread.messages.length > 0 ? (
//                   thread.messages.map((message, msgIndex) => (
//                     <div
//                       key={msgIndex}
//                       className={`mb-2 flex ${
//                         message.sender._id === user.user._id ? 'justify-end' : 'justify-start'
//                       }`}
//                     >
//                       <div
//                         className={`p-2 rounded-lg ${
//                           message.sender._id === user.user._id
//                             ? 'bg-blue-500 text-white'
//                             : 'bg-gray-200 text-black'
//                         }`}
//                       >
//                         <strong>{message.sender.name}:</strong> {message.message}
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

//       {/* <div className="flex space-x-2">
//         <textarea
//           rows="3"
//           className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Type your message here..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//         />
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//           onClick={sendMessage}
//         >
//           Send
//         </button>
//       </div> */}
//     </div>
//   );
// };

// export default ChatWindow;
