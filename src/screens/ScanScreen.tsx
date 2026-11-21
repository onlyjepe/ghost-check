import { useCallback, useEffect, useRef, useState } from 'react';
import { StepRail } from '../components/StepRail';
import { useApp } from '../context/AppContext';
import { useCamera } from '../lib/camera';
import { loadImage, validateFile } from '../lib/image';
import { align, grayFrom, grayFromUrl, judge, similarity, signature, Verdict } from '../lib/scan';
import { Slot } from '../types';

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export function ScanScreen() {
  const app = useApp();
  const { videoRef, state, error, retry } = useCamera(true);
  const [busy, setBusy] = useState(false);
  const [readout, setReadout] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const runScan = useCallback(
    async (source: CanvasImageSource, from: string) => {
      if (!app.photo || app.slots.length === 0 || busy) return;
      setBusy(true);
      setReadout('Matching the frame');
      try {
        const reference = await grayFromUrl(app.photo.url);
        const frame = grayFrom(source);
        const shift = align(reference, frame);
        app.setScanPhoto({ url: snapshot(source), width: 900, height: 600 });
        const results = app.slots.map((slot: Slot) => {
          const a = signature(reference, slot.x, slot.y);
          const b = signature(frame, slot.x, slot.y, shift);
          const { verdict, confidence } = judge(similarity(a, b));
          return { id: slot.id, status: verdict as Verdict, confidence };
        });
        await sleep(520);
        app.applyResults(results);
        const gone = results.filter((result) => result.status === 'missing').length;
        const unsure = results.filter((result) => result.status === 'unsure').length;
        app.goTo('verify');
        app.notify(
          gone === 0 && unsure === 0
            ? `All ${results.length} slots look filled. Glance at the list before you file it.`
            : `${gone} look missing, ${unsure} need your eyes. Every flag waits for your tap.`,
          gone > 0,
        );
        void from;
      } catch {
        app.notify('The scan did not finish. Try again, or check each slot by hand.', true);
      } finally {
        setBusy(false);
        setReadout('');
      }
    },
    [app, busy],
  );

  const scanCamera = () => {
    const video = videoRef.current;
    if (!video || state !== 'live') return;
    void runScan(video, 'camera');
  };

  const scanSample = async () => {
    if (!app.sample) return;
    const loaded = await loadImageFromUrl(app.sample.scans[0]);
    void runScan(loaded, 'sample');
  };

  const scanFile = async (file: File | undefined) => {
    if (!file) return;
    const problem = validateFile(file);
    if (problem) {
      app.notify(problem, true);
      return;
    }
    try {
      const photo = await loadImage(file);
      const loaded = await loadImageFromUrl(photo.url);
      URL.revokeObjectURL(photo.url);
      void runScan(loaded, 'photo');
    } catch {
      app.notify('That photo could not be opened.', true);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  useEffect(() => {
    const stop = () => undefined;
    return stop;
  }, []);

  return (
    <main className="screen screen-scan">
      <StepRail current={1} mode={app.mode} />
      <h1 className="title-sm">Scan it back</h1>
      <p className="lede">
        Fill the frame the way the reference photo was shot. The scan compares slot by slot, not the whole
        picture.
      </p>

      <div className={`stage stage-camera${busy ? ' stage-busy' : ''}`}>
        {(state === 'live' || state === 'starting') && (
          <video ref={videoRef} className="video" playsInline muted autoPlay aria-label="Camera" />
        )}
        <div className="guide" aria-hidden="true">
          <span className="guide-corner guide-tl" />
          <span className="guide-corner guide-tr" />
          <span className="guide-corner guide-bl" />
          <span className="guide-corner guide-br" />
          {busy ? <span className="guide-sweep" /> : null}
        </div>
        {state === 'blocked' ? (
          <div className="camera-note">
            <p>{error}</p>
            <div className="camera-note-actions">
              <button className="btn btn-quiet btn-sm" onClick={retry}>
                Try again
              </button>
              {app.sample ? (
                <button className="btn btn-main btn-sm" onClick={() => void scanSample()}>
                  Use the sample return
                </button>
              ) : (
                <button className="btn btn-main btn-sm" onClick={() => inputRef.current?.click()}>
                  Choose a photo
                </button>
              )}
            </div>
          </div>
        ) : null}
        {readout ? <p className="readout">{readout}</p> : null}
      </div>

      <div className="scan-actions">
        <button className="btn btn-main" disabled={state !== 'live' || busy} onClick={scanCamera}>
          {busy ? 'Reading the slots' : `Scan ${app.slots.length} slots`}
        </button>
        <div className="scan-alt">
          {app.sample ? (
            <button className="link" onClick={() => void scanSample()} disabled={busy}>
              Use the sample return instead
            </button>
          ) : (
            <button className="link" onClick={() => inputRef.current?.click()} disabled={busy}>
              Use a photo instead
            </button>
          )}
          <button className="link" onClick={() => app.goTo('seal')} disabled={busy}>
            Back to the slots
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(event) => void scanFile(event.target.files?.[0])}
      />

      <p className="hint">
        Nothing leaves this tab. The scan is arithmetic on pixels, not a model — it can be wrong, which is
        why every result is yours to confirm.
      </p>
    </main>
  );
}

async function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}

function snapshot(source: CanvasImageSource): string {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.72);
}
