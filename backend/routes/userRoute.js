import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser } from "../controller/userController.js"

const userRouter = express.Router()
console.log("userRoute loaded");
userRouter.get("/getcurrentuser", isAuth, getCurrentUser)


export default userRouter;