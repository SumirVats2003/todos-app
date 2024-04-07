import React, { useState } from "react";
import LoginForm from "../Pages/LoginForm";
import "../App.css";

function Home() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const handleLogin = (userId) => {
    localStorage.setItem("userId", userId);
    setUserId(userId);
  };

  return (
    <div className='container'>
      {userId == null ? (
        <div>
          <LoginForm onLogin={handleLogin} />
        </div>
      ) : (
        <MainApp />
      )}
    </div>
  );
}

export default Home;
