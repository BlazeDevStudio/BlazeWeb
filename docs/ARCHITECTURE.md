# Website architecture

## Readable layer stack

```text
BlazeWeb/
├── index.html                 Homepage, featured work, LCMXO diagram
├── projects/index.html        Public portfolio
├── systems/index.html         Blaze Systems
├── labs/index.html            Blaze Labs
├── manrealtech/index.html     Repairs and IT support
├── about/index.html           Résumé-style About page
├── favicon.svg                Approved ruby HUD favicon
├── assets/
│   ├── style.css              Readable CSS import fallback
│   ├── site.min.css           Generated single-request runtime CSS
│   ├── css/
│   │   ├── 00-foundation.css      Colors, basic type, reset
│   │   ├── 10-site-layout.css     Navigation, homepage, cards
│   │   ├── 20-inner-pages.css     Common secondary pages
│   │   ├── 30-responsive.css     Core mobile and tablet rules
│   │   ├── 40-brand-and-effects.css   Brand accents, canvas, SVG view
│   │   └── 50-about-resume.css   Profile, experience, printing
│   ├── circuit.js             Moving-node canvas, cursor interaction
│   ├── diagrams/              LCMXO640E vector architecture and source
│   └── branding/v3/           Approved logo and sublogo vector library
├── docs/EDITING.md            Manual editing and deployment instructions
├── docs/ARCHITECTURE.md       This map
└── scripts/
    ├── build_assets.py        Bundle CSS (Python only)
    ├── check_site.py          Verify local links, HTML and bundle
    └── sync_pages.py          Copy website runtime to GitHub Pages clone
```

## Render and style order

1. **Content** — HTML pages are independent. No framework or dynamic template.
2. **Foundation** — `00-` design tokens, typography and basic accessibility.
3. **Global layout** — `10-` shared header, hero, cards and components.
4. **Secondary pages** — `20-` About/Work/Systems/Lab/Repairs structure.
5. **Responsive** — `30-` phone/tablet viewport rules.
6. **Brand finishing and canvas placement** — `40-`.
7. **About / print rules** — `50-`.
8. **Optional behavior** — `assets/circuit.js`, run with `defer` on each page.

The CSS modules are still imported by the readable `assets/style.css` in their original cascade order, but live HTML pages now load the generated `assets/site.min.css` as **one render-blocking request instead of seven**. To preserve the original rule order, `python scripts/build_assets.py` concatenates and conservatively minifies the six CSS modules. Do not reorder layers without testing. No remote fonts, CSS libraries, or JavaScript frameworks are required.

**One source, two hosts:** BlazeWeb is the Cloudflare source. The separately managed `BlazeDevStudio.github.io` repository hosts GitHub Pages. Hosting serves the committed `assets/site.min.css` directly; run the one-command Python CSS build *before* committing any stylesheet changes. The GitHub Pages repository only needs runtime files; large brand archives stay in BlazeWeb and Drive.
