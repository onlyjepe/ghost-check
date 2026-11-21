# Ghost Check

A handover check for anything that leaves full and comes back a little lighter: a
rental camera bag, a delivery parcel. Photograph it packed, name up to ten slots,
then scan it on the way back. The scan flags the slots that look empty; you confirm
each one; the report is a plain list you can paste into the rental note or the
delivery ticket.

## Live app

https://onlyjepe.github.io/ghost-check/

Built for the Kiroween 2026 Costume Contest. The specs in `.kiro/specs/` were written
before the code, and both specs are still the contract the app follows.

## The problem it answers

A clerk hands out a camera bag with a battery, a charger, a cable, a lens. The bag
comes back at closing time, everyone is in a hurry, and the battery is gone. Six
weeks later that is an argument nobody can win.

Same story on the parcel side: a package leaves the counter sealed with five items,
the recipient opens it, and one thing is not inside. Whoever shipped it has no
record of what was in the box beyond memory.

## Use it

1. **Name the slots.** A photo of the full case becomes the sealed reference. Tap
   each item; each tap is a numbered slot. Write the item name yourself — nothing is
   pre-filled — or leave it as a number.
2. **Scan it back.** Point the camera at the same case, roughly the way the reference
   was shot. The scan compares each slot, not the whole picture, and flags what looks
   gone.
3. **Confirm the flags.** Tap any row to flip it. You cannot file the report while a
   slot is still unresolved.
4. **File it.** The report is a list of what did not come back, ready to copy.

Two sample kits are bundled: a six-slot camera bag and a five-slot parcel, each with
one item removed. They work without a camera, so the whole flow is tryable from a
desk.

## How the scan works

It is fixed arithmetic, not a model: luma-normalise both frames, search a small
translation offset, take a 16 x 16 signature per slot, compare the signatures. Slots
scoring above 0.62 read as filled, below 0.38 as empty, and everything between is
flagged for the human. That middle band is deliberate — a counter tool that guesses
confidently is worse than one that asks.

There is no backend, no upload, no account. Photos stay in the tab.

## Run it

```bash
npm install
npm run dev
npm run build
```

## Test it

Requirements: Python 3 with Playwright installed (`pip install playwright` followed
by `playwright install chromium`), and ffmpeg.

Generate the test video frames:

```bash
ffmpeg -loop 1 -i public/demo/kit-return.jpg -t 1 -vf scale=640:480,fps=2,format=yuv420p -f yuv4mpegpipe test/frames/kit-return.y4m
ffmpeg -loop 1 -i public/demo/parcel-return.jpg -t 1 -vf scale=640:480,fps=2,format=yuv420p -f yuv4mpegpipe test/frames/parcel-return.y4m
```

In terminal 1:

```bash
npx vite preview --host 127.0.0.1 --port 4173
```

In terminal 2:

```bash
python test/e2e.py http://127.0.0.1:4173/
```

Set `CHROME_PATH` to use a specific Chromium binary.

The end-to-end test drives Chromium with a fake camera pointed at the demo return
photos. It covers: sample loading, blank slot names, writing an item name, sealing,
a live camera scan, the exact missing slot being flagged, hand corrections, the
re-scan and re-file, clipboard copy, and no horizontal overflow at 360 px.

`tools/make_demo.py` regenerates the demo frames and `samples.json`; the slot
coordinates come from the same numbers that draw the art.

## Stack

React 18, TypeScript, Vite, plain CSS. No router, no UI kit, no image library,
no backend, no accounts, no ML runtime.

## What Kiro did

- `.kiro/specs/ghost-check-mvp/` — requirements, design, tasks for the first build
  (one bag, three pins, two photos compared by eye), which the CLI implemented.
- `.kiro/specs/ghost-check-scan/` — requirements and design for this iteration: ten
  slots, two vocabularies, camera scan with confirmation, report rules.
- The second iteration was written against that spec and reviewed against it; the
  `design.md` numbers (256 x 192, ±8 px, 16 x 16, 0.62 / 0.38) are the values the
  code actually runs.

## License

MIT. See `LICENSE`.
