import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI Server-side SDK
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not defined.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// Health Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    system: "UniAI Attendance Platform Engine",
    timestamp: new Date().toISOString()
  });
});

// Authentication Endpoint
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Simulated JWT authentication payload
  const token = `jwt-token-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  const refreshToken = `jwt-refresh-${Date.now()}`;

  res.json({
    accessToken: token,
    refreshToken: refreshToken,
    user: {
      email,
      role: role || "student",
      authenticatedAt: new Date().toISOString()
    }
  });
});

// UniAI Assistant Endpoint
app.post("/api/ai/query", async (req, res) => {
  try {
    const { prompt, userRole, studentData, teacherData, context } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const ai = getGenAIClient();

    // System prompt with context injection
    const systemInstruction = `You are "UniAI Assistant", an elite, bilingual (English & Urdu) AI Academic & Attendance Management Advisor for a top-tier University.
Your mission is to provide accurate, helpful, empathetic, and professional assistance to Students, Teachers, Admins, and Super Admins.

Rules and Capabilities:
1. Student Assistance:
   - Calculate attendance percentage and projections.
   - Tell students how many consecutive future classes they MUST attend to reach 75%, 80%, or 90% attendance.
   - Tell students how many classes they can miss if they are above their target.
   - Explain university attendance policies (75% minimum required for exam eligibility).
   - Warn students if they are in the danger zone (<75%).
2. Teacher & Admin Assistance:
   - Identify frequently absent or at-risk students.
   - Draft formal, polite warning notices and emails to absent students or parents.
   - Generate class performance summaries, attendance heatmaps, and department comparisons.
3. Language Support:
   - Respond in the language requested by the user (English or Urdu/Roman Urdu if prompted in Urdu).
   - Use clean Markdown formatting with headers, bullet points, bold key stats, and readable tables if helpful.
4. Tone: Professional, highly supportive, clear, structured, and action-oriented.

Context provided from current session:
Role: ${userRole || 'student'}
Session Context: ${JSON.stringify(context || {})}
Student Context: ${JSON.stringify(studentData || {})}
Teacher Context: ${JSON.stringify(teacherData || {})}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I am unable to process your request at this moment. Please try again.";

    res.json({
      response: replyText,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Error in UniAI query handler:", error);
    res.status(500).json({
      message: "An error occurred while communicating with UniAI Engine.",
      error: error.message || String(error)
    });
  }
});

// Start Server & Serve Vite Frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`UniAI University System running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
