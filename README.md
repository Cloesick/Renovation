This is a [Next.js](https://nextjs.org) app bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

From the `renovation-app` folder run the development server with **npm**:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment variables

Create a `.env.local` file in the `renovation-app` folder with your keys:

```ini
OPENAI_API_KEY=sk-...your-openai-key...
GEMINI_API_KEY=...your-gemini-key...
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
