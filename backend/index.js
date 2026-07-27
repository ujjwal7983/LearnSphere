
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

// CLIENT_URL can hold multiple comma-separated origins, e.g.
// "http://localhost:5173,https://learnsphere-1-xmil.onrender.com"
const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`))
        }
    },
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
