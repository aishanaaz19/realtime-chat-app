import express from "express";
import { handleChatbotPrompt } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.post("/", handleChatbotPrompt);

export default router;
