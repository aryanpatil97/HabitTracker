# Habit Tracker - MERN Stack Application

A full-stack habit tracking application with real-time updates and modern UI.


[![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-blue)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3+-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel)](https://habitracker-deployed.vercel.app/)
[![Backend on Render](https://img.shields.io/badge/Backend%20on-Render-46E3B7?logo=render)](https://habittracker-eywk.onrender.com)

## ✨ Features
- Create, Read, Update, Delete habits
- Real-time sync using Socket.io
- Tag-based filtering system
- Responsive Tailwind CSS design
- Glass-morphism UI elements
- Motivational message rotation
- Instant updates without refresh

## 🛠 Technologies
**Frontend**  
- React + Vite
- Tailwind CSS + PostCSS
- Socket.io Client
- Axios

**Backend**  
- Node.js + Express
- MongoDB Atlas
- Mongoose
- Socket.io Server

**Deployment**  
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 🚀 Installation
1. Clone repo:
```bash   
git clone https://github.com/YOUR_USERNAME/habit-tracker.git
cd habit-tracker
```
2.Install dependencies:
```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```
3.Create .env files:
```bash
# frontend/.env
VITE_API_URL=YOUR_RENDER_API_URL
VITE_WS_URL=YOUR_RENDER_WS_URL

# backend/.env
MONGODB_URI=YOUR_MONGODB_ATLAS_URI
PORT=3001
```
4.Start servers:
```bash
# Frontend (from /frontend)
npm run dev

# Backend (from /backend)
npm start
```
## 🌐 Deployment

**Frontend (Vercel):**  
- Set environment variables in Vercel dashboard  
- Build command: `npm run build`  

**Backend (Render):**  
- Use Web Service deployment  
- Enable WebSocket support  
- Add MongoDB Atlas connection string  

## 🔗 Live Demo
- **Frontend:** [https://habitracker-deployed.vercel.app/](https://habitracker-deployed.vercel.app/)  
- **Backend API:** [https://habittracker-eywk.onrender.com](https://habittracker-eywk.onrender.com)  
