import { useState } from 'react'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/SignUp'
import Login from './pages/Login'

export const serverUrl = "http://localhost:8000"
import {ToastContainer} from 'react-toastify'
function App() {

  return (
    <>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </>
  )
}

export default App
