import { useState, useContext, createContext, useEffect } from "react";
import axios from "../config/axiosConfig";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  useEffect(() => {
    const getAuthData = async () => {
      try {
        const tokenResponse = await axios.get("/protected-route");
        const token = tokenResponse.data.token;

        const profileResponse = await axios.get("/profile");
        const user = profileResponse.data.user;

        if (token && user) {
          setAuth({ token, user });
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Authentication failed", error);
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

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
