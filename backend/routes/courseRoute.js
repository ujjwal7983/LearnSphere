import express from "express"
import isAuth from "../middleware/isAuth.js"
import { createCourse, editCourse, getCourseById, getCreatorCourses, getPublishedCourses, removeCourse, getCreatorById} from "../controller/courseController.js"
import { createLecture, editLecture, getCourseLecture, removeLecture } from "../controller/courseController.js"
import upload from "../middleware/multer.js"
import { searchWithAi } from "../controller/searchController.js"

let courseRouter = express.Router()

courseRouter.post("/create",isAuth,createCourse)
courseRouter.get("/getpublished",getPublishedCourses)
courseRouter.get("/getcreator",isAuth,getCreatorCourses)
courseRouter.post("/editcourse/:courseId",isAuth,upload.single("thumbnail"),editCourse)
courseRouter.get("/getcourse/:courseId",isAuth,getCourseById)
courseRouter.delete("/remove/:courseId",isAuth,removeCourse)

courseRouter.post("/createlecture/:courseId",isAuth,createLecture)
courseRouter.get("/getcourselecture/:courseId",isAuth,getCourseLecture)
courseRouter.post("/editlecture/:lectureId",isAuth,upload.single("videoUrl"),editLecture)
courseRouter.delete("/removelecture/:lectureId",isAuth,removeLecture)
courseRouter.post("/getcreator",isAuth,getCreatorById)

courseRouter.post("/search", searchWithAi)

export default courseRouter