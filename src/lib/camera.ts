import { useEffect, useRef, useState } from 'react';

export type CameraState = 'idle' | 'starting' | 'live' | 'blocked';

const REASONS: Record<string, string> = {
  NotAllowedError: 'The camera is blocked for this page. Allow it in the browser, or use a photo instead.',
  NotFoundError: 'No camera on this device. Use a photo instead.',
  NotReadableError: 'Another app is using the camera. Close it and try again.',
  OverconstrainedError: 'This camera cannot do what the page asked for. Use a photo instead.',
};

export function useCamera(active: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setState('starting');
    setError(null);

    navigator.mediaDevices
      ?.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play().catch(() => undefined);
        }
        setState('live');
      })
      .catch((reason: DOMException) => {
        if (cancelled) return;
        setState('blocked');
        setError(REASONS[reason?.name] ?? 'The camera did not start. Use a photo instead.');
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setState('idle');
    };
  }, [active, attempt]);

  return { videoRef, state, error, retry: () => setAttempt((n) => n + 1) };
}
