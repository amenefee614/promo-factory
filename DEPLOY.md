# Deploy Promo Factory to Railway

Get a live shareable URL in about 10 minutes.

## Prerequisites

- A Railway account (https://railway.com)
- An OpenRouter API key (https://openrouter.ai/keys)
- This repo pushed to GitHub

## Step-by-Step

### 1. Create a new Railway project

Go to https://railway.com/new and click **Deploy from GitHub repo**. Select your Promo Factory repo.

### 2. Add a MySQL database

In your Railway project dashboard, click **+ New** → **Database** → **MySQL**.

Railway will automatically create a `DATABASE_URL` variable and link it to your app service.

### 3. Set environment variables

Click on your app service → **Variables** tab → **New Variable**, and add:

| Variable | Value |
|---|---|
| `BUILT_IN_FORGE_API_URL` | `https://openrouter.ai/api` |
| `BUILT_IN_FORGE_API_KEY` | Your OpenRouter API key (starts with `sk-or-`) |
| `LLM_MODEL` | `google/gemini-2.5-flash` (or any model from openrouter.ai/models) |
| `JWT_SECRET` | Any random string (e.g. `my-super-secret-jwt-key-2024`) |
| `NODE_ENV` | `production` |

**Note:** `DATABASE_URL` and `PORT` are set automatically by Railway. Do not add them manually.

### 4. Deploy

Railway auto-deploys when you push to GitHub. The build takes 3-5 minutes:

1. Installs dependencies (pnpm)
2. Exports the Expo web build (static HTML/JS/CSS)
3. Bundles the Express API server
4. Runs database migrations on startup
5. Starts serving everything on one port

### 5. Get your URL

Once deployed, click **Settings** → **Networking** → **Generate Domain**.

Railway gives you a URL like `promo-factory-production.up.railway.app`. Share it with anyone.

## What works in the demo

- All 5 tabs: Dashboard, Create, Assets, Analytics, Assistant
- AI-powered promo assistant (uses your OpenRouter key)
- AI content generation from the Create screen
- Analytics with interactive bar charts
- Template browser with 21 templates across 6 industries
- Full glassmorphism UI with animations
- PWA installable on Android/desktop

## Cost

- **Railway**: Free tier gives you 500 hours/month + $5 credit. More than enough for a demo.
- **OpenRouter**: Pay-per-use. Gemini 2.5 Flash costs ~$0.15 per million tokens. A typical chat costs fractions of a penny.
- **MySQL on Railway**: Included in free tier.

## Troubleshooting

**App shows blank page:** Check Railway build logs. Make sure `expo export` succeeded.

**AI assistant not responding:** Verify `BUILT_IN_FORGE_API_KEY` is set and valid. Check Railway logs for LLM errors.

**Database errors:** Make sure the MySQL plugin is linked to your service. The `DATABASE_URL` should appear in your service variables automatically.

**To use a different LLM model:** Change `LLM_MODEL` to any OpenRouter-supported model. Popular options:
- `google/gemini-2.5-flash` (fast, cheap)
- `anthropic/claude-sonnet-4` (high quality)
- `openai/gpt-4o-mini` (good balance)
