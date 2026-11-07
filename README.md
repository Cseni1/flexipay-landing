# FlexiPay landing

Source of the marketing site served at **https://getflexipay.app** (Hostinger, static).

Plain HTML/CSS/JS: no build step, no npm, no database, no API keys.

| File | Role |
| --- | --- |
| `index.html` | marketing page |
| `privacy.html`, `terms.html` | website policies |
| `assets/styles.css`, `assets/app.js` | styling and small interactions |
| `assets/display.woff2`, `assets/body.woff2` | self-hosted fonts (Bricolage Grotesque, DM Sans), licences in `assets/LICENSE-*.txt` |
| `assets/favicon.svg`, `assets/social.png` | browser and sharing artwork |
| `robots.txt`, `sitemap.xml` | search engine basics |
| `.htaccess` | hides repo-only files (README, `.github`) from visitors |

The header shows `logo.png` when one sits next to `index.html`; otherwise a styled text mark is shown. There is no `logo.png` yet.

## How changes go live

1. Create a branch, make the change, open a pull request into `main`.
2. CI checks that every local link and asset exists.
3. Merge the pull request. Hostinger auto-deploys `main` to getflexipay.app on every push.

Direct pushes to `main` are blocked: every change goes through a pull request.

## Content rules

The site is an early-access marketing site, not a live payment application. No invented testimonials, live integrations, country coverage, transaction speeds or savings claims. No analytics or third-party tracking scripts; if any are added, update `privacy.html`.

Enquiries go to hello@getflexipay.app. The early-access form opens the visitor's email app with a draft; it does not store leads.

## Deployment

Hostinger watches `main` of this repo (Git auto-deployment on getflexipay.app, connected 7 Nov 2026). The server copy is replaced on every push to `main`, so never edit files in Hostinger's file manager: the next merge would overwrite them.
