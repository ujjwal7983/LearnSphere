import express from "express";
import { Router } from "express";
import { login, logout, signUp, sendOtp, verifyOtp, resetPassword } from "../controller/authController.js";
import { googleAuth } from "../controller/authController.js";
const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/resetPassword", resetPassword);
router.post("/googleAuth", googleAuth);

export default router;