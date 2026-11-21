# Ghost Check MVP - Design

## Component Tree

```
App
├── LandingScreen
│   ├── ExplanationText
│   ├── StartButton
│   └── LoadDemoButton
├── ReferenceSetupScreen
│   ├── PhotoUploader (reference)
│   ├── ReferenceImageDisplay
│   ├── MarkerLayer
│   │   └── Marker[]
│   ├── MarkerLabelInput
│   ├── NavigationControls (Next/Back)
│   └── ConfirmDialog (for replace)
├── ReturnCaptureScreen
│   ├── PhotoUploader (return)
│   ├── ReturnImageDisplay
│   ├── NavigationControls
│   └── ConfirmDialog (for replace)
├── ReviewScreen
│   ├── ImageCompareView
│   │   ├── ReturnPhoto
│   │   └── ReferenceOverlay (with transparency)
│   ├── MarkerLayer (positioned over overlay)
│   ├── TransparencySlider
│   ├── NavigationControls
│   └── UncheckedWarning
└── SummaryScreen
    ├── MissingItemsList
    ├── CopyButton
    ├── AllItemsMessage (conditional)
    ├── RestartButton
    └── CopyConfirmation
```

## State Shape

```typescript
interface Marker {
  id: string;
  label: string;
  position: { x: number; y: number }; // 0..1 normalized
  status: 'unchecked' | 'returned' | 'missing';
}

interface AppState {
  screen: 'landing' | 'reference' | 'return' | 'review' | 'summary';
  referencePhoto: string | null;        // data URL
  returnPhoto: string | null;           // data URL
  markers: Marker[];
  transparency: number;                 // 0-100, default 50
  copyConfirmation: string | null;      // Message to show after copy
  confirmDialog: {
    open: boolean;
    message: string;
    onConfirm: () => void;
  } | null;
  error: string | null;                 // Inline error message
}
```

## State Transitions

| Action | Transition |
|--------|------------|
| Click "Start Inspection" | screen: 'landing' → 'reference' |
| Upload reference photo | referencePhoto set, error cleared |
| Place marker on image | markers: [..., {id, label: '', position, status: 'unchecked'}] |
| Enter label for marker | markers[id].label updated |
| Click marker (cycle status) | status: unchecked→returned→missing→unchecked |
| Click "Next" on Reference (if has photo + markers) | screen: 'reference' → 'return' |
| Upload return photo | returnPhoto set, error cleared |
| Click "Next" on Return (if has photo) | screen: 'return' → 'review' |
| Adjust transparency slider | transparency: 0-100 |
| Click "Finish" (all checked) | screen: 'review' → 'summary' |
| Click "Finish" (some unchecked) | Show inline error: "X items still need to be checked." |
| Click copy button | copy to clipboard, show confirmation |
| Click "Restart" | Reset to initial state |

### Replace Photo Confirmations

| Action | Result |
|--------|--------|
| Replace reference photo | Confirm dialog → on confirm: clear markers, reset screen to 'reference' |
| Replace return photo | Confirm dialog → on confirm: reset all statuses to unchecked |

## CSS Approach

- **Plain CSS**: Single `index.css` file with CSS custom properties for theming
- **Mobile-first**: Default styles for 360px, `@media (min-width: 768px)` for tablet/desktop
- **Layout**: CSS Grid for main structure, Flexbox for components
- **No external frameworks**: Reset via minimal base styles
- **Variables**:
  ```css
  :root {
    --color-primary: #2563eb;
    --color-success: #16a34a;
    --color-warning: #ca8a04;
    --color-danger: #dc2626;
    --color-bg: #f8fafc;
    --color-surface: #ffffff;
    --color-text: #1e293b;
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --radius: 8px;
    --marker-size: 32px;
  }
  ```
- **Marker colors by status**:
  - Unchecked: `--color-primary` (blue)
  - Returned: `--color-success` (green)
  - Missing: `--color-danger` (red)

## Accessibility Decisions

1. **Keyboard navigation**: All interactive elements are `<button>` or use `tabindex="0"`, `onKeyDown` handlers for Enter/Space
2. **Focus indicators**: Visible outline on focus (e.g., `outline: 2px solid var(--color-primary)`)
3. **ARIA labels**:
   - Slider: `aria-label="Transparency" aria-valuemin="0" aria-valuemax="100"`
   - Markers: `aria-label="Item: {label}, Status: {status}" role="button"`
4. **Touch targets**: Minimum 44x44px via `min-width`, `min-height`, `padding`
5. **Color independence**: Status indicated by both color AND text/icon, not color alone
6. **Error messages**: Associated with form controls via `aria-describedby`
7. **Screen reader**: Proper heading hierarchy (h1 → h2 → h3)
8. **Dialogs**: `role="alertdialog"` with `aria-modal="true"` and focus trap