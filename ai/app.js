const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── Startup check ────────────────────────────────────────────────────────────
if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ GOOGLE_API_KEY is missing from .env!");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// ─── Model cascade: fastest/most-available first ──────────────────────────────
// Tested live — these are confirmed working with this API key.
const MODEL_CASCADE = [
  "gemini-3.5-flash-lite",  // fastest
  "gemini-3.5-flash",       // reliable
  "gemini-3.6-flash",       // fallback
];

// ─── Recent-word memory ───────────────────────────────────────────────────────
const recentWords = [];
const MAX_RECENT_WORDS = 8;

// ─── Extract JSON from any Gemini response format ─────────────────────────────
function extractJSON(text) {
  // Strip ```json ... ``` fences
  const fenced = text.match(/```json\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  // Strip bare ``` ... ``` fences
  const bare = text.match(/```\s*([\s\S]*?)```/);
  if (bare) return bare[1].trim();

  // Find raw JSON object
  const raw = text.match(/\{[\s\S]*?\}/);
  if (raw) return raw[0].trim();

  return text.trim();
}

// ─── Call one model with a hard timeout ──────────────────────────────────────
async function callModel(modelName, promptText, timeoutMs = 10000) {
  return new Promise(async (resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout after ${timeoutMs}ms on ${modelName}`));
    }, timeoutMs);

    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: { temperature: 1.0, maxOutputTokens: 512 },
      });
      clearTimeout(timer);
      const text = result.response.text();
      resolve(text);
    } catch (err) {
      clearTimeout(timer);
      reject(err);
    }
  });
}

// ─── Generate word + hint — tries each model in cascade ──────────────────────
async function generateWordAndHint() {
  let promptText =
    'Generate a single English word for a Hangman game and a short one-sentence hint. ' +
    'Respond with ONLY valid JSON, no markdown, no explanation: {"word": "EXAMPLE", "hint": "The hint here."} ' +
    'The word must be a common English noun, 4–10 letters, all ages appropriate.';

  if (recentWords.length > 0) {
    const excluded = recentWords.map(w => `"${w}"`).join(', ');
    promptText += ` Do NOT use: ${excluded}.`;
  }

  for (const modelName of MODEL_CASCADE) {
    try {
      console.log(`🤖 Trying model: ${modelName}`);
      const rawText = await callModel(modelName, promptText, 12000);
      const jsonStr = extractJSON(rawText);
      const parsed = JSON.parse(jsonStr);

      if (!parsed.word || typeof parsed.word !== 'string') throw new Error('Missing "word"');
      if (!parsed.hint || typeof parsed.hint !== 'string') throw new Error('Missing "hint"');

      const word = parsed.word.replace(/[^a-zA-Z]/g, '').toUpperCase();
      const hint = parsed.hint.trim();

      if (word.length < 3) throw new Error(`Word too short: "${word}"`);

      // Track recent
      const wordLower = word.toLowerCase();
      if (!recentWords.includes(wordLower)) {
        recentWords.push(wordLower);
        if (recentWords.length > MAX_RECENT_WORDS) recentWords.shift();
      }

      console.log(`✅ [${modelName}] Word: ${word}`);
      return { word, hint };

    } catch (err) {
      console.warn(`⚠️  [${modelName}] failed: ${err.message}`);
      // Small delay before trying the next model
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // All models failed — throw so route handler uses fallback
  throw new Error('All models in cascade failed');
}

// ─── Fallback word pool ───────────────────────────────────────────────────────
const FALLBACK_WORDS = [
  { word: "PYTHON",   hint: "A popular high-level programming language." },
  { word: "GUITAR",   hint: "A stringed musical instrument with six strings." },
  { word: "PLANET",   hint: "A large body orbiting a star in space." },
  { word: "BRIDGE",   hint: "A structure built to span a physical obstacle." },
  { word: "CASTLE",   hint: "A large medieval fortified building." },
  { word: "JUNGLE",   hint: "A dense tropical forest full of wildlife." },
  { word: "CANDLE",   hint: "A wax cylinder with a wick used for light." },
  { word: "DOLPHIN",  hint: "An intelligent marine mammal known for jumping." },
  { word: "COMPASS",  hint: "A navigation tool that always points north." },
  { word: "DIAMOND",  hint: "The hardest natural substance, a precious gem." },
  { word: "LANTERN",  hint: "A portable light source with a protective case." },
  { word: "VOLCANO",  hint: "A mountain that can erupt with molten lava." },
];

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/gameData', async (req, res) => {
  try {
    const data = await generateWordAndHint();
    res.json(data);
  } catch (err) {
    console.error("⚠️  All models failed, using fallback pool:", err.message);
    const available = FALLBACK_WORDS.filter(f => !recentWords.includes(f.word.toLowerCase()));
    const pool = available.length > 0 ? available : FALLBACK_WORDS;
    const fallback = pool[Math.floor(Math.random() * pool.length)];
    recentWords.push(fallback.word.toLowerCase());
    if (recentWords.length > MAX_RECENT_WORDS) recentWords.shift();
    console.log(`🃏 Fallback word: ${fallback.word}`);
    res.json(fallback);
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', models: MODEL_CASCADE, recentWords });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Hangman AI server → http://localhost:${port}`);
  console.log(`🤖 Model cascade: ${MODEL_CASCADE.join(' → ')}`);
});