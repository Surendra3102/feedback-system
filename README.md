# 📝 Lightweight Feedback System

Internal tool for manager-employee feedback tracking.

## 🚀 Features
- Login/Register (JWT)
- Role-based dashboards
- Feedback submission, edit, comments, tags
- Sentiment tracking and analytics
- Acknowledgement system

## 🛠️ Stack
- Frontend: React + Vite
- Backend: Django + DRF
- DB: SQLite (or Postgres for prod)
- Auth: JWT (djangorestframework-simplejwt)
- Deployment-ready via Docker

## 🐳 To Run Locally

```bash
# Backend
cd backend
docker build -t feedback-backend .
docker run -p 8000:8000 feedback-backend

# Or use docker-compose
docker-compose up --build
