import React from "react";
import { useState } from "react";

function LogoutButton() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const handleLogout = async () => {
    try {
      localStorage.removeItem("userId");
      setUserId(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
    location.reload();
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
