# Velobank

**A modern Nigerian digital bank — landing page, authentication flow, and full dashboard web app, built with plain HTML, CSS, and JavaScript.**

> Portfolio project by [Demmy.dev](https://codewithdemmy.netlify.app) · Built with no frameworks, no build tools, no dependencies.

---

## Live Demo

>https://velobankk.netlify.app/

---

## Screenshots

> Add screenshots of the landing page, dashboard, and mobile view here.

---

## About the Project

Velobank is a fictional Nigerian neobank concept built as a full portfolio piece. It simulates the complete experience of a digital banking product — from a polished public landing page through sign-up, login, and a feature-rich account dashboard — using only vanilla HTML, CSS, and JavaScript.

The design draws on real Nigerian fintech products like OPay and Kuda for context, with a custom design system built from scratch around a forest-green and coral palette.

---

## Features

### Public site
- **Landing page** — hero section with animated virtual card and live transaction ticker, features grid, card showcase, how-it-works steps, security section, and a signup CTA
- **About page** — mission, values, animated stats band, and team section
- **Contact page** — contact form with validation, support info cards, and an FAQ accordion
- **Legal pages** — standalone Terms of Service, Privacy Policy, and NDIC Notice, each with a sticky scrolling table of contents

### Authentication
- **Multi-step signup** — 3-step wizard (personal info → password with strength meter → NIN/BVN + selfie upload), with per-step validation
- **Login** — email/phone + password, remember me, forgot password link
- **Dynamic identity** — user's name, initials, and account number are stored in `localStorage` on signup and applied across every dashboard page automatically

### Dashboard (logged-in app)
- **Overview** — animated balance counter, virtual card with freeze toggle, quick-action modals (send, add money, pay bills), recent transactions, savings progress, and spending breakdown by category
- **Transactions** — full history grouped by date, with filter tabs (All / Money in / Money out / Bills) and live search
- **Beneficiaries** — saved recipients grid with search, send-money modal, add/remove beneficiary
- **Cards** — manage virtual and physical cards; reveal/mask card number and CVV; freeze/unfreeze toggle; daily spending limit slider
- **Savings** — multiple goals with animated progress bars; add money to a goal; create new goals with an icon picker
- **Settings** — tabbed layout: Profile (persisted to localStorage), Security (password change + 2FA toggle), Notifications (toggles), Danger zone (deactivate / close account)

### Additional pages
- **404 page** — branded "declined transaction" themed error page
- Fully responsive across all pages — mobile hamburger nav with quick links to every section of the site

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic) |
| Styling | CSS3 — custom properties, CSS Grid, Flexbox, clamp(), media queries |
| Behaviour | Vanilla JavaScript (ES6+) — no frameworks, no libraries |
| Fonts | Google Fonts — Fraunces, Sora, Space Mono |
| Storage | `localStorage` for user identity persistence |
| Deployment | Netlify (static hosting) |

---

## Project Structure

```
velobank/
│
├── index.html              # Landing page
├── about.html              # About us
├── contact.html            # Contact & FAQ
├── signup.html             # Multi-step registration
├── login.html              # Login
├── dashboard.html          # Main dashboard overview
├── transactions.html       # Full transaction history
├── beneficiaries.html      # Saved recipients
├── cards.html              # Card management
├── savings.html            # Savings goals
├── settings.html           # Account settings
├── terms.html              # Terms of Service
├── privacy.html            # Privacy Policy
├── ndic.html               # NDIC Notice
├── 404.html                # Error page
│
├── css/
│   ├── style.css           # Global design tokens, landing page, shared components
│   ├── auth.css            # Signup & login pages
│   ├── dashboard.css       # Dashboard shell & all inner pages
│   ├── about.css           # About page
│   ├── contact.css         # Contact page
│   ├── legal.css           # Terms, Privacy, NDIC pages
│   └── error.css           # 404 page
│
└── js/
    ├── script.js           # Shared: nav toggle, ticker, stat counters, landing CTA
    ├── user.js             # User identity (localStorage read/write, DOM injection)
    ├── auth.js             # Signup (multi-step, validation) & login
    ├── dashboard.js        # Overview: balance counter, transactions, spending, modals
    ├── transactions.js     # Transaction history: grouping, filters, search
    ├── beneficiaries.js    # Saved recipients: render, search, send, add/remove
    ├── cards.js            # Card management: reveal, freeze, sliders, order modal
    ├── savings.js          # Savings goals: render, add money, create goal
    ├── settings.js         # Settings tabs, profile save, password, danger zone
    ├── contact.js          # Contact form validation, FAQ accordion
    └── legal.js            # TOC scroll-spy for legal pages
```

---

## Getting Started

No installation, no build step, no npm — just open the files.

**Option 1 — Open directly in browser**
1. Download and extract the project zip
2. Open `index.html` in any modern browser

> For best results (correct font loading, JS module support), use Option 2.

**Option 2 — Live Server (recommended)**
1. Open the project folder in VS Code
2. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
3. Right-click `index.html` → **Open with Live Server**
4. The site opens at `http://127.0.0.1:5500`

---

## How the User Identity System Works

One of the interesting challenges of a pure HTML/CSS/JS project is making the dashboard feel personalised without a backend.

On **signup**, `js/user.js` saves the user's full name, email, phone, and a randomly generated 10-digit account number to `localStorage`. On every dashboard page load, the same script reads that data and injects it into the DOM — sidebar name, avatar initials, card holder name, account number, and greeting — replacing the placeholder HTML values.

On **logout or account closure**, the stored data is cleared so the next person who signs up starts fresh.

---

## Design Decisions

- **No frameworks** — built to demonstrate raw HTML/CSS/JS ability, not React or Vue knowledge
- **CSS custom properties** — all colours, fonts, spacing, and easing defined as variables in `:root` for consistency and easy theming
- **Mobile-first responsiveness** — every page is fully responsive; the dashboard sidebar collapses to an off-canvas menu on smaller screens
- **Nigerian context** — copy, currency (₦), bank names, NDIC insurance notice, and the NIN/BVN verification step all reflect the Nigerian banking landscape the product is built for

---

## Author

**Ademola Afolabi (Demmy)**
Frontend Developer ·· Software Developer ·· Computer Science Student ·· Wordpress Desginer·· Lagos, Nigeria.


- Portfolio: [codewithdemmy.netlify.app](https://codewithdemmy.netlify.app)
- Brand: **Demmy.dev**

---

## License

This project is for portfolio and demonstration purposes. Feel free to use it as a reference or starting point, with credit.
