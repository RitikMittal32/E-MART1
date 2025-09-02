import axios from "axios";

// Update the base URL as needed for your environment
// const BASE_URL = "http://localhost:4080"; // Local development URL
 const BASE_URL = "https://e-mart1.onrender.com"; // Production URL

// WebSocket backend URL
// export const BACKEND_URL = "wss://localhost:4080"; // Local WebSocket URL
  export const BACKEND_URL = "wss://e-mart1.onrender.com"; // Production WebSocket URL

// // Set global defaults for Axios
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true; 

export default axios;
