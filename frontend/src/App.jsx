import React, { useState } from "react";
import "./App.css";
import RegisterForm from "./Pages/RegisterForm";
import LoginForm from "./Pages/LoginForm";
import MainApp from "./Pages/MainApp";
import LogoutButton from "./Components/LogoutButton";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const handleLogin = (userId) => {
    localStorage.setItem("userId", userId);
    setUserId(userId);
  };

  return (
    <div className='container'>
      {userId == null ? (
        <div>
          <h2>Login/Register Forms</h2>
          <RegisterForm />
          <LoginForm onLogin={handleLogin} />
        </div>
      ) : (
        <>
          <header>
            <span>ToDos List</span>
            <LogoutButton />
          </header>
          <MainApp />
        </>
      )}
    </div>
  );
}

export default App;
