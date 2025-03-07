import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import Notification from "../../components/notification";
import modlogo from "../../assets/images/web-logo.png";
import footerwave from "../../assets/images/footer-wave.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Loading from "../../components/loading";

const Login = () => {
  let navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "password") {
        Notification.showSuccessMessage("Welcome", "Logged in Successfully");

        const hardcodedUser = {
          id: 1,
          username: "admin",
          user_type: "admin",
          image: "default.jpg",
          token: { access: "dummy_access_token", refresh: "dummy_refresh_token" },
        };

        localStorage.setItem("user_id", hardcodedUser.id);
        localStorage.setItem("user_name", hardcodedUser.username);
        localStorage.setItem("user_type", hardcodedUser.user_type);
        localStorage.setItem("image", hardcodedUser.image);
        localStorage.setItem("token", hardcodedUser.token.access);
        localStorage.setItem("refresh_token", hardcodedUser.token.refresh);
        localStorage.setItem("userInfo", JSON.stringify(hardcodedUser));

        setUser(hardcodedUser);
        setUsername("");
        setPassword("");
        navigate("/");
      } else {
        setIsLoading(false);
        Notification.showErrorMessage("Login Failed", "Invalid credentials");
      }
    }, 1000); // Simulating network delay
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loading/></div>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-customGreen w-full">
      <form className="p-8 min-w-[440px] rounded-lg" 
        style={{ border: "1px solid #567763", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
        onSubmit={handleSubmit}
      >
        <div className="flex justify-center mb-1">
          <img src={modlogo} alt="Ministry of Defence" className="h-26" />
        </div>
        <div className="flex justify-center mb-1 text-white text-lg md:text-xl">
          Visitor Management System
        </div>
        <div className="flex justify-center mb-4 text-white text-lg md:text-xl">
          विज़िटर प्रबंधन प्रणाली
        </div>
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 rounded-lg bg-customFieldGreen text-white"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 rounded-lg bg-customFieldGreen text-white pr-10"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handleTogglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex text-white items-center text-sm leading-5"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </button>
        </div>
        <button type="submit" className="w-full text-white p-2 rounded-lg" style={{ backgroundColor: "rgb(15 70 37)" }}>
          Login
        </button>
      </form>
      <div className="absolute bottom-0 left-0 right-0">
        <img src={footerwave} alt="Wave" className="w-full" />
      </div>
    </div>
  );
};

export default Login;
