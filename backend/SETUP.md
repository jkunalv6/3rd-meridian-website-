# 3rd Meridian submission backend

This is a small Cloudflare Worker + D1 backend. It stores names, work emails, optional phone numbers, messages, and submission timestamps. It does not send email.

## Setup after the Cloudflare connector and domain are available

1. Connect the Cloudflare account to Codex, or install Wrangler and log in to the Cloudflare account.
2. Copy `wrangler.toml.example` to `wrangler.toml`.
3. Create a D1 database named `third-meridian-submissions` and put its returned ID in `wrangler.toml`.
4. Run `wrangler d1 execute third-meridian-submissions --remote --file=schema.sql`.
5. Set the administrator secret: `wrangler secret put ADMIN_TOKEN`.
6. Set `ALLOWED_ORIGIN` to the final website origin.
7. Deploy with `wrangler deploy` and copy the Worker URL into `CONTACT_ENDPOINT` in the website `script.js`.

The public endpoint accepts only `POST /contact`. The private endpoint is `GET /submissions` with `Authorization: Bearer <ADMIN_TOKEN>`. Do not put the admin token in the website or a public repository. A simple private admin page can be added after the first deployment, or submissions can initially be viewed with Wrangler.
