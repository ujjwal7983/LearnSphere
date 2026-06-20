import Course from "../model/courseModel.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const searchWithAi = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are an intelligent assistant for an LMS platform.

A user will type any query about what they want to learn.

Your task is to understand the intent and return ONE keyword only from this list:

- App Development
- AI/ML
- AI Tools
- Data Science
- Data Analytics
- Ethical Hacking
- UI UX Designing
- Web Development
- Others
- Beginner
- Intermediate
- Advanced

Rules:
- Return only one keyword.
- No explanation.
- No extra text.

Query: ${input}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const keyword = response.text.trim();

    console.log("User Query:", input);
    console.log("Gemini Keyword:", keyword);

    const course = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: input, $options: "i" } },
        { subTitle: { $regex: input, $options: "i" } },
        { description: { $regex: input, $options: "i" } },
        { category: { $regex: input, $options: "i" } },
        { level: { $regex: input, $options: "i" } },
      ],
    });

    if (course.length > 0) {
      return res.status(200).json(course);
    }

    const aiCourses = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { subTitle: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { level: { $regex: keyword, $options: "i" } },
      ],
    });

    return res.status(200).json(aiCourses);
  } catch (error) {
    console.error("AI Search Error:", error);

    return res.status(500).json({
      message: "Failed to search courses",
      error: error.message,
    });
  }
};