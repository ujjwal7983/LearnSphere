import { useState } from 'react'
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/SignUp'
import Login from './pages/Login'
import  getCurrentUser  from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import ForgetPassword from './pages/ForgetPassword'


export const serverUrl = "http://localhost:8000"
import {ToastContainer} from 'react-toastify'
function App() {
     getCurrentUser();
     const {userData} = useSelector(state => state.user);
  return (
    <>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={!userData ?<Signup /> : <Navigate to={"/"}/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={userData ? <Profile /> : <Navigate to={"/signup"}/>} />
      <Route path="/forget" element={userData ? <ForgetPassword /> : <Navigate to={"/signup"}/>} />
    </Routes>
    </>
  )
}

export default App
