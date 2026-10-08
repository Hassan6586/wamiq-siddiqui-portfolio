# Wamiq Siddiqui — portfolio

Personal portfolio of **Wamiq Siddiqui**, Cloud & DevOps Engineer in Karachi.
Plain static site — `index.html`, `styles.css`, `main.js` — with no build step.

## What's on the page
- Hero with photo, typed role line and live counters
- About, services (what I can build), a commit-to-production pipeline that runs as you scroll
- Areas of expertise, experience timeline, education, contact
- Light and dark mode, mobile menu, scroll progress bar
- All animations switch off for visitors who prefer reduced motion

## Files
- `resume.pdf` — the CV offered by the "Download CV" buttons
- `img/` — profile photo (WebP with JPEG fallback, 480 and 800 px)
- `og-image.jpg` — preview image for WhatsApp, LinkedIn and other link shares

## Run locally
    python3 -m http.server 8000

## Deploy
- **Vercel:** Add New > Project > import this repo > Framework preset "Other" > Deploy.
- **GitHub Pages:** Settings > Pages > Deploy from branch > `main` / root.

After moving to a custom domain, set `og:image` in `index.html` to the full URL
(for example `https://example.com/og-image.jpg`) so link previews show the image.
