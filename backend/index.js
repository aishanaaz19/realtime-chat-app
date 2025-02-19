import express from "express";
import dotenv from "dotenv"
 import {connectDB} from "./lib/db.js";
 import autroutes from "./routes/auth.route.js";

 dotenv.config();

 const app=express();

 const PORT=process.env.PORT;

 app.use(express.json());
 app.use(cors({
   origin: "http://localhost:5173",
   credentials: true
}));
 app.use("/api/auth",authRoutes);
 app.listen(PORT,()=>{
    console.log("server is running on PORT:" +PORT);
    connectDB();
 });
