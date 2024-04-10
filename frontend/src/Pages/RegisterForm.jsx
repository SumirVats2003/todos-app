import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3001/register", {
        username,
        password,
      });
      if (response.status === 200) {
        setIsSuccess(true);
      }
      onRegister();
      setUsername("");
      setPassword("");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className='container'>
      <span
        className='success'
        style={{
          display: isSuccess ? "block" : "none",
        }}
      >
        User Registered Successfully
      </span>
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
