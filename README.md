# Ingenio Care — React + Aurora

React frontend for [ingeniocare.com](https://ingeniocare.com), with an Express API that stores data in **Amazon Aurora MySQL**.

The browser never connects to Aurora. React calls `/api/*`, and the API uses `mysql2` against Aurora (or local MySQL 8, which is Aurora-compatible).

## Local development

```bash
docker compose up -d
npm install
npm run dev
```

- React: http://localhost:5173
- API: http://127.0.0.1:3001
- Local `.env` points at Docker MySQL (`AURORA_SSL=false`)

Aurora-backed features:

- Contact form → `contact_submissions`
- Newsletter checkbox → `newsletter_subscribers`
- Create account / Sign in → `users` (bcrypt password hashes + JWT)
- News list and press releases → `news_articles`

## Amazon Aurora (production)

1. Create an **Aurora MySQL** cluster (Serverless v2 is fine).
2. Create database `ingeniocare` and a user the API can use.
3. Put the API on App Runner, ECS, or EC2 **in the same VPC** as Aurora (or enable the Data API later).
4. Set environment variables from `.env.example`:

```
AURORA_HOST=your-cluster.cluster-xxxx.us-east-1.rds.amazonaws.com
AURORA_PORT=3306
AURORA_USER=admin
AURORA_PASSWORD=...
AURORA_DATABASE=ingeniocare
AURORA_SSL=true
JWT_SECRET=long-random-string
CORS_ORIGIN=https://your-amplify-domain
```

5. Start the API with `npm run start:api`. On first boot it creates tables and seeds news.

`server/schema.sql` can also be run in the Aurora query editor.

## AWS Amplify (React hosting)

Amplify hosts the React build only (`npm run build` → `dist/`). `amplify.yml` already does that and rewrites routes to `index.html`.

Set `VITE_API_URL` in the Amplify console to the public API URL, for example `https://api.ingeniocare.com`. Leave it empty in local dev so Vite proxies `/api` to port 3001.

## Architecture

```
React (Amplify Hosting)
   │  /api/contact, /api/news, /api/auth/*
   ▼
Express API (App Runner / ECS / EC2)
   │  mysql2, TLS
   ▼
Aurora MySQL
```
