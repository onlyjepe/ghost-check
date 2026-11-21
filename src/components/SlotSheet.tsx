import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Slot } from '../types';

export const STATUS_WORD: Record<Slot['status'], string> = {
  unchecked: 'Not checked',
  present: 'Still there',
  missing: 'Missing',
  unsure: 'Needs a look',
};

export function SlotLabel({ slot, index }: { slot: Slot; index: number }) {
  if (slot.label.trim()) return <>{slot.label}</>;
  return (
    <>
      Slot {index + 1}
      <span className="slot-unnamed"> · unnamed</span>
    </>
  );
}

export function SlotSheet({
  slot,
  index,
  onClose,
}: {
  slot: Slot;
  index: number;
  onClose: () => void;
}) {
  const { renameSlot, removeSlot } = useApp();
  const [draft, setDraft] = useState(slot.label);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Name this slot">
        <div className="sheet-grip" />
        <p className="sheet-kicker">Slot {index + 1}</p>
        <label className="sheet-field">
          <span>What is in it?</span>
          <input
            autoFocus
            maxLength={28}
            value={draft}
            placeholder="Write your item"
            onChange={(event) => {
              setDraft(event.target.value);
              renameSlot(slot.id, event.target.value);
            }}
          />
        </label>
        <p className="sheet-hint">
          Name it the way you would say it out loud. Unnamed slots print as numbers on the report.
        </p>
        <div className="sheet-actions">
          <button className="btn btn-quiet" onClick={() => removeSlot(slot.id)}>
            Remove slot
          </button>
          <button className="btn btn-main" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </>
  );
}
