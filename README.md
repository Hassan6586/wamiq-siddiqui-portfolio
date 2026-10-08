# Wamiq Siddiqui — Cloud & DevOps Engineer

Portfolio website. Plain static site, no build step.

| File | What it is |
| --- | --- |
| `index.html` | The portfolio page |
| `styles.css` | Styles (light and dark mode) |
| `main.js` | Theme toggle, mobile menu, active section in the nav |
| `resume.pdf` | The CV behind the "Download CV" buttons |
| `cv.html` | Source of `resume.pdf` |

## Run locally

    python3 -m http.server 8000

## Deploy
- **GitHub Pages:** Settings > Pages > Deploy from a branch > `main`, `/ (root)`.
- **Vercel:** Add New > Project > import this repo > Framework preset "Other" > Deploy.

## Updating the CV
Edit `cv.html`, open it in Chrome, press Ctrl+P, choose "Save as PDF" (A4, margins "Default",
background graphics on) and save over `resume.pdf`.

## Notes
- After connecting a custom domain, change `og:image` in `index.html` to the full URL
  (for example `https://wamiq.dev/og-image.png`) so WhatsApp and LinkedIn previews show the image.
