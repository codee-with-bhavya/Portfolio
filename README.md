# Bhavya Goyal — Developer Portfolio

A simple, lightweight portfolio built with vanilla HTML and CSS. No frameworks, no build step.

## Contact & Links

- **Name**: Bhavya Goyal
- **University**: J.C. Bose University of Science and Technology (CS)
- **GitHub**: https://github.com/codee-with-bhavya
- **Musify Repo**: https://github.com/codee-with-bhavya/Musify
- **LinkedIn**: https://www.linkedin.com/in/bhavya-goyal-053587287/
- **Email**: bhavayagoyal07@gmail.com

## Structure

```
portfolio/
├── index.html          # Content and semantics
├── css/
│   └── styles.css      # Dark warm theme, serif headings, animations
├── js/
│   └── main.js         # Scroll progress, scrollspy, reveal on scroll
├── assets/
│   ├── favicon.svg     # Favicon
│   └── images/         # Project screenshots and assets
└── README.md
```

No frameworks or build step. JavaScript is progressive enhancement only — the page works with it disabled.

## How to View Locally

Open `index.html` directly in a browser, or serve the folder:

```powershell
python -m http.server 3000
```

Then visit `http://localhost:3000`.

## How to Deploy to GitHub Pages

This is static HTML/CSS, so it can be hosted for free on GitHub Pages:

```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/codee-with-bhavya/<your-repo-name>.git
git push -u origin main
```

Then in the repository: **Settings → Pages → Deploy from a branch** → select `main` / `/(root)` → **Save**.