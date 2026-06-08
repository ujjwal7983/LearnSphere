import express from "express"
import isAuth from "../middleware/isAuth.js"
import { createCourse, editCourse, getCourseById, getCreatorCourses, getPublishedCourses, removeCourse } from "../controller/courseController.js"
import upload from "../middleware/multer.js"

let courseRouter = express.Router()

courseRouter.post("/create",isAuth,createCourse)
courseRouter.get("/getpublished",getPublishedCourses)
courseRouter.get("/getcreator",isAuth,getCreatorCourses)
courseRouter.post("/editcourse/:courseId",isAuth,upload.single("thumbnail"),editCourse)
courseRouter.get("/getcourse/:courseId",isAuth,getCourseById)
courseRouter.delete("/removecourse/:courseId",isAuth,removeCourse)
// courseRouter.post("/createlecture/:courseId",isAuth,createLecture)
// courseRouter.get("/getcourselecture/:courseId",isAuth,getCourseLecture)
// courseRouter.post("/editlecture/:lectureId",isAuth,upload.single("videoUrl"),editLecture)
// courseRouter.delete("/removelecture/:lectureId",isAuth,removeLecture)
// courseRouter.post("/getcreator",isAuth,getCreatorById)







export default courseRouter