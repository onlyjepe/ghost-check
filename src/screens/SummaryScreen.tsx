import { useState } from 'react';
import { SlotLabel } from '../components/SlotSheet';
import { useApp } from '../context/AppContext';
import { words } from '../lib/copy';

export function SummaryScreen() {
  const app = useApp();
  const [copied, setCopied] = useState(false);
  const missing = app.slots.filter((slot) => slot.status === 'missing');
  const copy = words(app.mode);

  const names = missing.map((slot) => slot.label.trim());
  const report = names.length
    ? `Missing from the ${copy.unit} (${names.length})\n${names
        .map((name, i) => `- ${name || `Slot ${i + 1}`}`)
        .join('\n')}`
    : `Everything came back. ${app.slots.length} slots checked.`;

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      app.notify('The clipboard refused. Select the text and copy it by hand.', true);
    }
  };

  return (
    <main className="screen screen-summary">
      <p className="kicker">Filed · {new Date().toLocaleDateString('en-GB')}</p>
      <h1 className="title-sm">
        {missing.length === 0
          ? 'Nothing missing.'
          : missing.length === 1
            ? 'One thing did not come back.'
            : `${missing.length} things did not come back.`}
      </h1>

      {missing.length ? (
        <ul className="missing-list">
          {missing.map((slot, index) => {
            const position = app.slots.indexOf(slot) + 1;
            return (
              <li key={slot.id} style={{ ['--i' as string]: index }}>
                <span className="missing-num">{position}</span>
                <span className="missing-name">
                  <SlotLabel slot={slot} index={position - 1} />
                </span>
                {slot.confidence !== null ? <span className="missing-conf">{slot.confidence}%</span> : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="lede">All {app.slots.length} slots still hold what they should. Nothing to chase.</p>
      )}

      <div className="report">
        <pre className="report-text">{report}</pre>
        <button className="btn btn-quiet btn-sm" onClick={() => void copyReport()}>
          {copied ? 'Copied' : 'Copy the list'}
        </button>
      </div>

      <div className="summary-actions">
        <button className="btn btn-main" onClick={() => app.goTo('scan')}>
          Scan again
        </button>
        <button className="link" onClick={app.restart}>
          Start a new check
        </button>
      </div>

      <p className="hint">
        The {copy.person} gets the list, not the photos. Screenshots stay on this device unless you share
        them.
      </p>
    </main>
  );
}
