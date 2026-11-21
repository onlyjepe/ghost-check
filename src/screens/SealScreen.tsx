import { useRef, useState } from 'react';
import { StepRail } from '../components/StepRail';
import { Pin } from '../components/Pin';
import { SlotSheet, SlotLabel } from '../components/SlotSheet';
import { useApp } from '../context/AppContext';
import { loadImage, validateFile } from '../lib/image';
import { MAX_SLOTS } from '../types';

export function SealScreen() {
  const app = useApp();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const takeFile = async (file: File | undefined) => {
    if (!file) return;
    const problem = validateFile(file);
    if (problem) {
      app.notify(problem, true);
      return;
    }
    setBusy(true);
    try {
      const loaded = await loadImage(file);
      if (app.photo && app.slots.length) {
        app.ask({
          message: 'Swap the reference photo? Every slot you marked goes with the old one.',
          confirmLabel: 'Swap photo',
          run: () => {
            app.setPhoto(loaded);
            app.goTo('seal');
            app.notify('New reference in place. Mark the slots again.');
          },
        });
      } else {
        app.setPhoto(loaded);
        app.notify('Reference photo in place. Tap the things you want to track.');
      }
    } catch (error) {
      app.notify(error instanceof Error ? error.message : 'That photo could not be opened.', true);
    } finally {
      setBusy(false);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const openSlot = open ? app.slots.findIndex((slot) => slot.id === open) : -1;
  const unnamed = app.slots.filter((slot) => !slot.label.trim()).length;

  return (
    <main className="screen screen-seal">
      <StepRail current={0} mode={app.mode} />
      <h1 className="title-sm">Name the slots</h1>
      <p className="lede">
        {app.photo
          ? 'Tap anything in the photo that should come back. Then write its name — the report uses your words.'
          : 'First, a photo of the case while it is full. Flat light, straight on, nothing in front of it.'}
      </p>

      <div className="stage">
        {app.photo ? (
          <div className="frame" style={{ aspectRatio: `${app.photo.width} / ${app.photo.height}` }}>
            <img src={app.photo.url} alt="Reference" className="frame-image" />
            <button
              type="button"
              className="frame-hit"
              aria-label="Add a slot"
              onClick={(event) => {
                const box = event.currentTarget.getBoundingClientRect();
                const id = app.addSlot(
                  (event.clientX - box.left) / box.width,
                  (event.clientY - box.top) / box.height,
                );
                if (id) setOpen(id);
              }}
            />
            {app.slots.map((slot, index) => (
              <Pin key={slot.id} slot={slot} index={index} onOpen={() => setOpen(slot.id)} />
            ))}
          </div>
        ) : (
          <div className="frame frame-empty">
            <span>No reference photo yet</span>
          </div>
        )}
      </div>

      <div className="seal-tools">
        <span className="counter">
          {app.slots.length} / {MAX_SLOTS} slots
        </span>
        <button className="btn btn-quiet btn-sm" disabled={busy} onClick={() => inputRef.current?.click()}>
          {app.photo ? 'Swap photo' : 'Choose a photo'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(event) => void takeFile(event.target.files?.[0])}
      />

      {app.photo && app.slots.length > 0 ? (
        <div className="slot-list">
          {unnamed > 0 ? (
            <p className="nudge">
              {unnamed === 1 ? 'One slot has no name yet.' : `${unnamed} slots have no name yet.`} Write
              your item in each one, or leave it as a number.
            </p>
          ) : null}
          {app.slots.map((slot, index) => (
            <button key={slot.id} className="slot-row" onClick={() => setOpen(slot.id)}>
              <span className="slot-num">{index + 1}</span>
              <span className="slot-name">
                <SlotLabel slot={slot} index={index} />
              </span>
              <span className="slot-edit">edit</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="seal-actions">
        <button
          className="btn btn-main"
          disabled={!app.photo || app.slots.length === 0}
          onClick={() => app.goTo('scan')}
        >
          Seal it and scan
        </button>
        {!app.photo || app.slots.length === 0 ? (
          <p className="hint">
            {app.photo ? 'Mark at least one slot to continue.' : 'Choose a photo to continue.'}
          </p>
        ) : null}
      </div>

      {openSlot >= 0 ? (
        <SlotSheet slot={app.slots[openSlot]} index={openSlot} onClose={() => setOpen(null)} />
      ) : null}
    </main>
  );
}
