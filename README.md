# Wamiq Siddiqui — portfolio

Personal portfolio of **Wamiq Siddiqui**, DevOps / SysOps engineer in Karachi.
Plain static site: `index.html`, `styles.css`, `main.js`. No build step.

## Run locally
Open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

## Deploy
- **Vercel:** Add New > Project > import this repo > Framework preset "Other" > Deploy.
- **GitHub Pages:** Settings > Pages > Deploy from branch > `main` / root.

## Editing
All content lives in `index.html` and comes from his current CV.
Contact links use email and LinkedIn only; add a phone number or a downloadable
CV (`resume.pdf` plus a link in the hero) only if Wamiq wants them public.
After deploying to a custom domain, change `og:image` in `index.html` to the full URL
(for example `https://example.com/og-image.png`) so link previews show the image.
