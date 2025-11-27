import axios from "axios";

// const BASE_URL = "http://localhost:4080"; 
const BASE_URL = "https://e-mart1.onrender.com"; 

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true; 

export default axios;
