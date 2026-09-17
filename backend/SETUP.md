# 3rd Meridian submission backend

This is a small Cloudflare Worker + D1 backend. It stores names, work emails, optional phone numbers, messages, and submission timestamps. It does not send email.

## Current Cloudflare deployment

- Primary website and API: `https://3rdmeridiantech.com` (pending nameserver activation)
- Temporary fallback: `https://third-meridian-site.third-meridian.workers.dev`
- Worker: `third-meridian-site`
- D1 database: `third-meridian-submissions`
- Public form endpoint: `POST /api/contact`
- Region: APAC

The website and contact backend are now hosted entirely on Cloudflare. GitHub remains the source repository only; its Pages deployment workflows have been removed.

The custom domain is attached to the Worker. The remaining activation step is changing the GoDaddy nameservers to the two nameservers assigned by Cloudflare.

## Recreating the backend manually

1. Connect the Cloudflare account to Codex, or install Wrangler and log in to the Cloudflare account.
2. Copy `wrangler.toml.example` to `wrangler.toml`.
3. Create a D1 database named `third-meridian-submissions` and put its returned ID in `wrangler.toml`.
4. Run `wrangler d1 execute third-meridian-submissions --remote --file=schema.sql`.
5. Set the administrator secret: `wrangler secret put ADMIN_TOKEN`.
6. Set `ALLOWED_ORIGIN` to the final website origin.
7. Deploy with `wrangler deploy`. The website uses the same-origin endpoint `/api/contact`.

The public endpoint accepts only `POST /api/contact`. The private scaffold endpoint is `GET /api/submissions` with `Authorization: Bearer <ADMIN_TOKEN>`. Do not put the admin token in the website or a public repository. Production submissions can also be inspected directly through the authenticated Cloudflare connector.
