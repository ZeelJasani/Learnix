# Admin route /session cookie issue — diagnosis & fix

Short summary

- Symptom: Accessing `/admin` in production redirected to `/login` even when a user appeared signed in (logs showed `/admin` returning 307 → `/login`).
- Root cause: middleware's session presence check was fragile and sometimes missed the session cookie. It relied only on `request.cookies.get(...)`, which can miss cookie names containing dots or encoded forms in certain runtimes/environments.
- Fix applied: `middleware.ts` updated to fall back to inspecting the raw `Cookie` header for candidate cookie names (`session`, `better-auth.session`, `better-auth.session_token`).

Files involved

- `middleware.ts` — route matcher and session guard. Updated to do a two-step session check (cookies API then raw header fallback).
- `lib/auth.ts` — authentication setup (Better Auth). Used for reference; the cookie names are produced by this auth layer.
- `app/api/security/route.ts` — bot/security API that middleware calls for allowed checks (not the root cause here).
- `app/api/debug/session/route.ts` — debug endpoint that returns parsed cookies and server-side session; useful for runtime verification.

Why this happened

- Some cookie names include dots (for example `better-auth.session`) or become URL-encoded when sent, and the Next/Edge `request.cookies` helper may not always surface them depending on the environment/runtime or framework version. When `request.cookies.get(...)` returns no cookie, middleware concluded the user had no session and redirected to `/login`.

What I changed (concise)

- `hasSessionCookie(request)` in `middleware.ts` now:
  1. Checks `request.cookies.get()` for the common session keys.
  2. If none are found, reads the raw `Cookie` header (`request.headers.get('cookie')`) and looks for either the plain or URL-encoded cookie keys.

This prevents false negatives where a cookie exists in the header but isn't visible via the cookies API.

How to confirm on production

1. While logged in in your browser, visit the debug endpoint (recommended):

   Open in a browser (while authenticated):
   https://mastrji.vercel.app/api/debug/session

   What it shows:
   - `cookies`: list (split) of the raw cookie header values
   - any of the candidate cookie keys present (the debug route adds these keys if detected)
   - `session`: result of `auth.api.getSession({ headers })` (server-side session) or error

2. Inspect cookies in Chrome/Firefox DevTools (Application → Cookies) for `mastrji.vercel.app` and verify exact cookie name, domain, path, HttpOnly, Secure, SameSite.

3. If the Cookie header contains the session cookie but middleware still redirected earlier, the fallback header parsing resolves the issue.

Quick PowerShell checks (optional)

- Fetch debug endpoint (public, but run in the browser while logged in for accurate server-side `auth.api.getSession` result):

```powershell
# Simple GET (works from your local machine but won't have your browser's cookies)
Invoke-RestMethod -Uri 'https://mastrji.vercel.app/api/debug/session'
```

- If you want to simulate a request with a cookie header from PowerShell (replace the cookie value):

```powershell
$headers = @{ Cookie = 'session=REPLACE_WITH_COOKIE_VALUE' }
Invoke-RestMethod -Uri 'https://mastrji.vercel.app/api/debug/session' -Headers $headers
```

Recommended next steps

1. Confirm via the `api/debug/session` endpoint which cookie name is actually sent by the browser and whether `auth.api.getSession` returns a session.
2. Keep the fallback header-parsing in `middleware.ts` (already added) — it's a safe, low-risk improvement.
3. (Optional, more robust) Replace or augment the cookie-presence check in middleware by calling the auth server-side session helper directly (for example, `auth.api.getSession({ headers: request.headers })`) in the middleware for protected routes. This avoids guessing cookie names and uses the auth library's session verification. Note: importing `auth` into middleware can increase the middleware bundle size and startup time, so gauge tradeoffs.
4. Add a short-lived, env-gated debug log in `middleware.ts` (only when `DEBUG_COOKIE=1`) to log `request.headers.get('cookie')` for `/admin` requests. That lets you inspect production logs without always printing cookies.

If you'd like, I can implement either of these next steps now:
- add the env-gated debug log to `middleware.ts`, or
- modify middleware to call `auth.api.getSession({ headers })` before redirecting (I'll keep it env-gated or limited to admin routes to avoid performance regressions).

Notes & caveats

- The fallback check reads the raw header and does a substring match for `key=` and encoded variants. It doesn't parse the cookie value or validate the session contents — it only detects presence. Full validation should be done via the auth library/server-side session check when possible.
- Don't leave verbose cookie logging enabled permanently in production; prefer an env var gate to avoid leaking sensitive data in logs.

Status: change applied to `middleware.ts` in this repository. Please tell me which follow-up you'd like me to implement next (add debug logging, switch to server-side session validation in middleware, or something else).