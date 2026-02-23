# Ursula Ushiko | Original Fine Art

A contemporary art gallery website showcasing the original paintings and collages of Ursula Ushiko. Features the artist's series from [Daily Paintworks](https://www.dailypaintworks.com/artists/ursula-ushiko-8267): Swirl, Bug, Isolation, Umami, Beatbox, Abstract, Nature, and Collage.

## Features

- **Gallery** – Browse works by series with filtering
- **Series** – Swirl, Bug, Isolation, Umami, Beatbox, Abstract, Nature, Collage
- **Admin Panel** – Add, edit, and manage paintings (protected)
- **Shopping Cart** – Add paintings to cart for purchase inquiry
- **Responsive** – Built for desktop and mobile

## Tech Stack

- [Next.js 16](https://nextjs.org/) with App Router
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- Turso (libSQL) for painting data — serverless SQLite
- Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Access

- **URL**: `/admin` or `/admin/login`
- **Default credentials**: `admin` / `admin123`
- Change the default password in production.

### Database (Turso)

The app uses [Turso](https://turso.tech/) for persistence. Create a `.env.local` with your Turso credentials:

```bash
cp .env.example .env.local
# Edit .env.local and add your TURSO_DATABASE_URL and TURSO_AUTH_TOKEN
```

Get your values from Turso:
- `turso db show ursula-gallery --url` → `TURSO_DATABASE_URL`
- `turso db tokens create ursula-gallery` → `TURSO_AUTH_TOKEN`

The app seeds sample paintings and an admin user on first run.

### Images

Replace placeholder images in `public/images/` with your actual artwork. Add `painting-1.jpg`, `painting-2.jpg`, etc., or update the seed data in `lib/seed.ts` to use your image paths. The [Daily Paintworks gallery](https://www.dailypaintworks.com/artists/ursula-ushiko-8267) currently shows 0 items, so images must be added manually from your files.

## Deploying to Vercel

### 1. Push to Git

If not already, create a repo and push:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/ursula.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account)
2. Click **Add New…** → **Project**
3. Import your GitHub/GitLab/Bitbucket repo
4. Vercel will auto-detect Next.js — leave the defaults and click **Deploy** (it will fail until env vars are set)

### 3. Environment Variables

In your Vercel project: **Settings** → **Environment Variables**. Add:

| Variable | Description |
|----------|-------------|
| `TURSO_DATABASE_URL` | Turso database URL (`turso db show ursula-gallery --url`) |
| `TURSO_AUTH_TOKEN` | Turso auth token (`turso db tokens create ursula-gallery`) |
| `NEXT_PUBLIC_PAYPAL_EMAIL` | PayPal email for checkout |
| `NEXT_PUBLIC_APP_URL` | Your production URL, e.g. `https://ursula-gallery.vercel.app` (needed for PayPal IPN webhook) |

Apply to **Production** (and Preview if you want).

### 4. Redeploy

After saving env vars, go to **Deployments** → click the **⋯** on the latest deploy → **Redeploy**.

### 5. Optional: Custom Domain

In **Settings** → **Domains**, add your domain. If you use a custom domain, set `NEXT_PUBLIC_APP_URL` to that URL (e.g. `https://ursula-ushiko.com`) so the PayPal IPN webhook uses the correct base URL.

## Project Structure

```
ursula/
├── app/
│   ├── api/          # API routes (paintings, auth, admin)
│   ├── admin/        # Admin panel & login
│   ├── layout.tsx
│   └── page.tsx
├── components/       # UI components
├── lib/              # Database, seed, utilities
├── public/
│   └── images/       # Painting images
└── .env.local        # Turso credentials (see .env.example)
```

## Artist

**Ursula Ushiko** — Based in Berlin and San Francisco. Former Interior Design + Architecture professional (Square One Interiors, San Francisco). Travel impressions translated into abstract art, collage, and painting. Currently focused on small formats and collage.

- [Daily Paintworks Gallery](https://www.dailypaintworks.com/artists/ursula-ushiko-8267)
- [Artist Bio](https://www.dailypaintworks.com/artists/ursula-ushiko-8267/bio)

## Scripts

| Command    | Description                |
|-----------|----------------------------|
| `pnpm dev`  | Start dev server (Turbopack) |
| `pnpm build`| Build for production      |
| `pnpm start`| Start production server   |
| `pnpm lint` | Run ESLint               |

## License

Private. All artwork © Ursula Ushiko. All rights reserved.
