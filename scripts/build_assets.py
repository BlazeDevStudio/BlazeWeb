#!/usr/bin/env python3
"""Bundle the editable CSS layers into one compact stylesheet.

Standard Python 3 only. No npm, dependency installation or network access.
Use --check to verify the committed output is fresh.
"""
from pathlib import Path
import argparse
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
LAYERS = ['00-foundation.css', '10-site-layout.css', '20-inner-pages.css', '30-responsive.css', '40-brand-and-effects.css', '50-about-resume.css']
SOURCE = ROOT / "assets" / "css"
OUTPUT = ROOT / "assets" / "site.min.css"
BANNER = "/* Generated from assets/css/* by python scripts/build_assets.py; edit sources, not this file. */\\n"


def minify_css(text):
    """Conservative whitespace/comment reduction; keeps quoted text and calc spaces."""
    output = []
    pending_space = False
    quote = ""
    escaped = False
    index = 0

    while index < len(text):
        char = text[index]
        following = text[index + 1] if index + 1 < len(text) else ""

        if quote:
            output.append(char)
            if escaped:
                escaped = False
            elif char == "\\\\":
                escaped = True
            elif char == quote:
                quote = ""
            index += 1
            continue

        if char == "/" and following == "*":
            index += 2
            while index < len(text) and text[index:index+2] != "*/":
                index += 1
            if index >= len(text):
                raise ValueError("Unterminated CSS comment")
            index += 2
            pending_space = True
            continue

        if char in ("'", '"'):
            if pending_space and output and output[-1] not in "{};":
                output.append(" ")
            pending_space = False
            quote = char
            output.append(char)
        elif char.isspace():
            pending_space = True
        elif char in "{};":
            if output and output[-1] == " ":
                output.pop()
            output.append(char)
            pending_space = False
        else:
            if pending_space and output and output[-1] not in "{};":
                output.append(" ")
            pending_space = False
            output.append(char)
        index += 1

    if quote:
        raise ValueError("Unterminated CSS string")
    return re.sub(r";}", "}", "".join(output)) + "\\n"


def build():
    css = "\\n".join((SOURCE / filename).read_text(encoding="utf-8") for filename in LAYERS)
    return BANNER + minify_css(css)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Do not write; fail if generated CSS is out of date")
    args = parser.parse_args()
    generated = build()
    if args.check:
        if not OUTPUT.is_file() or OUTPUT.read_text(encoding="utf-8") != generated:
            print("Outdated assets/site.min.css — run python scripts/build_assets.py")
            return 1
        print("CSS bundle is current.")
        return 0
    OUTPUT.write_text(generated, encoding="utf-8")
    print(f"Built {OUTPUT.relative_to(ROOT)} ({len(generated.encode('utf-8'))} bytes).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
