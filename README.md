# Bogdan Petrenko — Portfolio

A responsive personal portfolio landing page for **Bogdan Petrenko**, Full-Stack Developer & Bot Engineer. Built from scratch with semantic HTML, modern CSS, and TypeScript — no frameworks, no build bloat.

## Features

- Fully responsive layout (mobile, tablet, desktop)
- Animated aurora gradient background and glassmorphism cards
- Sticky navigation with a mobile burger menu
- Scroll-triggered reveal animations via `IntersectionObserver`
- Interactive project/skill cards with a pointer-follow glow
- Working contact form powered by Web3Forms
- SEO-ready: meta tags, Open Graph preview, and inline SVG favicon

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties, grid, flexbox, animations
- **TypeScript** — typed, compiled to vanilla JavaScript
- **Web3Forms** — serverless contact form handling

## Project Structure

```
portfolio/
├── index.html        # Page markup
├── css/
│   └── styles.css    # All styling
├── src/
│   └── main.ts       # TypeScript source
├── js/
│   └── main.js       # Compiled output (referenced by index.html)
├── package.json
└── tsconfig.json
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/dyrachyo812/portfolio.git
cd portfolio
```

Open `index.html` directly in your browser, or serve it locally with any static server.

## Development

Install dependencies:

```bash
npm install
```

Compile TypeScript once:

```bash
npm run build
```

Or watch for changes during development:

```bash
npm run dev
```

The compiled JavaScript is emitted to the `js/` folder, which `index.html` loads.

## Contact Form Setup

The contact form uses [Web3Forms](https://web3forms.com). To enable it, get a free access key and replace the placeholder in `index.html`:

```html
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" />
```

## Contact

- **Email:** bubo4ka764@gmail.com
- **GitHub:** [@dyrachyo812](https://github.com/dyrachyo812)
