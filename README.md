# InnerLift 🚀

<div align="center">
  <img src="frontend/public/logo.png" alt="InnerLift Logo" width="180" />
</div>

> **The Zen Lotus:** The InnerLift logo represents the core philosophy of the ecosystem—relentless execution rooted in mental clarity. The Zen circle (Ensō) embodies discipline, completeness, and the unbroken cycle of daily progress, while the lotus within signifies rising above the noise, maintaining calm focus, and continuous personal growth.

> **Nurture the Mind, Master the Day.**
> An elite, AI-powered productivity and mindset ecosystem designed for high performers.

**Live Frontend:** [https://innerlift-productivity-app.vercel.app/](https://innerlift-productivity-app.vercel.app/)  
**Live Backend API:** [https://innerlift-8wtt.onrender.com](https://innerlift-8wtt.onrender.com)

InnerLift is not just a to-do list; it is a comprehensive, gamified execution system. Built on the MERN stack and supercharged by Google's Gemini AI, InnerLift acts as a tactical daily architect, psychological calibrator, and anonymous community platform to help users achieve maximum focus without burning out.

---

## 🌟 Core Features

### 🧠 Mind Space Analytics (AI Journal)
Log your raw, unfiltered thoughts, stressors, or wins. The integrated Gemini AI instantly processes your mental baseline, delivering sentiment scores, psychological reflections, and concrete, actionable protocols to keep you executing efficiently.

### ⚙️ The Routine Engine
Stop manually planning your days. Input your specific constraints (e.g., classes, gym time, work hours), and the AI will engineer a ruthless, time-blocked daily blueprint complete with a driving daily philosophy.

### ⏳ Deep Work (Pomodoro Engine)
A built-in, distraction-free Pomodoro timer designed for unbroken focus. Lock into deep work cycles and seamlessly track your productive hours. Every completed session feeds directly into your global progression profile.

### 🎯 Codex Disciplina & Tactical Objectives
A clean, minimalist workspace to break down your targets that feeds directly into a strict global gamification system. Earn XP and level up for executing tasks and Pomodoros. But beware the **48-Hour Decay Rule**: go two days without executing, and your streak and current XP are ruthlessly wiped to zero (though your long-term rank is preserved). 

### 🎙️ Interactive Voice Mentor
A completely hands-free, AI-powered audio coach. Built on a highly stabilized Web Speech API engine, the Voice Mentor provides zero-fluff, direct audio feedback to instantly course-correct your mindset and keep you focused without breaking your momentum.

### 🌐 The Collective
An anonymous, minimalist community feed. "Seekers" can publish milestones, share momentum, and acknowledge each other's wins without the toxic noise, algorithmic doom-scrolling, or distractions of standard social media.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS (Custom Dark/Light mode support), Web Speech API
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Artificial Intelligence:** Google Generative AI (Gemini 2.5 Flash)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt

---

## 🚀 Getting Started

Follow these steps to set up InnerLift on your local machine.

### Prerequisites
* Node.js installed
* A MongoDB Atlas account and cluster
* A Google Gemini API Key

### 1. Clone the Repository
```bash
git clone [https://github.com/Mahirjambhule/innerlift-productivity-app.git](https://github.com/Mahirjambhule/innerlift-productivity-app.git)
cd innerlift-productivity-app
```

### 2. Environment Variables
Create a `.env` file in your **backend** directory and add the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Install Dependencies
You will need to install the dependencies for both the server and the client.

**For the Backend:**
```bash
npm install
```

**For the Frontend:**
```bash
cd client 
npm install
```

### 4. Run the Application
Start the backend server:
```bash
npm run server
```

Start the React frontend (in a separate terminal):
```bash
cd client
npm run dev
```

The application should now be running on `http://localhost:5173` (or your default Vite port), connected to your live backend at `https://innerlift-8wtt.onrender.com` (or locally at `http://localhost:5000`).

---

## 🎨 UI / UX Philosophy

InnerLift was designed with absolute minimalism in mind. The interface relies on sharp borders, readable typography, and custom modal overlays to keep the user entirely focused on their objectives. No pop-ups, no browser alerts, no unnecessary colors—just pure execution space.