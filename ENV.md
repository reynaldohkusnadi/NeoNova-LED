# Environment Variables

Store all secrets in Vercel Encrypted Env Vars. Separate values for Preview vs Production.

- NEXT_PUBLIC_*: safe public flags
- Private keys: store only in Vercel

Local development uses `.env.local` (not committed).

Example:

```
# app config
NEXT_PUBLIC_ENV=local
```


