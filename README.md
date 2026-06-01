# InnerLift AI 🚀

**Live Frontend:** [https://innerlift-productivity-app.vercel.app/](https://innerlift-productivity-app.vercel.app/)  
**Live Backend API:** [https://innerlift-8wtt.onrender.com](https://innerlift-8wtt.onrender.com)

InnerLift is an elite, highly-focused performance and life coaching web application. It combines advanced AI voice interaction with a strict gamified progression system to help users maintain relentless consistency in their daily habits, tasks, and deep work sessions.

---

## 🔥 Key Features

* **Elite Voice Mentor (Powered by Gemini 2.5 Flash):** * A fully interactive, hands-free AI voice coach.
    * Custom-built utilizing the Web Speech API with bulletproof silence-detection and native state-locking.
    * Provides zero-fluff, highly actionable advice strictly between 3 to 6 sentences.
* **Codex Disciplina (Strict Gamification System):**
    * Earn XP and level up deterministically (100 XP = 1 Level) by completing Pomodoro blocks, tasks, and AI journal entries.
    * **48-Hour Decay Rule:** A strict penalty system. If a user goes 48 hours without completing an essential action, their streak and XP are instantly wiped to zero (while preserving their long-term level).
* **Deep Work Tracking:** Integrated Pomodoro timer tied directly to the gamification engine.
* **Task & Mental Logs:** Real-time task management and AI-analyzed daily journaling.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS (Dark-theme optimized UI)
* Web Speech API (SpeechRecognition & SpeechSynthesis)
* Deployed on Vercel

**Backend:**
* Node.js & Express.js
* MongoDB (Mongoose) for user state and progression tracking
* Google Generative AI SDK (`@google/generative-ai`)
* JWT Authentication
* Deployed on Render

---

## 💻 Local Setup & Installation

To run InnerLift locally, you will need [Node.js](https://nodejs.org/) and a [Google Gemini API Key](https://aistudio.google.com/).

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/innerlift-ai.git
cd innerlift-ai
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` directory and add the following variables:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
\`\`\`
Start the backend server:
\`\`\`bash
npm start
# or for development: npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
\`\`\`
*(Optional)* If you are testing locally, ensure your API fetch routes in the frontend point to `http://localhost:5000` instead of the live Render URL.

Start the Vite development server:
\`\`\`bash
npm run dev
\`\`\`

---

## 🧠 Architecture Notes

* **Voice Loop Failsafes:** The Voice Assistant component is built with strict `isProcessing` and `isSpeaking` ref locks to prevent the mic from picking up the system's own audio, effectively eliminating infinite feedback loops.
* **Database Preservation:** Gamification penalty routes utilize MongoDB's `$set` strictly on `xp` and `streak` to guarantee long-term rank (`level`) preservation during a Codex Breach.

---

## 👨‍💻 Author

**Mahir Hansraj Jambhule**