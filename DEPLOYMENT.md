# 🚀 OmniMarket Deployment & CI/CD Guide

This guide explains how to deploy **OmniMarket Frontend on Vercel** and **Backend Engine on Render** with automated CI/CD pipelines via GitHub Actions.

---

## 🏗️ Architecture Overview

- **Frontend**: React 19 + Vite + Tailwind CSS -> **Vercel**
- **Backend**: Node.js + Express + JWT + Mongoose -> **Render**
- **Database**: MongoDB Atlas (Cloud)
- **CI/CD**: GitHub Actions (`.github/workflows/ci-cd.yml`)

---

## 1. ⚙️ Deploy Backend to Render

### Option A: Using `render.yaml` Blueprint (Recommended)
1. Log in to [render.com](https://render.com).
2. Go to **Blueprints** -> Click **New Blueprint Instance**.
3. Connect your GitHub repository: `Multi-Tenants-E-commerce-Saas-`.
4. Render will automatically detect [`render.yaml`](file:///c:/Users/Shrutika/Desktop/internship/render.yaml).
5. Fill in required environment variables (e.g., `MONGODB_URI`, `FRONTEND_URL`).
6. Click **Apply**.

### Option B: Manual Web Service Creation
1. Go to **Dashboard** -> **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Name**: `omnimarket-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Add **Environment Variables**:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Port for Render |
   | `MONGODB_URI` | `mongodb+srv://<user>:<pass>@cluster0.mongodb.net/omnimarket` | Your MongoDB Atlas Connection String |
   | `JWT_SECRET` | `YourSuperSecretProductionJWTKey2026` | Secure random key |
   | `JWT_EXPIRES_IN` | `7d` | Token expiry |
   | `FRONTEND_URL` | `https://your-app.vercel.app` | Vercel domain (for CORS) |
   | `RAZORPAY_KEY_ID` | `rzp_test_TZuZATB0AWjiF6` | Razorpay Test Key ID |
   | `RAZORPAY_KEY_SECRET`| `fSddaHaXCy1SHtPR7zUVx9S9` | Razorpay Test Secret Key |

5. Click **Create Web Service**.
6. Once deployed, copy your Render URL (e.g., `https://omnimarket-backend.onrender.com`).

---

## 2. 🎨 Deploy Frontend to Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: `Multi-Tenants-E-commerce-Saas-`.
4. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend` (or leave default if using root [`vercel.json`](file:///c:/Users/Shrutika/Desktop/internship/vercel.json)).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variables**:
   | Variable | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://omnimarket-backend.onrender.com/api` (Your Render Backend URL + `/api`) |

6. Click **Deploy**.

---

## 3. 🤖 Automated CI/CD with GitHub Actions

The workflow located at [`.github/workflows/ci-cd.yml`](file:///c:/Users/Shrutika/Desktop/internship/.github/workflows/ci-cd.yml) will automatically run on every `push` and `pull_request` to `main`.

### Optional: Instant Webhook & CLI Automated Deploys
To enable automated deployment hooks via GitHub Actions:
1. Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Add the following repository secrets:
   - `RENDER_DEPLOY_HOOK_URL`: (Found under your Render Service Settings -> *Deploy Hook*)
   - `VERCEL_TOKEN`: (Generated from Vercel Account Settings -> *Tokens*)
   - `VERCEL_ORG_ID`: (Found in `.vercel/project.json` or team settings)
   - `VERCEL_PROJECT_ID`: (Found in project settings)
