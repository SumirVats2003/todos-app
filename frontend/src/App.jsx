import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterForm from "./Pages/RegisterForm";
import Home from "./Pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/register' element={<RegisterForm />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
