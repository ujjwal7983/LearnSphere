import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";

export const signUp = async(req, res) => {
    try{
        const {name, email, password, role} = req.body;
        let existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({message: "User already exists"});
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message: "Enter valid email"});
        }
        if(password.length < 8){
            return res.status(400).json({message: "Password must be at least 8 characters long"});
        }
        let hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, 
            email, 
            password: hashPassword,
            role
        })
        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(201).json({message: "User created successfully", token});
    } catch(error){
        res.status(500).json({message: "Error signing up", error: error.message});
    }
}

export const login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({message: "Login successful", token});
    } catch(error){
        res.status(500).json({message: "Error logging in", error: error.message});
    }
}

export const logout = async(req, res) => {
    try{
        await res.clearCookie("token");   
        res.status(200).json({message: "Logout successful"});
    } catch(error){
        res.status(500).json({message: "Error logging out", error: error.message});
    }
}    