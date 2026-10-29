#!/usr/bin/env python3
"""Copy reviewed runtime files to a local GitHub Pages clone. Never push."""
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    "index.html", "projects/index.html", "systems/index.html",
    "labs/index.html", "manrealtech/index.html", "about/index.html",
    "favicon.svg", "robots.txt", "assets/style.css", "assets/circuit.js",
]


def main():
    if len(sys.argv) != 2:
        print("Usage: python scripts/sync_pages.py ../BlazeDevStudio.github.io")
        return 2
    target = Path(sys.argv[1]).expanduser().resolve()
    if target == ROOT.resolve() or not (target / ".git").exists() or not (target / "index.html").is_file():
        print("Refusing: target must be a separate checked-out website Git repository.")
        return 1
    paths = PAGES[:]
    for name in ("assets/css", "assets/diagrams"):
        paths += [str(p.relative_to(ROOT)) for p in (ROOT / name).rglob("*") if p.is_file()]

    changes = []
    for rel in paths:
        src = ROOT / rel
        dst = target / rel
        if not src.is_file():
            raise FileNotFoundError(src)
        if dst.is_file() and src.read_bytes() == dst.read_bytes():
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        changes.append(rel)

    print(f"Copied {len(changes)} changed file(s).")
    for path in changes:
        print(" ", path)
    print("Review with git diff in the Pages clone, then commit/push it separately.")
    print("No files were deleted, committed or pushed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
