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
│   ├── style.css              Ordered CSS entrypoint (do not reorder)
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
    ├── check_site.py          Verify local links and common HTML structure
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

The CSS modules are imported by `assets/style.css` in the same order as the previous single stylesheet. Do not move a rule between layers without checking its cascade priority. There are no remote fonts, CSS libraries, or required JavaScript frameworks.

**One source, two hosts:** BlazeWeb is the Cloudflare source. The separately managed `BlazeDevStudio.github.io` repository hosts GitHub Pages. Neither hosting provider needs a build command. The GitHub Pages repository only needs runtime files; large brand archives stay in BlazeWeb and Drive.
