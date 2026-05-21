import { ZodError } from "zod";
import { generateAIResponse } from "../services/chat.service.js";

export const chatWithAI = async (req, res) => {
  try {
    const aiReply = await generateAIResponse(req.body);

    res.json({
      ...aiReply,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Invalid chat request",
        details: error.flatten(),
      });
    }

    console.error(error);

    res.status(502).json({
      error: "AI service error",
      message: error.message,
    });
  }
};
