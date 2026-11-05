# LCMXO640E-3TN144C / architecture figure

Source: Lattice Semiconductor, *MachXO Family Data Sheet* (FPGA-DS-02071-3.3, 2022), figures 2.2 (MachXO640 top view), 2.4 (PFU), 2.5 (slice), and Table 1.1 (device resources).

Official reference:
https://www.latticesemi.com/-/media/LatticeSemi/Documents/DataSheets/MachXO23/FPGA-DS-02071-3-3-MachXO-Family-Data-Sheet.ashx?document_id=9922

The diagram is an original **functional architectural illustration** for BlazeWorks, not a scanned datasheet image, gate-level netlist, exact physical block placement, pinout, or electrical wiring schematic. The tiled fabric is representative rather than a count/placement map. On the LCMXO640E there are 640 LUTs, programmable I/O banks, PFU/PFF logic, distributed RAM, JTAG and nonvolatile configuration. This part has neither dedicated EBR nor PLL blocks. The PFU slice inset illustrates two LUT4 elements, two registers and associated control and carry paths. The '-3TN144C' variant is a lead-free 144-pin TQFP with a 1.2 V core and up to 113 user I/Os.

To view readable detail, click the diagram on the homepage to open this SVG in a new tab.


# LM386 / bass-boost audio amplifier — FIG. 01 (current)

- Main drawing: `lm386-bass-boost-reference.svg`. Original vector drafted for the BlazeWorks portfolio from the **Texas Instruments LM386 datasheet SNAS545D, Revision D (August 2023), Figure 9-9, page 15**.
- 9 V DC; 8 Ω passive speaker; gain-setting pin 8 unconnected; 10 kΩ volume control; 33 nF and 10 kΩ in series from pin 1 to output pin 5; 250 µF polarized speaker coupling capacitor; 50 nF + 10 Ω output Zobel branch; 10 µF bypass on pin 7; 100 nF and 100 µF supply decoupling added for assembly guidance.
- `lm386-internal-functional.svg` describes manufacturer-documented circuit stages, bias resistors and transistor categories but **is not an internal transistor connectivity netlist**. The original exact transistor-level schematic appears on **page 1 of the TI datasheet** and is linked from the companion page.
- Expanded guide: `/circuits/lm386/`, with component table and source notes.
- The LM386 is a small <1 W amplifier (e.g. LM386N-3 around 700 mW typical at 9 V, 8 Ω, 10% THD); connecting an 8 Ω speaker *rated* for 5 W does not make it a 5 W amplifier.
- Source: https://www.ti.com/lit/ds/symlink/lm386.pdf
- Electrical diagrams are **not** a physical assembly/PCB layout. The modified reference has not been independently simulated or bench tested. Verify component polarity, actual device suffix, ratings and grounding before building. Old LCMXO640E architecture SVG is retained as historical reference but is no longer FIG. 01.
