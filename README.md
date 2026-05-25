# KIKANDIDAT

Statische Website von KIKANDIDAT, deployed über Vercel.

## Deployment

- Hosting: Vercel (statisches Site-Output, kein Build-Step nötig)
- Produktion: deployed automatisch bei Push auf `main`

## Lokal entwickeln

Jeder einfache statische Webserver reicht:

```bash
npx serve .
# oder
python3 -m http.server 8080
```

## Struktur

- `index.html`, `about.html`, `kontakt.html`, `karriere.html` … – Seiten
- `branche-*.html` – Branchen-Landingpages
- `assets/` – Bilder, Logos, Icons
- `styles/` – CSS-Dateien
- `js/` – JavaScript
- `uploads/` – User-Uploads / Screenshots
- `vercel.json` – Routing & Caching-Header
