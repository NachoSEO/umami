# Ops

Self-hosted Umami for all of Nacho's websites. Fork of `umami-software/umami`; everything custom lives in `ops/` so syncing with upstream never conflicts.

- **Hosting:** Vercel (app) + Neon Postgres (free tiers).
- **Environment (Vercel):** `DATABASE_URL` (Neon), `APP_SECRET` (random string). Never commit them.
- **First login:** `admin` / `umami`. Change the password right after the first deploy.
- **Update Umami:** "Sync fork" on GitHub (or `git fetch upstream && git merge upstream/master`); Vercel redeploys.
- **Add a website:** `UMAMI_URL=… UMAMI_USER=… UMAMI_PASSWORD=… node ops/add-website.mjs "Name" example.com`. It prints the `<script>` tag to paste in that site, and is safe to rerun.
