# BlazeWorks — BlazeDevStudio website

A lightweight, static HTML/CSS/JavaScript portfolio for computers, electronics, networking and software.

**For manual editing:** [EDITING.md](docs/EDITING.md)  
**For developers:** [ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Quick start

```bash
python -m http.server 5500
# Open http://localhost:5500/
python scripts/check_site.py
```

There is **no build system**, npm dependency or framework.

## Deployment sources

| Hosting | Repository | How to update |
| --- | --- | --- |
| Cloudflare Pages | [BlazeWeb](https://github.com/BlazeDevStudio/BlazeWeb) | Commit and push `main`; check Cloudflare deployment |
| GitHub Pages | [BlazeDevStudio.github.io](https://github.com/BlazeDevStudio/BlazeDevStudio.github.io) | Separately copy reviewed runtime changes, commit and push `main` |

The repositories are deliberately separate. Changes to BlazeWeb do **not** automatically update GitHub Pages. The optional `scripts/sync_pages.py` tool copies runtime files between local clones without deleting, committing or pushing.

All master brand assets remain in `assets/branding/v3/`. Project descriptions represent work in progress, not production-readiness claims.
