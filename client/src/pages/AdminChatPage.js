// import { useEffect, useRef } from "react";
// import Chatbox from "../components/Chatbox";
// import { MyChats } from "../components/MyChats";
// import Layout from "../components/Layout/Layout";

// const AdminChatpage = () => {
//   const chatboxRef = useRef(null);

//   useEffect(() => {
//     if (chatboxRef.current) {
//       chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
//     }
//   }, []);

//   return (
//     <Layout title="Message">
//       <div className="container-fluid mb-4 lg:mt-[100px]">
//         <div className="flex flex-col sm:flex-row mt-12 w-full">
//           {/* First Box */}
//           <div className="w-full sm:w-1/3 sm:h-full h-1/2">
//             <MyChats />
//           </div>

//           {/* Second Box */}
//           <div
//             className="w-full sm:w-2/3 sm:h-full h-1/2 flex overflow-auto"

//           >
//             <Chatbox />
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AdminChatpage;
