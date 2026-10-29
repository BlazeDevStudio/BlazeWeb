#!/usr/bin/env python3
"""Fast, offline site sanity checks. Python 3.9+, no third-party dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    "index.html", "projects/index.html", "systems/index.html",
    "labs/index.html", "manrealtech/index.html", "about/index.html",
]
CSS_LAYERS = [
    "00-foundation.css", "10-site-layout.css", "20-inner-pages.css",
    "30-responsive.css", "40-brand-and-effects.css", "50-about-resume.css",
]


class PageInspector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.errors = []
        self.paths = []
        self.h1s = 0
        self.canvases = 0

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if d.get("id"):
            if d["id"] in self.ids:
                self.errors.append("duplicate id: " + d["id"])
            self.ids.add(d["id"])
        if tag == "h1":
            self.h1s += 1
        if tag == "canvas" and d.get("id") == "circuit-field":
            self.canvases += 1
        for key in ("href", "src"):
            value = d.get(key)
            if not value or value.startswith(("#", "//", "data:", "mailto:", "tel:")):
                continue
            u = urlsplit(value)
            if not u.scheme and not u.netloc:
                self.paths.append(unquote(u.path))


def main():
    errors = []
    for rel in PAGES:
        page = ROOT / rel
        if not page.is_file():
            errors.append(rel + ": missing")
            continue
        p = PageInspector()
        p.feed(page.read_text(encoding="utf-8"))
        if p.h1s != 1:
            errors.append(f"{rel}: expected one h1, found {p.h1s}")
        if p.canvases != 1:
            errors.append(rel + ": expected exactly one circuit canvas")
        errors.extend(rel + ": " + e for e in p.errors)
        for target in p.paths:
            dest = (page.parent / target).resolve()
            try:
                dest.relative_to(ROOT.resolve())
            except ValueError:
                errors.append(rel + ": link escapes repository: " + target)
                continue
            if dest.is_dir():
                if not (dest / "index.html").is_file():
                    errors.append(rel + ": directory has no index: " + target)
            elif not dest.is_file():
                errors.append(rel + ": broken local path: " + target)

    entry = ROOT / "assets" / "style.css"
    if not entry.is_file():
        errors.append("assets/style.css: missing")
    else:
        stylesheet = entry.read_text(encoding="utf-8")
        order = [f'@import url("./css/{name}");' for name in CSS_LAYERS]
        positions = [stylesheet.find(line) for line in order]
        if any(i < 0 for i in positions) or positions != sorted(positions):
            errors.append("CSS imports missing or out of order")
    for name in CSS_LAYERS:
        if not (ROOT / "assets" / "css" / name).is_file():
            errors.append("CSS layer missing: " + name)

    if errors:
        print("Site check FAILED:")
        for error in errors:
            print(" -", error)
        return 1
    print(f"Site check passed: {len(PAGES)} pages, {len(CSS_LAYERS)} CSS layers.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
