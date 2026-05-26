# InnerLift 🚀

> **Nurture the Mind, Master the Day.**
> An elite, AI-powered productivity and mindset ecosystem designed for high performers.

InnerLift is not just a to-do list; it is a comprehensive, gamified execution system. Built on the MERN stack and supercharged by Google's Gemini AI, InnerLift acts as a tactical daily architect, psychological calibrator, and anonymous community platform to help users achieve maximum focus without burning out.

---

## 🌟 Core Features

### 🧠 Mind Space Analytics (AI Journal)
Log your raw, unfiltered thoughts, stressors, or wins. The integrated Gemini AI instantly processes your mental baseline, delivering sentiment scores, psychological reflections, and concrete, actionable protocols to keep you executing efficiently.

### ⚙️ The Routine Engine
Stop manually planning your days. Input your specific constraints (e.g., classes, gym time, work hours), and the AI will engineer a ruthless, time-blocked daily blueprint complete with a driving daily philosophy.

### 🎯 Tactical Objectives
A clean, minimalist workspace to break down your targets. Every completed objective feeds into a global gamification system, awarding XP and triggering sleek animations to reward your discipline and build momentum.

### 🌐 The Collective
An anonymous, minimalist community feed. "Seekers" can publish milestones, share momentum, and acknowledge each other's wins without the toxic noise, algorithmic doom-scrolling, or distractions of standard social media.

---

## 🛠️ Tech Stack

*   **Frontend:** React.js, Tailwind CSS (Custom Dark/Light mode support)
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas
*   **Artificial Intelligence:** Google Generative AI (Gemini 1.5/2.5 Flash)
*   **Authentication:** JSON Web Tokens (JWT) & bcrypt

---

## 🚀 Getting Started

Follow these steps to set up InnerLift on your local machine.

### Prerequisites
*   Node.js installed
*   A MongoDB Atlas account and cluster
*   A Google Gemini API Key

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/Mahirjambhule/innerlift-productivity-app.git
cd innerlift-productivity-app
\`\`\`

### 2. Environment Variables
Create a `.env` file in your **backend** directory and add the following keys:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
\`\`\`

### 3. Install Dependencies
You will need to install the dependencies for both the server and the client.

**For the Backend:**
\`\`\`bash
Assuming you are in the root directory and your backend is there, or navigate to your backend folder
npm install
\`\`\`

**For the Frontend:**
\`\`\`bash
cd client # or whatever your frontend folder is named
npm install
\`\`\`

### 4. Run the Application
Start the backend server:
\`\`\`bash
npm run server # or node server.js
\`\`\`

Start the React frontend (in a separate terminal):
\`\`\`bash
cd client
npm run dev
\`\`\`

The application should now be running on `http://localhost:5173` (or your default Vite/CRA port), connected to your backend at `https://innerlift-8wtt.onrender.com`.

---

## 🎨 UI / UX Philosophy

InnerLift was designed with absolute minimalism in mind. The interface relies on sharp borders, readable typography, and custom modal overlays to keep the user entirely focused on their objectives. No pop-ups, no browser alerts, no unnecessary colors—just pure execution space.

---

