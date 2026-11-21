# Ghost Check MVP - Requirements

## Product Overview

A mobile-first web tool for camera-rental clerks to compare reference photos of rental gear cases against return photos, identifying missing items through manual verification.

---

## Functional Requirements

### R1: Image Upload and Validation

- **R1.1** The system MUST accept image uploads in JPEG, PNG, and WebP formats only.
- **R1.2** The system MUST reject files larger than 10 MB with an inline error message: "File too large. Maximum size is 10 MB."
- **R1.3** The system MUST reject unsupported file types with an inline error message: "Unsupported file type. Please upload JPEG, PNG, or WebP."
- **R1.4** The system MUST handle corrupt or unreadable image files by displaying an inline error: "Unable to read image file. Please try a different file." and MUST NOT show a blank screen.
- **R1.5** The system MUST validate file type by MIME type and file extension, rejecting any file that does not match `image/jpeg`, `image/png`, or `image/webp`.

### R2: Marker Placement and Labeling

- **R2.1** A marker MUST store: a unique `id` (string), a `label` (string), a `position` object with `x` and `y` (numbers in range 0..1), and a `status` (string).
- **R2.2** Position coordinates MUST be normalized relative to the reference image dimensions, such that markers remain correctly positioned when the image is resized or displayed on different screen sizes.
- **R2.3** Markers MUST be placeable by clicking or tapping on the reference photo at any position.
- **R2.4** Each marker MUST have a visible number indicating its creation order (1, 2, 3, ...).
- **R2.5** Each marker MUST be labelable with custom text entered via an input field that appears when the marker is placed or selected.
- **R2.6** Markers MUST be visually distinguishable on the reference photo (e.g., circular badge with number).

### R3: Status Management

- **R3.1** Each marker MUST have one of exactly three statuses: `"unchecked"`, `"returned"`, or `"missing"`.
- **R3.2** All newly created markers MUST start with status `"unchecked"`.
- **R3.3** Clicking or tapping a marker MUST cycle its status in the order: unchecked → returned → missing → unchecked.
- **R3.4** The visual appearance of a marker MUST reflect its current status (e.g., different colors for unchecked/returned/missing).

### R4: Reference Photo Replacement

- **R4.1** Replacing the reference photo (uploading a new one) MUST clear all existing markers.
- **R4.2** Replacing the reference photo MUST clear all status values.
- **R4.3** The system MUST prompt for confirmation before clearing markers: "Replace reference photo? This will remove all markers. Continue?"
- **R4.4** The reference photo upload MUST be accessible from the Reference Setup screen.

### R5: Return Photo Replacement

- **R5.1** Replacing the return photo (uploading a new one) MUST keep all markers and their positions.
- **R5.2** Replacing the return photo MUST reset all marker statuses to `"unchecked"`.
- **R5.3** The system MUST prompt for confirmation before resetting statuses: "Replace return photo? This will reset all item statuses to unchecked. Continue?"
- **R5.4** The return photo upload MUST be accessible from the Return Capture screen.

### R6: Overlay and Transparency

- **R6.1** The system MUST overlay the reference photo on top of the return photo in the Review screen.
- **R6.2** A transparency slider MUST control the opacity of the reference overlay from 0% to 100%.
- **R6.3** The transparency slider MUST default to 50% opacity.
- **R6.4** The transparency slider MUST have a range input with min="0", max="100", and value="50".
- **R6.5** The slider MUST display the current percentage value (e.g., "50%").

### R7: Inspection Completion and Blocking

- **R7.1** The clerk MUST NOT be able to finish the inspection while any marker has status `"unchecked"`.
- **R7.2** When blocked, the system MUST display an error message stating how many markers are still unchecked: "X items still need to be checked."
- **R7.3** The finish action MUST be a button that is disabled or shows the blocker message when unchecked markers exist.

### R8: Summary Screen

- **R8.1** The summary MUST list only markers with status `"missing"`.
- **R8.2** Missing items MUST be listed by their `label` in the order they were created.
- **R8.3** If no items are missing, the summary MUST display: "All items accounted for. Nothing missing."
- **R8.4** The summary MUST include a copy-to-clipboard action that copies the list of missing item labels (one per line).
- **R8.5** After copying, the system MUST display a brief confirmation: "Copied to clipboard."

### R9: Navigation and Flow

- **R9.1** The app MUST have exactly five screens in this order: Landing, Reference Setup, Return Capture, Review, Summary.
- **R9.2** The Landing screen MUST display a brief explanation and a primary "Start Inspection" button.
- **R9.3** Navigation MUST proceed sequentially: Landing → Reference Setup → Return Capture → Review → Summary.
- **R9.4** A "Back" or "Previous" navigation option MUST allow returning to the previous screen without losing entered data (except as specified in R4 and R5).

### R10: Demo Data

- **R10.1** The demo case MUST pre-populate exactly three markers with labels: "Battery", "Charger", "USB-C cable".
- **R10.2** The demo reference photo MUST show all three items in their slots.
- **R10.3** The demo return photo MUST be missing the "Battery" item.
- **R10.4** All three demo markers MUST start with status `"unchecked"`.
- **R10.5** A "Load Demo" button MUST be available on the Landing screen to populate the demo data.

### R11: Responsive Design

- **R11.1** The app MUST be fully usable at 360 px viewport width.
- **R11.2** All interactive elements (buttons, sliders, markers) MUST have a minimum touch target size of 44x44 pixels.
- **R11.3** The layout MUST adapt to portrait orientation on mobile devices without horizontal scrolling.

### R12: Keyboard Accessibility

- **R12.1** All markers MUST be focusable via keyboard (Tab key).
- **R12.2** Pressing Enter or Space on a focused marker MUST cycle its status.
- **R12.3** The transparency slider MUST be keyboard accessible (Arrow keys to adjust).
- **R12.4** All buttons and interactive elements MUST have visible focus indicators.
- **R12.5** The slider MUST be reachable and operable using only keyboard input.

### R13: Error Handling

- **R13.1** All error messages MUST be displayed inline within the context where the error occurred.
- **R13.2** No error state SHOULD result in a blank screen or crash.
- **R13.3** Image loading errors MUST show a user-friendly message and allow retry.

---

## Excluded Features

The following features are explicitly NOT included in this MVP:
- Automatic object detection
- AI analysis of photos
- Login or authentication
- Database or persistent storage
- Cloud upload or storage
- Admin dashboard
- PDF export
- Payment processing
- Native mobile builds
- Notifications