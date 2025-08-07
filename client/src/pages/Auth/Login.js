import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "../../config/axiosConfig";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });

      if (res && res.data.success) {
        toast.success(res.data && res.data.message);

        // Fetch token and user info
        const tokenResponse = await axios.get("/api/v1/auth/protected-route", { withCredentials: true });
        const token = tokenResponse.data.token; // Assuming the token is returned in the response
        const profileResponse = await axios.get("/api/v1/auth/profile", { withCredentials: true });
        const user = profileResponse.data.user; // Assuming the user info is returned in the response
        if (token && user) {
          setAuth({
            token: token,
            user: user,
          });
          console.log(token);
          console.log(user);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          toast.success("User data fetched successfully!");
          navigate(location.state || "/"); // Navigate to the previous page or home
        }

      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Login - Ecommer App">
      <div className="Forms" style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h4 className="title">LOGIN FORM</h4>

            <div className="mb-3 login-box">
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                id="exampleInputEmail1"
                placeholder="Enter Your Email "
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Enter Your Password"
                required
              />
            </div>
            <div className="mb-3">
              <button
                type="button"
                className="btn forgot-btn"
                onClick={() => {
                  navigate("/forgot-password");
                }}
              >
                Forgot Password
              </button>
            </div>

            <button type="submit" className="btn btn-primary">
              LOGIN
            </button>
          </form>
        </div>

        <div className="login-p" style={{ width: "40%" }}>
          <img src="login.svg" alt="login" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
