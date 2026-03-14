# Deployment Guide - ALS-LBS

This guide provides instructions for deploying the Adaptive Life Stability & Load Balancing System (ALS-LBS) to production.

## 1. Database: MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (Shared Tier is free).
3. Under "Network Access", allow access from anywhere (`0.0.0.0/0`) for Render deployment, or specify Render's outbound IPs.
4. Under "Database Access", create a user with read/write permissions.
5. Get your **Connection String** (URI) and replace `<password>` with your database user password.

## 2. Backend: Render
1. Create an account at [Render](https://render.com).
2. Create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the following configurations:
    - **Root Directory**: `backend`
    - **Environment**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
5. Add **Environment Variables**:
    - `PORT`: `5000`
    - `MONGO_URI`: (Your MongoDB Atlas connection string)
    - `JWT_SECRET`: (A long, random string)
    - `FRONTEND_URL`: (Your Vercel deployment URL, e.g., `https://als-lbs.vercel.app`)
6. Deploy the service and copy the **Service URL** (e.g., `https://als-lbs-backend.onrender.com`).

## 3. Frontend: Vercel
1. Create an account at [Vercel](https://vercel.com).
2. Import your GitHub repository.
3. Vercel will auto-detect the Vite project.
4. Configure the Project:
    - **Framework Preset**: `Vite`
    - **Root Directory**: `./` (Project root)
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
5. Add **Environment Variables**:
    - `VITE_API_URL`: (Your Render backend URL, e.g., `https://als-lbs-backend.onrender.com/api`)
6. Deploy.

## 4. Verification
- Visit your Vercel URL.
- Try registering a new account.
- Check the "System Summary" to ensure it loads data from the backend.
- Verify that Task Management (CRUD) works correctly.

---
*Note: Ensure the `FRONTEND_URL` in Render exactly matches your Vercel domain to avoid CORS issues.*
