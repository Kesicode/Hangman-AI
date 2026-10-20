# 🚀 Release Notes - Hangman AI v1.0.0

**Release Tag**: [`v1.0.0`](https://github.com/Kesicode/Hangman-AI/releases/tag/v1.0.0)  
**Date**: October 2026  
**Author**: [Kesicode](https://github.com/Kesicode)

---

## 🌟 Highlights

Welcome to the **v1.0.0** official release of **Hangman AI**! This version delivers a fully hardened, cross-platform mobile and web Hangman game backed by Google Gemini AI with high reliability, automated fallbacks, and a modern responsive interface.

---

## 🎮 What's Included

### 1. 🤖 Dynamic Gemini AI Backend
- **Model Cascading Architecture**: Automatically queries `gemini-3.5-flash-lite` $\rightarrow$ `gemini-3.5-flash` $\rightarrow$ `gemini-3.6-flash` with per-model timeouts to guarantee quick response times.
- **Fail-Safe Offline Word Pool**: 12 curated words with hints are immediately dispatched if all API attempts spike or timeout, ensuring zero game downtime.
- **Anti-Repetition Memory**: Prevents recently used words from repeating across consecutive games.
- **Robust JSON Extraction**: Resilient parsing supporting markdown-fenced code blocks, bare blocks, or raw JSON structures.

### 2. 🎨 Refined Gameplay & Visual Experience
- **Interactive Keyboard**: Real-time feedback with green tiles for correct guesses, red tiles for incorrect guesses, and automatic disabling of tried letters.
- **Responsive SVG Hangman**: Clean outline stick figure that eliminates nested SVG rendering issues on the web and mobile browsers.
- **Game Over & Win Revelations**: Full word reveal showing missed letters in distinct red tiles upon game over.
- **Animated Modals**: Smooth spring-animated game over and victory screens.
- **Theme Support**: Seamless Dark/Light mode toggle via the app header.

### 3. 🛡️ Security & Quality
- **Zero Client Leakage**: Gemini API keys are isolated strictly on the Node.js backend (`ai/.env`), never bundled into client apps or Expo builds.
- **Git Shielding**: Multi-level `.gitignore` configurations preventing accidental tracking of secrets and debug logs.
- **Custom App Favicon**: Bespoke AI circuit-brain and wooden gallows icon with web manifest integration.

---

## 📦 Quick Start

### Backend
```bash
cd ai
npm install
# Create ai/.env with: GOOGLE_API_KEY=your_key and PORT=5000
node app.js
```

### Frontend
```bash
npm install
npx expo start --web
```
Open [http://localhost:8081](http://localhost:8081) in your browser.
