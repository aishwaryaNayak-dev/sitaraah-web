# Sitaraah Wellness

MERN stack website: React (Vite) + Express + MongoDB, Razorpay payments, Nodemailer emails, JWT admin dashboard.

## Setup
1. `npm run install:all`
2. Copy `server/.env.example` to `server/.env` and fill in every value
3. `npm run dev`  (site: http://localhost:5173, admin: http://localhost:5173/admin, API: http://localhost:5000)

## Production
1. `npm run build --prefix client`
2. Set `NODE_ENV=production` and run `npm start --prefix server`. Express serves the built site and the API together.

## Notes
- Session prices are seeded in `server/controllers/serviceController.js`, and can be changed any time from the admin Services tab.
- Gmail needs an App Password for SMTP_PASS. Leave SMTP_USER empty to switch emails off.
- Use Razorpay test keys first, then switch to live keys.

## Deploying on Vercel (two projects from one repo)
1. Backend: new Vercel project, Root Directory `server`. Add every variable from `server/.env.example` in Project Settings > Environment Variables. Set `CLIENT_URL` to the frontend URL with no trailing slash.
2. Frontend: new Vercel project, Root Directory `client`, framework Vite. Add `VITE_API_URL` set to the backend URL with no trailing slash.
3. Redeploy both after changing any variable.
