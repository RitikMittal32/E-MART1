import axios from "axios";

// const BASE_URL = "http://localhost:4080"; // Local development URL
const BASE_URL = "https://e-mart1.onrender.com"; // Production URL


// export const BACKEND_URL = "wss://localhost:4080"; // Local WebSocket URL
export const BACKEND_URL = "wss://e-mart1.onrender.com"; // Production WebSocket URL

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true; 

export default axios;
