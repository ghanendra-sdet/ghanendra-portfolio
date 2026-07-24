# Ghanendra Yadav — QA Automation Engineer Portfolio

A personal portfolio website for **Ghanendra Yadav**, Senior QA Automation Engineer with 8.1+ years of experience in Playwright, API Testing, AI-Driven Testing, and Performance Testing across Fintech, Healthcare, and Travel domains.

## Live Sections

- **About** — Professional background, career goals, and domain expertise
- **Skills** — Manual Testing, Automation, API, Performance, AI-Driven Testing, Tools & Platforms
- **Experience** — Career timeline across Paywize, Sixaxis Technology, BJSHUB, and NIT Warangal
- **Projects** — 11 individual case-study pages (Collection Engine, Payout Engine, Connected Banking, BBPS, Reseller Management, AI Dispute Resolution Engine, YOBO, Healthcare Claim Insurance, Travel Marketplace, HRMS, LMS), each with its own `/projects/<slug>/` page, clickable employer link, and GitHub repository link
- **Education** — MCA from NIT Warangal; B.Sc. from Bundelkhand University
- **Awards** — NCC, Bharat Scouts & Guides, Art of Living, and academic recognitions
- **Testimonials** — Feedback from managers and team leads
- **Contact** — Email, phone, LinkedIn, and contact form

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- Google Fonts (Inter)
- Particle canvas animation
- Intersection Observer for scroll reveals
- Dark/Light mode with `localStorage` persistence

## Project Structure

```
Ghanendra-Portfolio/
├── index.html       # Main HTML file (single-page site, includes Key Projects grid)
├── style.css        # Stylesheet (includes shared project-detail-page styles)
├── script.js        # JavaScript (animations, theme toggle, typing effect)
├── assets/
│   ├── profile.jpg               # Profile photo
│   └── Ghanendra_Yadav_Resume.pdf  # Downloadable resume
└── projects/         # One folder per case-study page, each served at /projects/<slug>/
    ├── fintech-collection-engine/index.html
    ├── fintech-payout-engine/index.html
    ├── fintech-connected-banking/index.html
    ├── bbps-bill-payment/index.html
    ├── reseller-management/index.html
    ├── ai-dispute-resolution-engine/index.html
    ├── yobo/index.html
    ├── healthcare-insurance/index.html
    ├── travel-marketplace/index.html
    ├── hrms/index.html
    └── lms/index.html
```

## Deployment

- Ready to host as a static website.
- Ideal for GitHub Pages: push the repository to GitHub and set the repository source to `main` or `gh-pages`.
- No build step needed — the site works directly from `index.html`.

## Features

- Responsive design (mobile, tablet, desktop)
- Dark/Light theme toggle with system preference detection
- Animated particle background on hero section
- Typing effect tagline animation
- Animated skill progress bars
- Scroll-reveal animations
- Testimonial carousel with dot navigation
- Back-to-top button
- Resume download button

## Getting Started

No build step required. Open `index.html` directly in a browser, or serve with any static file server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080` in your browser.