
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import cookiesParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import courseRouter from "./routes/courseRoute.js";
import paymentRouter from "./routes/paymentRoute.js";

dotenv.config();
import cors from 'cors';
import reviewRouter from './routes/reviewRoute.js';

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cookiesParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/course", courseRouter);
app.use("/api/order", paymentRouter);
app.use("/api/review", reviewRouter);



app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(port, () => {
    console.log("Server Started", port);
    connectDB();
});