---
agent: 'agent'
---

You have an existing Node.js + Express web app. I want to deploy it on Netlify using Netlify Functions, following Netlify’s official Express guide: wrap Express with `serverless-http`, move the Express app into a serverless function, configure `netlify.toml`, and add rewrite/redirect rules so API routes work.

TASKS:
1. Refactor the project so the Express app can run both locally and on Netlify:
   - Create `app.js` (or `src/app.js`) that exports the Express `app` WITHOUT calling `app.listen`.
   - Keep middleware, routes, error handling in this exported `app`.
   - Keep local dev entry (e.g. `server.js`) that imports the exported `app` and calls `app.listen(PORT)` for local running.

2. Add a Netlify Function wrapper:
   - Create a function file at `netlify/functions/api.js` (or `functions/api.js` if that matches current structure).
   - Use `serverless-http` to export a handler:
     `const serverless = require("serverless-http");`
     `const app = require("../../app");`
     `exports.handler = serverless(app);`
   - Ensure the require path is correct for my folder structure.

3. Configure Netlify routing:
   - Add/modify `netlify.toml`:
     - Set `[build]` with a suitable `command` (e.g. `npm run build` if needed; otherwise `npm run netlify-build` or `npm ci` is handled by Netlify).
     - Set `publish` to my static folder if I have one (e.g. `public` or `dist`). If this is API-only, use a minimal publish dir like `public` with a placeholder index.html.
     - Set `functions = "netlify/functions"` (or whichever folder we used).
   - Add redirects so requests to `/api/*` are routed to the function:
     In `netlify.toml`, add:
       [[redirects]]
       from = "/api/*"
       to = "/.netlify/functions/api/:splat"
       status = 200
   - If my app is a single-page app, also add a fallback redirect for client routing:
       [[redirects]]
       from = "/*"
       to = "/index.html"
       status = 200
     (Only if applicable—don’t break existing server-side routes.)

4. Update package scripts and dependencies:
   - Add `serverless-http` dependency.
   - Keep Express as dependency.
   - Add scripts:
     - "dev": run local server (nodemon optional)
     - "start": local start
     - "netlify:dev": `netlify dev` (if netlify-cli is used)
   - Ensure Node version is compatible (optionally add `.nvmrc` or `engines.node`).

5. Ensure paths and exports are correct:
   - Do not use ES modules unless the repo already does.
   - Confirm the function handler is exporting correctly for Netlify (CommonJS exports.handler).
   - Make sure JSON/body parsing works inside the serverless environment.

6. Provide a concise final checklist:
   - Which files were created/changed
   - How to run locally
   - How to test via `netlify dev`
   - What endpoint URL will be in production (/.netlify/functions/api or /api)

OUTPUT:
- Implement the changes directly in the repo code.
- Show the final contents of: `app.js`, `server.js` (or equivalent), `netlify/functions/api.js`, and `netlify.toml`.
- If my repo structure differs, adapt paths accordingly and explain what you assumed.
