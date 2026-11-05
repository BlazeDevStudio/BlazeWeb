# Performance: measured source audit and changes

This is a **static six-page portfolio**. It currently makes no runtime API calls, has no database, no server-side application code and no client-side UI framework.

## Applied
- **Consolidate and compact CSS:** Six editable source layers plus one former entrypoint required **seven stylesheet fetches**. The runtime now uses a single compact `assets/site.min.css`, assembled in the original cascade order with `python scripts/build_assets.py`. The generated CSS is checked by `scripts/check_site.py`.
- **Defer scripts:** `assets/circuit.js` already uses `defer` on all six pages. Keep this to avoid blocking HTML parsing.
- **Efficient animation:** The canvas already respects reduced motion, data saving and hidden tabs. We added reduced-work settings on very low-end hardware, coalesced rapid resize events, and fixed the static-node view. The regular desktop appearance and mouse interaction remain.
- **Vector images:** The main architecture diagram and brand icons are SVG with specified dimensions. There is no large raster photo collection to compress right now.
- **CDN and compression:** Cloudflare Pages already supplies edge delivery, ETags, and Gzip/Brotli compression when possible. We intentionally keep its default cache policy, avoiding long-lived stale CSS after an update. GitHub Pages is a separately deployed mirror.
- **No unused libraries:** The site has no Bootstrap, React, or third-party JS/CSS dependencies. Nothing to remove.

## Conditional, not needed yet
- **Lazy-loading:** Only the homepage's small SVG architecture graphic is currently an image and it is near the first screen. Keep its eager loading. Add `loading="lazy"` and explicit dimensions for any **future** images below the fold.
- **Compress images:** Convert any large future photographs to WebP/AVIF at appropriate display sizes.
- **Debouncing input:** There are no live-search/input event handlers. If search is added, debounce keystrokes.
- **Pagination:** Current project lists are small. Paginate or filter only after the list grows substantially.
- **Code splitting:** One ~6 KB deferred canvas script does not merit a module loader/chunking pipeline.
- **Skeleton loaders:** Static HTML content is available immediately; skeletons would delay useful content.

## Not applicable to the current site
- API response caching, compressing API payloads and caching expensive queries.
- Database indexing, N+1 queries and database connection pooling.
- Load balancing and server-side application caching.
- React-style unnecessary component re-renders.

## How to evaluate real user performance

Use Chrome DevTools (Network and Lighthouse) on both sites, including CPU/network throttling. Compare **LCP, CLS, INP, total requests, transferred bytes and animation frame pacing** on a representative phone and low-end TV device. This source audit does not claim an unmeasured Lighthouse score or page-load time.

For editors: update `assets/css/*.css`, run `python scripts/build_assets.py`, then `python scripts/check_site.py` and publish the source plus generated file together.

The website must keep the approved branding and the LCMXO640E illustration intact. Performance changes must not alter their geometry.
