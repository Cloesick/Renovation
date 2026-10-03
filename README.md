# Renovation

AI-assisted renovation quote wizard (service-business site). This is a [Next.js](https://nextjs.org) app bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

```bash
npm install
```

From the repository root run the development server with **npm**:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment variables

Create a `.env.local` file in the repository root with your keys (never commit it):

```ini
OPENAI_API_KEY=sk-...your-openai-key...
GEMINI_API_KEY=...your-gemini-key...
RESEND_API_KEY=...your-resend-key...   # used by /api/send-email
EMAIL_FROM=...
EMAIL_TO=...
```

Restart the dev server after changing env variables.

## Wizard flow

The `/wizard` page guides the user through a 4‑step flow:

- **Step 1 – Room selection**: choose which room to renovate (living room, kitchen, bathroom, ...).
- **Step 2 – Style selection**: choose the desired interior style.
- **Step 3 – AI inspiration images**:
  - Calls the backend `/api/generate` route to create a few inspirational views.
  - Shows a short explanation and a "Continue to details" button above the generated images.
  - Only moves to step 4 when the user explicitly confirms.
- **Step 4 – Contact & email draft**:
  - Collects name, email, approximate m², and optional notes.
  - Lets the user upload room photos, converts them to WebP client‑side, and offers download links.
  - Generates an editable email draft addressed to `info@costadelsolservices.com` (with `nicolas.cloet@gmail.com` as an optional CC in the text).
  - The user copies the draft into their own email client; **no automatic sending** is performed.

All wizard state is kept in the browser (sessionStorage) only; no persistent backend storage is used.

## Image generation API

The wizard calls a backend API to generate images based on the selected room and style:

- **Endpoint**: `POST /api/generate`
- **Provider**: OpenAI Images `gpt-image-1`.
- **Request**:
  - Calls `https://api.openai.com/v1/images/generations` with `model: "gpt-image-1"`, `n: 3`, and `size: "1024x1024"`.
  - Builds a simple prompt describing a photorealistic interior for the chosen room and style.
- **Response handling**:
  - Supports both `data[].url` and `data[].b64_json` from OpenAI.
  - `url` values are passed through directly; `b64_json` values are wrapped as `data:image/png;base64,...`.
  - Returns `{ images: string[] }` to the frontend.
  - If no usable images are returned, the route responds with `500` and `{ error: "Image generation returned no images" }` so the UI can show a clear error.

Make sure your OpenAI account is active, billed, and allowed to use `gpt-image-1`, and that `OPENAI_API_KEY` in `.env.local` matches a key that can successfully call the Images API.

## Repository layout: which app is deployed?

There are two app roots in this repo:

| Path | Status |
|------|--------|
| `app/` (repo root, root `package.json`) | **Deployed / canonical.** All recent work lives here: Next.js bumped to 16.0.10 because Vercel blocks the vulnerable 16.0.3 (`ab941c8`), lazy Resend init so `next build` works without the key (`0b70e66`), Linux-safe lockfile removal (`a04d1e1`), and the `/api/send-email` route. No `vercel.json`; the Vercel deploy fixes were all made to the root app, so Vercel builds from the repo root with Next.js auto-detected. |
| `renovation-app/` | **Legacy snapshot, not deployed.** It is a separate nested git clone of this same GitHub repo frozen at `a95c7c3` (2026-05-26), recorded in the parent only as a gitlink (no `.gitmodules`). It still pins Next 16.0.3, which Vercel refuses. Kept for reference only; do not develop here. |

Tests: Cypress specs in `cypress/` (`run-all-tests.ps1` runs the full set).

## Docker

The bundled `Dockerfile` / `docker-compose.yml` are a generic nginx static-file template and do **not** run the Next.js app (API routes need a Node runtime). For a container build of the real app use `next build && next start` on a Node 20 image instead.

```bash
docker-compose up --build   # static nginx template, port 8080
```

## License

MIT
