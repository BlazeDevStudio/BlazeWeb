# LM386 gain-option reference audit

Primary source: Texas Instruments, **LM386 Low Voltage Audio Power Amplifier**, datasheet SNAS545D (August 2023), https://www.ti.com/lit/ds/symlink/lm386.pdf.

## Design used on website
- FIG. 01 remains a **9 V, 8 Ω bass-boost application**, TI Figure 9-9 (printed page 15). Pin 8 is open; pin 1 uses the documented bass-boost feedback RC network to pin 5.
- New `lm386-gain-variants.svg` is a **separate reference** comparing three alternative pin 1–pin 8 gain-control connections: open = 20, 1.2 kΩ + 10 µF in series ≈50, 10 µF alone = 200. Values are from TI gain-control description and application examples, pages 10–13. These must not be installed simultaneously or added to the existing bass-boost schematic without design review.
- Polarized 10 µF gain capacitors have their positive terminal toward pin 1, in line with TI's example.
- The website links to TI's true internal transistor schematic on printed page 1. The site's colored 'inside the LM386' illustration is expressly functional, not a buildable netlist.

## User-supplied reference image (reviewed 2026-11-06)
- Useful: real transistor-level internal presentation, gain-control explanations and application layout, as visual/educational references. Neither their geometry nor their copyrighted diagram was reused in the site artwork.
- **Critical electrical defect in the supplied application illustration:** a vertical conductor appears to connect the node **after the 250 µF output coupling capacitor directly to ground**, bypassing/shorting the speaker. The correct topology is LM386 pin 5 -> coupling capacitor (positive at pin 5) -> speaker -> ground, as in the manufacturer application.
- The pictured `P_O = 125 mW` value at 6 V / 8 Ω corresponds to a low-distortion *test condition* (0.2% typical THD at f = 1 kHz), not a universal maximum rated amplifier output. Power depends on supply, load, suffix and distortion limit. The LM386 is not a 5 W amplifier.
- The pictured pin-7 bypass capacitor lacks a value; website bill of materials separately identifies 10 µF for that optional engineering addition.

## Validation status
The added SVG contains native vector strokes, text, lines and polygons. It has no embedded bitmap, and its 20/50/200 connections were checked against TI's gain-control descriptions. No hardware test or circuit simulation was performed. Site layout and existing main FIG. 01 remain unchanged.