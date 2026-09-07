# Ingenio Care — React + Postgres

React frontend for [ingeniocare.com](https://ingeniocare.com). Local Vite talks to the **production** Amplify data API (Lambda + Aurora). Do not run Postgres or Express on your machine.

The browser never connects to the database. React calls the Function URL in `amplify_outputs.json` (`custom.dataApiUrl`).

## Local development

```bash
npm install
npm run dev
```

- React: http://localhost:5173
- API: production Lambda from `amplify_outputs.json`
- Sign in uses the production `users` table (same accounts as the live site)

Optional: set `VITE_API_URL` in `.env` to override the Function URL.

Postgres-backed features (all on Aurora in AWS):

- Contact form → `contact_submissions`
- Newsletter checkbox → `newsletter_subscribers`
- Create account / Sign in → `users` (roles: owner, admin, user)
- Multi-tenant workspaces → `tenants`, `tenant_memberships`, `tenant_invites`
- News list and press releases → `news_articles`
- Blogs and papers → `site_content`
- AI Write / Rewrite / Refine for News, Blogs, and Papers uses **Claude Sonnet 4.5** on Amazon Bedrock in the data-api Lambda.

## Production: Amplify Gen 2 + Lambda + shared Aurora

Amplify Hosting for React, a Lambda data API for Express. Care **does not create** a VPC or RDS cluster. It joins the shared IngenioNetwork VPC and Aurora cluster whose IDs live in `amplify/network/constants.ts`. Deploy this as a **separate Amplify app** in the Care AWS account (`711387140392`). Do not attach this repo to the Growgent.ai app.

```
React (local Vite or Amplify Hosting)
   │  amplify_outputs.json custom.dataApiUrl
   ▼
Lambda Function URL  (Express via serverless-http, 120s, Bedrock IAM)
   │  shared IngenioNetwork VPC
   ▼
Aurora PostgreSQL  (database ingeniocare on the shared cluster)
```

Cloud credentials come from the Lambda role (Bedrock + Secrets Manager), not from a local `.env`.

### Shared network IDs

Refresh the committed import IDs when the cluster or subnets change:

```bash
npm run select-network
# or
npm run select-network -- --cluster ingenio-pop-local-main
```

That writes `amplify/network/constants.ts`. Commit the result. Amplify Hosting cannot prompt; if a build must retarget, set `INGENIO_CLUSTER_IDENTIFIER` and the build runs the same script non-interactively. If that env is unset, the committed IDs are used.

### Deploy in the Care AWS account

1. AWS Console → account `711387140392` → **Amplify** → **Create new app** (name it `ingeniocare`, Gen 2). Use the GitHub App; do not use `amplify create-app`.
2. Connect this GitHub repo and the branch you want to host.
3. After the first backend deploy, set the hosting secret:
   ```bash
   npx ampx secret set JWT_SECRET
   ```
   Use a long random value. Redeploy so the data-api Lambda picks it up.
4. Amplify Hosting builds `amplify.yml`: `ampx pipeline-deploy` then `vite build`. The frontend reads `custom.dataApiUrl` from `amplify_outputs.json`.
5. Optional local cloud backend (AWS CLI profile must be the Care account):
   ```bash
   npm run sandbox
   ```
   That refreshes `amplify_outputs.json` so `npm run dev` keeps calling the deployed Lambda.

CDKToolkit must already exist in the region. Bootstrap it once from a Care-account admin role, not from Amplify Hosting. Ingenio Care keeps its own JWT users table — do not reuse the Growgent Amplify app or Cognito pool.

### Amplify secrets

| Secret | Purpose |
|---|---|
| `JWT_SECRET` | Signs Ingenio Care sessions |

Bedrock uses the Lambda IAM role (Claude Sonnet 4.5).

### Optional: EC2 instead of Lambda

`deploy/nginx-api.conf` and `deploy/ingenio-api.service` remain if you want Express on a VM with Postgres on the box. Prefer the Amplify Lambda path above.
