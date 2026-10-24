---
'@open-slide/core': minor
---

Run inside a host that ships its own runtime, such as the slidez desktop app: deck imports fall back to core's own install when the project has no node_modules, and `OPEN_SLIDE_BIN` points publishing at the host's CLI. The publish dialog can now log in to Vercel itself: it starts `vercel login`, shows the code, links to the confirmation page and connects once the login lands, so nobody needs a terminal.
