# ZoneIn LMS (LearnZin) - Monorepo

This repository contains the complete source code for the ZoneIn LMS project, separated into `frontend` (Next.js) and `backend` (Node.js/Express) directories.

## 🚀 How to Fix the Vercel 404 Error

The `404: NOT_FOUND` error happens because Vercel is trying to deploy the root of the repository instead of the `frontend` application folder.

To fix this, follow these exact steps in your Vercel Dashboard:

1. Go to your project on Vercel.
2. Click on **Settings** in the top navigation bar.
3. In the **General** section, scroll down to **Root Directory**.
4. Click **Edit** and type exactly: `frontend`
5. Click **Save**.
6. Vercel will ask to redeploy your project. Click **Deploy**.

Once the new deployment finishes, your website will be live without the 404 error!

## Project Structure

- `/frontend` - Next.js 14 Application (React, Tailwind, Zustand)
- `/backend` - Node.js Express Server (Prisma, PostgreSQL, Gemini AI)

## Local Development

1. Open a terminal in `/backend` and run `npm install` then `npm run dev`
2. Open another terminal in `/frontend` and run `npm install` then `npm run dev`
3. Visit `http://localhost:3000`
