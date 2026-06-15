var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
      throw new Error("GEMINI_API_KEY environment variable is not configured on this server");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
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
      User fan prompt: "${contextInput || "Tell me a short tactical analysis and yell Goli! in Baraka Mpenja style"}"

      Respond in Swahili with exciting English phrases or Swahili football slangs (like "Kabumbu", "Wanalambani hawafanyi mzaha", "Soka safi la Chamazi", "Sauti ya dhahabu", "Aiseee").
      Keep it engaging, authentic, and under 250 words total. Mention some Azam FC stars if appropriate.`
    });
    res.json({ commentary: response.text });
  } catch (error) {
    console.error("Gemini commentary error:", error);
    res.status(500).json({
      error: "Could not generate commentary",
      details: error.message || String(error),
      fallback: "Aiseee! Soka safi sana uwanjani hapa Chamazi. Wanalambani wanapambana kijasiri mno!"
    });
  }
});
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
  } catch (error) {
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
app.post("/api/payments/checkout", async (req, res) => {
  try {
    const { amount, paymentMethod, email, type, items } = req.body;
    const transactionId = "TXN-" + Math.floor(1e7 + Math.random() * 9e7);
    const orderId = "ORD-" + Math.floor(1e5 + Math.random() * 9e5);
    res.json({
      status: "Success",
      transactionId,
      orderId,
      amount,
      message: "Malipo yamekamilika! Payment processed successfully via " + (paymentMethod || "Mobile Money"),
      date: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to process transaction" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Azam FC Server running on http://localhost:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.cjs.map
