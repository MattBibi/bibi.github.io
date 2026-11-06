# Bibi Souza · Code. Community. Connection.

Personal portfolio for Bibiana Souza: software engineering, developer education, open source, and community leadership.

Buildless, responsive HTML/CSS/JavaScript. Served by GitHub Pages at https://bibi.community/.

## Preview

Run `python -m http.server 8086` in this directory and open http://localhost:8086/.

## Content and motion

Case study and About content lives in `app.js`. Page layout is in `index.html`; theme and responsive styling are in `styles.css`.

The original cartoon hero is `assets/bibi-hero.png`. SVG clips separate three loose hair sections and five leaves. Each piece rotates gently around its root; there are no displacement, turbulence or warping filters. The hair and leaves sway continuously at the same gentle strength. Separate eye clips create a brief 230 ms blink at randomized intervals, with a faster close and softer reopen. The rest of the face, body, laptop and plant pot stay still. Reduced-motion preferences are respected; the footer control can explicitly enable or pause all motion. Animation pauses while the hero is offscreen or the tab is hidden.

The GitHub panel uses verified public contribution counts in `assets/contributions.json`, refreshed daily by `.github/workflows/refresh-contributions.yml`. `scripts/update_contributions.py` reads the public GitHub calendar and preserves the previous snapshot if the source is incomplete. Count/date tooltips work with a mouse, touch, and arrow-key navigation. Run `python -m unittest discover -s scripts -p test_contributions.py` to verify the parser.

Community event photos are in `assets/*.webp` and appear in the community case-study gallery. Popup styles are in `polish.css`; the gallery and popup behavior live in `app.js`, and the contribution grid in `contributions.js`. External links open in new tabs.

The pink rabbit favicon is `assets/rabbit.svg`. `CNAME` preserves the custom domain.
