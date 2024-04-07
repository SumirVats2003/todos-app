import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });
      alert(response.data.message);
      onLogin(response.data.userId);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className='login-form'>
      <h2>Existing User Login</h2>
      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        New User? <Link to='/register'>Register</Link>
      </p>
    </div>
  );
}

export default LoginForm;
