import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const genToken = async (userId) => {
    try {
        const token = await jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
        console.log("Generated Token:", token);
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
}
export default genToken;