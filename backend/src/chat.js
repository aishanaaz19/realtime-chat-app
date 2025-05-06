// chat.js (inside backend/src/)
const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI chatbot error" });
  }
});

module.exports = router;
