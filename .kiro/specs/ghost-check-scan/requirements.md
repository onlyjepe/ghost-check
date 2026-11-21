# Requirements — Ghost Check scan mode

Second pass on Ghost Check. The first spec (`ghost-check-mvp`) checked one camera
bag with three pins and asked the user to compare two photos by eye. This one
turns it into something a counter can use on any handover: up to ten slots, two
vocabularies (rental kit, delivery parcel), and a camera scan that flags the
empty slots before the human confirms them.

## R1 — Ten slots, not three

1. A check holds at least one and at most ten slots.
2. Slots are placed by tapping the reference photo; each tap is numbered in
   placement order.
3. Adding an eleventh slot is refused with a message that says what to remove.

## R2 — Blank names, and an advisory

1. A new slot has an empty name. Nothing is pre-filled, in the app or in the
   sample kits.
2. Unnamed slots are labelled "Slot N · unnamed" in the list and "Slot N" in the
   report.
3. While any slot is unnamed the seal screen shows an advisory telling the user
   to write their own item name.
4. The name field placeholder is "Write your item" — a prompt, not a suggestion
   of what to type.

## R3 — Two vocabularies

1. Mode `kit` speaks about kits, borrowers and things rented out.
2. Mode `parcel` speaks about parcels, recipients and things sent out.
3. The mode is fixed for the life of a check and shown on the step rail.
4. Nothing in the flow requires the kit/parcel wording to differ beyond those
   nouns.

## R4 — The scan runs on the camera, not on a second upload

1. The scan screen opens the rear camera and shows a framing guide.
2. A scan captures one frame and compares it against the sealed reference photo,
   slot by slot.
3. Every slot receives one of three verdicts: still there, missing, needs a look.
4. Each verdict carries a confidence number that is shown to the user.
5. A scan never overwrites a verdict the user has already corrected by hand
   without the user running another scan.
6. If the camera is unavailable the screen explains why and offers a photo
   instead; when a sample kit is loaded it offers that sample's return photo.

## R5 — Every flag is confirmed by a human

1. The report screen lists all slots with their verdicts.
2. Tapping a row flips it: needs a look → missing → still there.
3. The report cannot be filed while any slot is unchecked or flagged "needs a
   look".
4. Copy explains that the scan is a first pass and the user confirms each flag.

## R6 — The report

1. The report lists only missing items, numbered by slot position.
2. It can be copied as plain text: a heading, then one line per item.
3. When nothing is missing the report says everything came back.
4. Unnamed missing slots print as "Slot N" so a report is never empty-looking.

## R7 — Privacy and failure

1. Photos and scan frames stay in the tab; no network request carries image
   data.
2. Replacing the reference photo asks first and resets every slot.
3. An unreadable or oversized file is refused with a plain message.
4. Nothing about the scan is presented as certain.

## R8 — Usable on a phone at a counter

1. Layout holds at 360 px with no horizontal scrolling.
2. Every interactive control is at least 44 px tall or wide.
3. Motion respects `prefers-reduced-motion`.
4. Every screen is reachable by keyboard and announcements use live regions.
