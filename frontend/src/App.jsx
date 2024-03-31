import React, { useState } from "react";
import "./App.css";
import LoginForm from "./LoginForm";
import MainApp from "./MainApp";

function App() {
  const [token, setToken] = useState("");

  const handleLogin = (token) => {
    setToken(token);
  };

  return (
    <div className='container'>
      <h1>ToDos List</h1>
      {!token ? <LoginForm onLogin={handleLogin} /> : <MainApp token={token} />}
    </div>
  );
}

export default App;
