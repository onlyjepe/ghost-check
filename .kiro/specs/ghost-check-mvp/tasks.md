# Ghost Check MVP - Implementation Tasks

## Task 1: Project Setup

**Files:**
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/index.css`

**Acceptance Check:**
- [ ] Running `npm install` completes without errors
- [ ] Running `npm run dev` starts the Vite dev server
- [ ] The app renders without console errors
- [ ] CSS variables from design.md are defined in index.css

**Must Not:**
- Install any CSS frameworks (Tailwind, Bootstrap, etc.)
- Add any backend or database dependencies

---

## Task 2: Screen Navigation and Routing

**Files:**
- `src/types.ts` (shared types)
- `src/context/AppContext.tsx` (state management)
- Updated `src/App.tsx`

**Acceptance Check:**
- [ ] All five screens render: Landing, Reference Setup, Return Capture, Review, Summary
- [ ] Navigation flows forward and backward correctly
- [ ] State persists when navigating between screens (except as specified in requirements)
- [ ] URL routing works (e.g., `/reference`, `/return`, etc.)

**Must Not:**
- Break the sequential flow requirement
- Allow skipping screens

---

## Task 3: Image Upload and Validation (Runnable App)

**Files:**
- `src/components/PhotoUploader.tsx`
- `src/components/ReferenceImageDisplay.tsx`
- `src/components/ReturnImageDisplay.tsx`

**Acceptance Check:**
- [ ] Can upload JPEG, PNG, WebP files
- [ ] Rejects files >10MB with error message
- [ ] Rejects unsupported types with error message
- [ ] Handles corrupt images with error message (not blank screen)
- [ ] Images display correctly after upload

**Must Not:**
- Upload to any server (all client-side)
- Use any external image handling libraries

---

## Task 4: Marker Placement and Labeling

**Files:**
- `src/components/Marker.tsx`
- `src/components/MarkerLayer.tsx`
- `src/components/MarkerLabelInput.tsx`
- Updated `src/screens/ReferenceSetupScreen.tsx`

**Acceptance Check:**
- [ ] Clicking/tapping on reference image places a marker
- [ ] Markers display sequential numbers
- [ ] Can enter label text for each marker
- [ ] Marker positions are normalized (0-1) and survive resize
- [ ] Markers have correct visual appearance per design

**Must Not:**
- Allow duplicate marker IDs
- Lose marker positions on window resize

---

## Task 5: Overlay and Transparency Slider

**Files:**
- `src/components/ImageCompareView.tsx`
- `src/components/TransparencySlider.tsx`
- Updated `src/screens/ReviewScreen.tsx`

**Acceptance Check:**
- [ ] Reference photo overlays return photo
- [ ] Slider controls overlay opacity from 0-100%
- [ ] Default opacity is 50%
- [ ] Both images align correctly
- [ ] Markers display over the overlay at correct positions

**Must Not:**
- Break marker positioning when transparency changes

---

## Task 6: Status Cycling and Completion Blocking

**Files:**
- Updated `src/components/Marker.tsx`
- Updated `src/components/MarkerLayer.tsx`
- `src/components/UncheckedWarning.tsx`
- Updated `src/screens/ReviewScreen.tsx`

**Acceptance Check:**
- [ ] Clicking marker cycles: unchecked → returned → missing → unchecked
- [ ] Visual appearance changes based on status (color)
- [ ] Cannot finish with unchecked markers
- [ ] Error message shows count of unchecked items
- [ ] Keyboard can cycle status (Enter/Space)

**Must Not:**
- Allow proceeding with unchecked markers

---

## Task 7: Summary, Demo Data, and Polish

**Files:**
- `src/screens/SummaryScreen.tsx`
- `src/components/MissingItemsList.tsx`
- `src/components/CopyButton.tsx`
- `src/utils/demoData.ts`
- `src/App.tsx` (add Load Demo button)
- Updated CSS for full responsiveness

**Acceptance Check:**
- [ ] Summary lists only missing items by label in creation order
- [ ] Shows "All items accounted for" when nothing missing
- [ ] Copy button copies list to clipboard and shows confirmation
- [ ] Load Demo button populates three markers: Battery, Charger, USB-C cable
- [ ] Demo starts with all markers unchecked
- [ ] Fully usable at 360px width
- [ ] All touch targets ≥44x44px
- [ ] Full keyboard accessibility (Tab, Enter, Space, Arrow keys)

**Must Not:**
- Add any features not in requirements (AI, auth, etc.)
- Break any previous acceptance checks