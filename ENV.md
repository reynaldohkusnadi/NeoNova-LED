## Email Delivery (Story 4.3)

Set these in Vercel Encrypted Environment Variables. Provide values for both Preview and Production.

- `RESEND_API_KEY`: API key for Resend (preferred). Leave unset to force SMTP path.
- `SALES_EMAIL`: Destination inbox for leads (e.g., `sales@example.com`).
- `SMTP_HOST`: SMTP server (fallback).
- `SMTP_PORT`: SMTP port (465 for SSL, 587 for STARTTLS).
- `SMTP_USER`: SMTP username (often full email address).
- `SMTP_PASS`: SMTP password.

Notes:
- Server Action `submitLead` reads these only server-side; nothing is exposed to client bundles.
- If Resend fails or is not configured, SMTP will be attempted when all `SMTP_*` are present.
# Environment Variables

Store all secrets in Vercel Encrypted Env Vars. Separate values for Preview vs Production.

- NEXT*PUBLIC*\*: safe public flags
- Private keys: store only in Vercel

Local development uses `.env.local` (not committed).

Example:

```
# app config
NEXT_PUBLIC_ENV=local
```
