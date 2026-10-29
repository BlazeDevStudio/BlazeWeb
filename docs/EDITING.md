# Editing your BlazeWorks website manually

You own ordinary HTML files. You can edit the website without AI, without an online page builder, and without learning React or using npm.

## Best desktop tools

- **Visual Studio Code** — [code.visualstudio.com](https://code.visualstudio.com/), for editing HTML/CSS/JS. Use **Format Document** to indent the current file.
- **Live Server** VS Code extension, or the built-in `python -m http.server 5500`, for a local browser preview.
- **GitHub Desktop** — [desktop.github.com](https://desktop.github.com/), for history, diffs, commits and pushes. Or use standard Git.
- **GitHub web editor** — directly edit simple text changes in a repository using the pencil/edit icon.

For Android, a plain-code editor such as **Acode** plus a Git client is sufficient for small changes, but desktop VS Code is easier for multiple-file edits.

## Step-by-step local workflow

1. Clone [BlazeDevStudio/BlazeWeb](https://github.com/BlazeDevStudio/BlazeWeb) using GitHub Desktop or `git clone https://github.com/BlazeDevStudio/BlazeWeb.git`.
2. Open the **repository folder** in VS Code.
3. Find the text or section you want. Press **Ctrl+Shift+F** (search across files). Open the matching HTML file.
4. Edit page text *between* HTML tags. For layout/colors, open the appropriate CSS layer in `assets/css/`. For the moving nodes, open `assets/circuit.js`.
5. In the repo folder, run `python -m http.server 5500` and visit `http://localhost:5500/` to preview. A Live Server extension is an alternative.
6. Run `python scripts/check_site.py`. Inspect the website on a phone-width and a desktop-width viewport.
7. In GitHub Desktop, review the changed lines, **commit** and **push** to `BlazeWeb/main`. Cloudflare Pages will build from that branch; check deployment success.

A quick typo can also be edited via GitHub's web file editor, but it is harder to see whether related layout or navigation files also need edits.

## What to edit

| Change | File |
| --- | --- |
| Homepage text, featured links and chip caption | `index.html` |
| Résumé, education, experience and profile | `about/index.html` |
| Public GitHub project cards | `projects/index.html` |
| Systems, repairs, labs | `systems/index.html`, `manrealtech/index.html`, `labs/index.html` |
| Brand colors, base typography | `assets/css/00-foundation.css` |
| Homepage, navigation and project card layout | `assets/css/10-site-layout.css` |
| Common inside-page layout | `assets/css/20-inner-pages.css` |
| Mobile screen rules | `assets/css/30-responsive.css` |
| Decorative canvas layering and diagrams | `assets/css/40-brand-and-effects.css` |
| Profile layout and print styles | `assets/css/50-about-resume.css` |
| Node count, speed, cursor response | `assets/circuit.js` |
| LCMXO640E diagram | `assets/diagrams/lcmxo640e-logic-architecture.svg` |

`assets/style.css` is just an ordered list of `@import` statements. Avoid changing this unless you intentionally add or remove a CSS layer.

### Example: edit the About page

Open `about/index.html`, find `Work history.`, `Technical toolkit.`, or another visible heading. Under the relevant section, change text while preserving tags. Save, preview `http://localhost:5500/about/`, and run the check script.

### Example: add a project

In `projects/index.html`, copy a complete project-card anchor with class `work-row`; edit its number, `h3` name, `p` description and `href`. Only describe a product as released after checking its actual release artifacts.

## Updating GitHub Pages too

Your site has **two distinct repositories**. A push to `BlazeWeb/main` updates Cloudflare, **not** GitHub Pages.

Clone [BlazeDevStudio/BlazeDevStudio.github.io](https://github.com/BlazeDevStudio/BlazeDevStudio.github.io) beside your BlazeWeb folder. From the **BlazeWeb root** run:

```bash
python scripts/sync_pages.py ../BlazeDevStudio.github.io
```

The script copies the six pages, CSS layers, JavaScript, favicon and diagram files into the local GitHub Pages clone. It does not delete anything or push remotely. Open that second repo in GitHub Desktop, review its changes, commit and push `main`; then verify [blazedevstudio.github.io](https://blazedevstudio.github.io/).

If you edited the CSS or HTML directly in GitHub's browser, you can repeat the change in the second repository's browser editor instead.

## Avoid accidental breakages

- Do not delete the shared `circuit-field` canvas or `assets/circuit.js` if you want the animation everywhere.
- Keep HTML `href` and `src` relative paths correct: Home uses `./`, while one-level-deep pages usually use `../`.
- Do not rename or redraw the approved B logo, ruby HUD icon or Z dependency emblem in `assets/branding/v3/` without a separate design decision.
- Never paste passwords, private contact lists, sensitive family information or unpublished customer data into the public repo.
- Check **Git diff** before publishing. The structure is intentionally simple enough to hand-edit.
