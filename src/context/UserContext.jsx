import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "../components/notification";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [islogin, setIslogin] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Hardcoded authentication logic for prototype
    const token = localStorage.getItem("token");

    if (token) {
      // Simulating a logged-in user
      setIsAuthenticated(true);
      setUser({ id: 1, name: "Prototype User", email: "user@example.com" });
      setUsername("PrototypeUser");
      setIslogin(true);
      setLoggedUser({ id: 1, name: "Prototype User" });
    } else {
      Notification.showErrorMessage("Warning", "No valid session. Redirecting...");
      localStorage.clear();
      navigate("/login");
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        username,
        setUsername,
        islogin,
        setIslogin,
        loggedUser,
        setLoggedUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
