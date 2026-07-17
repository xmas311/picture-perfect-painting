# Picture Perfect Painting — Website

The website for **Picture Perfect Painting, LLC** (Tumwater, WA) —
[pictureperfectpainting360.com](https://pictureperfectpainting360.com).

Plain HTML + CSS + a small amount of vanilla JavaScript. No frameworks, no
build step, no platform lock-in — the whole site is just files you can host
anywhere.

---

## Project structure

```
picture-perfect-painting/
├── index.html          Home
├── about.html          About / our story
├── services.html       Service details (anchors: #interior-painting, etc.)
├── gallery.html        Filterable photo gallery with lightbox
├── contact.html        Contact info + estimate form (Formspree)
├── thank-you.html      Optional post-submit page
├── 404.html            Branded "page not found" (wired up via .htaccess)
├── robots.txt          Search engine rules
├── sitemap.xml         Page list for search engines
├── .htaccess           Server config for Hostinger (404 page, caching)
├── css/style.css       ALL styling — colors/fonts are variables at the top
├── js/main.js          Mobile nav, gallery, contact form
└── images/
    ├── branding/       favicon, og-image (social preview), apple-touch-icon
    ├── hero/           homepage hero photo
    ├── about/          about-page photo
    ├── services/       one photo per service
    └── gallery/        project photos, one folder per category
        ├── interior/
        ├── exterior/
        ├── cabinets/
        └── carpentry/
```

**A note on the repeated header/footer:** because this is plain HTML with no
templating, the header and footer are copied into every page. That's a
deliberate tradeoff for simplicity. When you edit the header or footer,
make the same edit in all 7 HTML files (each block is marked with a
`keep identical across all pages` comment). If that ever gets annoying,
a static site generator like Astro or Eleventy solves it — happy problem
for later.

## Day-to-day editing workflow

1. Open the project folder in **VS Code**.
2. Preview with the **Live Server** extension (right-click `index.html` →
   "Open with Live Server").
3. Make changes, check them in the browser (try a phone-sized window too —
   in Chrome/Edge press F12 then Ctrl+Shift+M to toggle device mode).
4. Commit working changes:
   ```
   git add -A
   git commit -m "Describe what you changed"
   git push
   ```
5. Deploy to Hostinger (see below).

Never edit files directly on Hostinger — edit locally, commit, then deploy.

## ⚠️ One-time setup still needed

**Photos** — every image under `images/` is a labeled SVG placeholder.
The site looks intentional with them, but real project photos are what
sell painting work. See "Adding photos" below.

## Contact form (Formspree)

The form posts to [Formspree](https://formspree.io) (form `xrbeljvd`),
which emails each submission to the business inbox — no backend needed.
It's wired up and tested.

Useful to know:
- To change where lead emails are delivered (e.g. to
  chris.smith@pictureperfectpainting360.com later), update the notification
  email in the Formspree dashboard — no website change needed.
- When replying to a lead, just hit **Reply** — the customer's address
  is set as the reply-to automatically.
- Submissions also appear in the Formspree dashboard, so nothing is lost
  if an email goes astray.

Spam protection: the form includes a honeypot field (`_gotcha`) that
invisible-to-humans bots tend to fill in; Formspree discards those. If spam
ever gets bad, enable reCAPTCHA in Formspree's dashboard.

The Formspree form ID is **not** a secret — it's designed to be public in
your HTML. Just never commit passwords or API keys to this repo.

## Adding photos

### Where they go
Match the folder to the category (see structure above). Name files
descriptively — it helps SEO and your own sanity:

```
images/gallery/interior/olympia-living-room-2026.webp
images/gallery/interior/olympia-living-room-2026-thumb.webp
```

### Sizing and compression targets
- **Gallery full-size**: ~1600px on the long edge, WebP (or JPEG) at
  quality ~75–80. Typically 150–400 KB each.
- **Gallery thumbnails** (`-thumb` files): ~600px wide, usually under 50 KB.
- **Hero image**: ~1600px wide, compressed hard (it loads first — aim
  under 250 KB).
- [Squoosh](https://squoosh.app) (free, in-browser) resizes and converts
  to WebP easily.

### Wiring them up
In `gallery.html` each photo is a `<figure>` block — there's a `HOW TO ADD
A REAL PHOTO` comment above the grid with exact copy-paste instructions.
Thumbnails load in the grid (`src`), the lightbox loads the full-size
version (`data-full`). Always write real `alt` text describing the photo.

### Video (later)
Don't upload video files to Hostinger shared hosting — upload to **YouTube**
(unlisted is fine) and embed. Add `loading="lazy"` to the iframe so it
doesn't slow the page.

## Deploying to Hostinger

**First deployment — back up the old site first:**
1. In hPanel → **Files → File Manager**, select everything inside
   `public_html` and download it (or zip it and move the zip into a
   `backup-old-site` folder outside `public_html`). Don't skip this.
2. Delete the old files from `public_html` (after the backup exists!).
3. Upload the contents of this repo into `public_html` — either drag-and-drop
   in File Manager, or set up Git deployment (below). Note: `.htaccess`
   starts with a dot and can be hidden — make sure it comes along.
4. Check every page live, on your phone too. Confirm HTTPS works
   (hPanel → Security → SSL if not).

**Ongoing — Git deployment (recommended):**
hPanel → **Advanced → GIT** lets you connect this GitHub repo to
`public_html`. After that, deploying = push to GitHub, then click
**Deploy** in hPanel (or enable the webhook for automatic deploys on push).
No more manual file uploads.

**Rollback:** if a deploy goes wrong, every previous version of the site
lives in Git history (`git log`, `git revert`), plus your original backup.

## Professional email (chris.smith@pictureperfectpainting360.com)

Current setup: `chris.smith@pictureperfectpainting360.com` is a Hostinger
**forwarder** — mail sent to it lands in the business Gmail inbox. The
website shows the professional address everywhere.

Worth knowing:
- **Replies go out from Gmail's address**, not the professional one. If
  that ever bothers you, the fix is to upgrade the forwarder to a real
  mailbox in hPanel → Emails, then add it to Gmail as a "Send mail as"
  address (Gmail Settings → Accounts) using the SMTP details from
  Hostinger's Emails page. Cosmetic — no rush.
- If domain mail ever lands in spam, check that Hostinger's email DNS
  records exist (hPanel usually adds them automatically): **MX** (where
  mail is delivered), **SPF** (who may send as your domain), **DKIM**
  (proof mail is really from you), **DMARC** (what receivers do when
  checks fail).

## SEO basics already in place

- Unique title + meta description per page, canonical URLs
- `HousePainter` (LocalBusiness) structured data on the homepage
- Open Graph tags for link previews (og-image in `images/branding/`)
- `sitemap.xml` + `robots.txt`
- One `h1` per page, semantic headings, descriptive alt text

**Worth doing (free, big local-SEO impact):** claim your
[Google Business Profile](https://business.google.com) and keep the name,
phone number, and hours exactly matching the website.

## Design system cheat sheet

All colors and fonts are CSS variables at the top of `css/style.css`:

| Variable | Value | Used for |
|---|---|---|
| `--spruce` / `--spruce-deep` | deep green | headings, dark sections, footer |
| `--clay` | terracotta | buttons, links, accents |
| `--paper` / `--paper-2` | warm off-whites | page backgrounds |
| `--sage` | soft green | secondary accents |

Change a variable once and it updates site-wide. Headings use the
**Fraunces** typeface, body text uses **Inter** (both from Google Fonts).
