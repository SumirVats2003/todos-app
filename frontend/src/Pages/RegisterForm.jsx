import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3001/register", {
        username,
        password,
      });
      alert(response.data.message);
      onRegister();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className='container'>
      <div className='register-form'>
        <h2>New User Registeration</h2>
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
        <button onClick={handleRegister}>Register</button>
        <p>
          Existing User? <Link to='/'>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
