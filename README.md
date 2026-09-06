# Ingenio Care — React + Postgres

React frontend for [ingeniocare.com](https://ingeniocare.com). Locally it is Vite + Express + Docker Postgres. Production is **Amplify Gen 2** like Growgent: hosted SPA, Lambda data API, Aurora PostgreSQL.

The browser never connects to the database. React calls `/api/*`.

## Local development

```bash
docker compose up -d
npm install
npm run dev
```

- React: http://localhost:5173
- API: http://127.0.0.1:3001
- Local `.env` points at Docker Postgres (`POSTGRES_SSL=false`)

Postgres-backed features:

- Contact form → `contact_submissions`
- Newsletter checkbox → `newsletter_subscribers`
- Create account / Sign in → `users` (roles: owner, admin, user)
- Multi-tenant workspaces → `tenants`, `tenant_memberships`, `tenant_invites`
- News list and press releases → `news_articles`
- Blogs and papers → `site_content`
- AI Write / Rewrite / Refine for News, Blogs, and Papers uses **Claude Sonnet 4.5** on Amazon Bedrock (same model as Growgent). Set `AWS_REGION`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY`.

## Production: Amplify Gen 2 + Lambda + Aurora (Growgent style)

Same pattern as Growgent: Amplify Hosting for React, a Lambda data API for Express, Aurora PostgreSQL in a VPC. Deploy this as a **separate Amplify app** in the Growgent AWS account (do not attach this repo to the Growgent.ai app).

```
React (Amplify Hosting)
   │  amplify_outputs.json custom.dataApiUrl
   ▼
Lambda Function URL  (Express via serverless-http, 120s, Bedrock IAM)
   │  VPC
   ▼
Aurora PostgreSQL Serverless v2  (database ingeniocare)
```

Local development is unchanged: Docker Postgres + `npm run dev`. Cloud credentials come from the Lambda role (Bedrock + Secrets Manager), not from `.env` access keys.

### Deploy in the Growgent AWS account

1. AWS Console → the Growgent account → **Amplify** → **Create new app** (name it `ingeniocare`, Gen 2).
2. Connect this GitHub repo and the branch you want to host.
3. After the first backend deploy, set the hosting secret:
   ```bash
   npx ampx secret set JWT_SECRET
   ```
   Use a long random value. Redeploy so the data-api Lambda picks it up.
4. Amplify Hosting builds `amplify.yml`: `ampx pipeline-deploy` then `vite build`. The frontend reads `custom.dataApiUrl` from `amplify_outputs.json`.
5. Optional local cloud backend (AWS CLI profile must be the Growgent account):
   ```bash
   npm run sandbox
   ```
   That writes `amplify_outputs.json` so `npm run dev:web` can call the deployed Lambda while you still use Docker for nothing, or keep using local Express.

The first deploy creates a VPC, NAT Gateway, and Aurora cluster (`ingenioCareCluster`). That is billed separately from Growgent’s `growgentCluster`. Do not reuse the Growgent Amplify app or Cognito pool — Ingenio Care keeps its own JWT users table.

### Amplify secrets

| Secret | Purpose |
|---|---|
| `JWT_SECRET` | Signs Ingenio Care sessions |

Bedrock uses the Lambda IAM role (Claude Sonnet 4.5), same as Growgent’s data-api.

### Optional: EC2 instead of Lambda

`deploy/nginx-api.conf` and `deploy/ingenio-api.service` remain if you want Express on a VM with Postgres on the box. Prefer the Amplify Lambda path above for the Growgent account.
