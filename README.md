# <img src="assets/smile.png" width="60" height="60" /> Hangman AI

Hangman AI is a mobile game that combines the classic Hangman word-guessing gameplay with the power of **Gemini AI** for dynamic word generation. Built using **React Native (Expo)** and a **Node.js + Express** backend.

<img src="assets/screenshot.png" alt="Hangman AI" width="200"/>

---

## 🚀 Features

- 🔤 AI-generated words with hints powered by Google Gemini
- 📱 Beautiful mobile UI built with React Native & Expo
- 🔗 Backend API built using Express.js
- ☁️ Deployed with support for environment configuration
- 🌙 Light & Dark mode support (customizable)

---

## 📲 Download the App

👉 [Click to Download Hangman AI (APK)](https://expo.dev/artifacts/eas/pRZijjM86884K5pqutW2Ra.apk)

---

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/hangman-ai.git
cd hangman-ai
```

### 2. Frontend (Expo React Native)

```bash
npm install
npm start
```

> Make sure you have Expo Go installed on your phone, or use an Android/iOS emulator.

---

### 3. Backend (Node + Express + Gemini AI)

```bash
cd ai
npm install
```

#### Create a `.env` file inside the `ai/` folder:

```env
GOOGLE_API_KEY=your_google_gemini_api_key
PORT=5000
```

Then start the server:

```bash
npm start
```

> The backend should now be running on `http://localhost:5000`

---

## 🌐 API Endpoints

| Method | Endpoint         | Description                             |
| ------ | ---------------- | --------------------------------------- |
| POST   | `/gameData` | Generate a new word + hint using Gemini |

---

## 📦 Tech Stack

**Frontend**:

- React Native
- Expo
- Custom Keyboard & UI

**Backend**:

- Node.js
- Express
- Google Gemini API

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

## ✨ Credits

- Gemini AI – for powering the word generation
- React Native + Expo – for cross-platform mobile UI
- You – for checking it out!
