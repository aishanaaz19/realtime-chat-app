import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { connectDB} from "./lib/db.js";
import userRoutes from './routes/user.route.js'
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import chatbotRoutes from './routes/chatbot.routes.js'
import { app, server } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json({ limit: '30mb' })); 
app.use(express.urlencoded({ limit: '30mb', extended: true })); 
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chatbot", chatbotRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(join(__dirname, "../../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(join(__dirname, "../../frontend/dist/index.html"));
    });
}

server.listen(PORT, () => {
    console.log("Server is running on PORT:" + PORT);
    connectDB();
});
