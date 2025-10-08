# 🚀 Simple Deployment Guide

## Backend Deployment (Render/Railway)

### 1. Create Web Service
- Go to Render.com or Railway.app
- Connect your GitHub repository
- Select "Web Service"
- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

### 2. Environment Variables
```
MONGODB_URI=mongodb+srv://harpalsinghrajput007_db_user:zmrQ2BuIyaTbddtY@secuvault.3m2hinv.mongodb.net/?retryWrites=true&w=majority&appName=SecuVault
JWT_SECRET=secuvault-super-secret-jwt-key-2025
NODE_ENV=production
PORT=5000
```

### 3. Deploy
- Click "Deploy"
- Note your backend URL (e.g., https://your-app.onrender.com)

## Frontend Deployment (Vercel/Netlify)

### 1. Create Static Site
- Go to Vercel.com or Netlify.com
- Connect your GitHub repository
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `.next`

### 2. Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

### 3. Deploy
- Click "Deploy"
- Your app will be live!

## Quick Fix Commands

If you get errors, run these in backend folder:
```bash
cd backend
npm install
npm run build
npm start
```

If frontend has issues:
```bash
cd frontend
npm install
npm run build
```

## That's it! 🎉
Your SecuVault app should now be deployed and working!