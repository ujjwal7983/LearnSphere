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
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/Educator/Dashboard'
import Courses from './pages/Educator/Courses'
import getCreatorCourse from './customHooks/getCreatorCourse'
import CreateCourses from './pages/Educator/CreateCourses'
import EditCourse from './pages/Educator/EditCourse'
import AllCourses from './pages/AllCourses'
import ViewCourse from './pages/ViewCourses'
import ViewLectures from './pages/ViewLectures'
import MyEnrolledCourses from './pages/MyEnrolledCourses'

export const serverUrl = "http://localhost:8000"
import {ToastContainer} from 'react-toastify'
import getPublishedCourse  from './customHooks/getPublishedCourse'
import CreateLecture from './pages/Educator/CreateLecture'
import EditLecture from './pages/Educator/EditLecture'
import ScrollToTop from './component/ScrollToTop'
function App() {
     getCurrentUser();
     getCreatorCourse();
     getPublishedCourse();
     const {userData} = useSelector(state => state.user);
  return (
    <>
    <ToastContainer />
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={!userData ?<Signup /> : <Navigate to={"/"}/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={userData ? <Profile /> : <Navigate to={"/signup"}/>} />
      <Route path="/forget" element={userData ? <ForgetPassword /> : <Navigate to={"/signup"}/>} />
      <Route path="/editprofile" element={userData ? <EditProfile /> : <Navigate to={"/signup"}/>} />
      <Route path="/allcourses" element={userData ? <AllCourses /> : <Navigate to={"/signup"}/>} />
      <Route path = '/dashboard' element={userData?.role === "educator" ? <Dashboard/> : <Navigate to={"/signup"}/>} />
      <Route path = '/courses' element={userData?.role === "educator" ? <Courses/> : <Navigate to={"/signup"}/>} />
      <Route path='/createcourses' element={userData?.role === "educator" ? <CreateCourses/> : <Navigate to={"/signup"}/>} />
      <Route path='/editcourse/:courseId' element={userData?.role === "educator" ? <EditCourse/> : <Navigate to={"/signup"}/>} />
      <Route path='/createlecture/:courseId' element={userData?.role === "educator" ? <CreateLecture/> : <Navigate to={"/signup"}/>} />
      <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === "educator" ? <EditLecture/> : <Navigate to={"/signup"}/>} />
      <Route path='/viewcourse/:courseId' element={userData?.role === "educator" ? <ViewCourse/> : <Navigate to={"/signup"}/>} />
      <Route path='/viewlecture/:courseId' element={userData ? <ViewLectures/> : <Navigate to={"/signup"}/>} />
      <Route path='/mycourses' element={userData ? <MyEnrolledCourses/> : <Navigate to={"/signup"}/>} />

    </Routes>
    </>
  )
}

export default App
