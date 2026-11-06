# Bibi Souza · Code. Community. Connection.

Personal portfolio for Bibiana Souza: software engineering, developer education, open source, and community leadership.

Buildless, responsive HTML/CSS/JavaScript. Served by GitHub Pages at https://bibi.community/.

## Preview

Run `python -m http.server 8086` in this directory and open http://localhost:8086/.

## Content and motion

Case study and About content lives in `app.js`. Page layout is in `index.html`; theme and responsive styling are in `styles.css`.

The original cartoon hero is `assets/bibi-hero.png`. SVG clips separate loose hair strands and three leaves. Each piece rotates gently around its root; there are no displacement, turbulence or warping filters. A short gust starts shortly after load and repeats every 12 seconds with a quiet interval. The face, body, laptop and plant pot stay still. Reduced-motion preferences are respected; the footer control can explicitly enable or pause the breeze. Animation pauses while the hero is offscreen or the tab is hidden.

The GitHub panel uses a dated public contribution snapshot in `assets/contributions.json`. It never presents a decorative fallback as live account data.

The pink rabbit favicon is `assets/rabbit.svg`. `CNAME` preserves the custom domain.
