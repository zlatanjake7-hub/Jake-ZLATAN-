import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to avoid crashes if GEMINI_API_KEY is not configured yet
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
      throw new Error("GEMINI_API_KEY environment variable is not configured on this server");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST APIs
// 1. Live Match AI Commentator / Play-By-Play Generator
app.post("/api/gemini/commentate", async (req, res) => {
  try {
    const { matchData, contextInput } = req.body;
    const client = getGeminiClient();

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are Baraka Mpenja, the legendary and energetic Swahili-and-English football commentator for Azam FC (Tanzania).
      Generate an energetic, highly passionate, Swahili-English blended match review or tactical break-down for the following match:
      Home: ${matchData.homeTeam} (${matchData.homeScore}) vs Away: ${matchData.awayTeam} (${matchData.awayScore})
      Competition: ${matchData.competition}
      Venue: ${matchData.venue}
      User fan prompt: "${contextInput || 'Tell me a short tactical analysis and yell Goli! in Baraka Mpenja style'}"

      Respond in Swahili with exciting English phrases or Swahili football slangs (like "Kabumbu", "Wanalambani hawafanyi mzaha", "Soka safi la Chamazi", "Sauti ya dhahabu", "Aiseee").
      Keep it engaging, authentic, and under 250 words total. Mention some Azam FC stars if appropriate.`,
    });

    res.json({ commentary: response.text });
  } catch (error: any) {
    console.error("Gemini commentary error:", error);
    res.status(500).json({
      error: "Could not generate commentary",
      details: error.message || String(error),
      fallback: "Aiseee! Soka safi sana uwanjani hapa Chamazi. Wanalambani wanapambana kijasiri mno!"
    });
  }
});

// 2. Swahili Fan Trivia Question generator
app.get("/api/gemini/trivia", async (req, res) => {
  try {
    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a fun multiple-choice trivia question about Azam FC (Tanzania football history or current players, like Fei Toto, Bakhresa sponsor, ice-cream makers, Chamazi ground, founded in 2007).
      Respond in strict JSON format. Use the exact JSON keys shown below, and nothing else.
      JSON structure:
      {
        "question": "The question text, in English or light Swahili",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answerIndex": 0, // index (0 to 3) of the correct option
        "explanation": "A short and fun explanation of the answer"
      }`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini trivia error:", error);
    res.status(500).json({
      error: "Could not generate trivia",
      details: error.message || String(error),
      fallback: {
        question: "In which year was Azam Football Club founded?",
        options: ["2005", "2007", "2010", "1998"],
        answerIndex: 1,
        explanation: "Azam Football Club was officially founded in 2007 by the Bakhresa Group and quickly climbed Tanzanian football tiers."
      }
    });
  }
});

// 3. Simulated Payment and Ticket Booking Endpoint
app.post("/api/payments/checkout", async (req, res) => {
  try {
    const { amount, paymentMethod, email, type, items } = req.body;
    // Simulate real Azam Pay or mobile money (M-Pesa, Tigo Pesa, Airtel Money) callback process
    const transactionId = "TXN-" + Math.floor(10000000 + Math.random() * 90000000);
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    res.json({
      status: "Success",
      transactionId,
      orderId,
      amount,
      message: "Malipo yamekamilika! Payment processed successfully via " + (paymentMethod || "Mobile Money"),
      date: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to process transaction" });
  }
});

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production statics
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Azam FC Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
