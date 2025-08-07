import { useState, useContext, createContext ,useEffect} from "react";
import axios from "../config/axiosConfig"; // Make sure this file is correctly configured

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // UseEffect to get auth data from the backend
  useEffect(() => {
    const getAuthData = async () => {
      try {
        // Fetch token from /protected-route
        const tokenResponse = await axios.get("/protected-route");
        const token = tokenResponse.data.token; // Assuming token is returned

        // Fetch user info from /profile route
        const profileResponse = await axios.get("/profile");
        const user = profileResponse.data.user; // Assuming user info is returned

        if (token && user) {
          // Set token and user in the state
          setAuth({
            token: token,
            user: user,
          });

          // Set default axios header for future requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Authentication failed", error);
        // Redirect to login or handle error if not authenticated
      }
    };

    getAuthData();
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
