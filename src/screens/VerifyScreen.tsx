import { CompareSlider } from '../components/CompareSlider';
import { StepRail } from '../components/StepRail';
import { SlotLabel, STATUS_WORD } from '../components/SlotSheet';
import { useApp } from '../context/AppContext';
import { Status } from '../types';

const NEXT: Record<Status, Status> = {
  unchecked: 'present',
  unsure: 'missing',
  present: 'missing',
  missing: 'present',
};

export function VerifyScreen() {
  const app = useApp();
  const unresolved = app.slots.filter((slot) => slot.status === 'unchecked' || slot.status === 'unsure').length;
  const missing = app.slots.filter((slot) => slot.status === 'missing').length;

  return (
    <main className="screen screen-verify">
      <StepRail current={2} mode={app.mode} />
      <h1 className="title-sm">Check the flags</h1>
      <p className="lede">
        The scan compared each slot against the sealed photo. Tap a row to flip it. Nothing is filed until
        you say it is right.
      </p>

      <CompareSlider />

      <div className="verdict">
        <span className="verdict-count">{missing}</span>
        <span className="verdict-word">{missing === 1 ? 'item missing' : 'items missing'}</span>
        {unresolved > 0 ? (
          <span className="verdict-flag">
            {unresolved} to confirm
          </span>
        ) : null}
      </div>

      <ul className="result-list">
        {app.slots.map((slot, index) => (
          <li key={slot.id}>
            <button
              className={`result result-${slot.status}`}
              style={{ ['--i' as string]: index }}
              onClick={() => app.setStatus(slot.id, NEXT[slot.status])}
              aria-label={`${slot.label || `Slot ${index + 1}`}: ${STATUS_WORD[slot.status]}. Tap to change.`}
            >
              <span className="result-num">{index + 1}</span>
              <span className="result-body">
                <span className="result-name">
                  <SlotLabel slot={slot} index={index} />
                </span>
                <span className="result-state">{STATUS_WORD[slot.status]}</span>
              </span>
              {slot.confidence !== null ? (
                <span className="result-conf">{slot.confidence}%</span>
              ) : (
                <span className="result-conf result-conf-empty">—</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="verify-actions">
        <button
          className="btn btn-main"
          disabled={unresolved > 0}
          onClick={() => app.goTo('summary')}
        >
          File the report
        </button>
        {unresolved > 0 ? (
          <p className="hint">
            {unresolved === 1 ? 'One slot still needs a decision.' : `${unresolved} slots still need a decision.`}
          </p>
        ) : null}
        <button className="link" onClick={() => app.goTo('scan')}>
          Scan again
        </button>
      </div>
    </main>
  );
}
