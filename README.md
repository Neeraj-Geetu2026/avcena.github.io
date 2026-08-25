# AVCENA Gardening & Lawnmowing

A responsive React + Vite website starter for an Auckland gardening and lawn-mowing business.

## Run locally

1. Install Node.js (LTS).
2. Open this folder in VS Code.
3. Run:

```bash
npm install
npm start
```

4. Open `http://localhost:5173`.

## Publish at `avcena.github.io`

1. Create a GitHub account named `avcena` if you do not already have one.
2. Create a public repository named exactly `avcena.github.io`.
3. Upload this project and push the `main` branch.
4. In the repository, open **Settings > Pages** and set **Source** to **GitHub Actions**.
5. Wait for the workflow to finish. The site will be available at `https://avcena.github.io`.

GitHub Pages hosts the frontend only. The quote form currently needs the local `server.mjs` backend and Resend configuration, so it will not send enquiries from the public Pages URL until the API is hosted separately. Phone and email links will continue to work.

## Configure contact details

Create a `.env.local` file in the project root and set:

```env
VITE_CONTACT_EMAIL=Neerajchauhangvr@gmail.com
VITE_CONTACT_PHONE=021 081 31690
VITE_AUTO_REPLY=Thanks for your interest in AVCENA Gardening & Lawnmowing. We will contact you shortly.
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=AVCENA <noreply@your-verified-domain.com>
```

Restart the development server after changing these values. `npm start` runs both the website and email server together. The server sends full enquiries to `VITE_CONTACT_EMAIL` and a separate reply containing only `VITE_AUTO_REPLY` to the customer. `RESEND_FROM_EMAIL` must use a verified Resend domain.

The current frontend has no secure admin account or database. A live admin page for changing the reply and publishing offers requires a backend with authentication and storage; changing `.env.local` is the available configuration method until that backend is added.

## Before going live

Replace:
- service areas
- placeholder review
- placeholder gallery cards
- generated design image with your real business photos

The quote form is currently a front-end demo. Connect it to your ASP.NET Core API/email service before production.
