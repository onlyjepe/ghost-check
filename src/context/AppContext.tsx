import { createContext, useContext, useRef, useState, ReactNode } from 'react';
import { MAX_SLOTS, Mode, Photo, Sample, Screen, Slot, Status } from '../types';

interface Confirm {
  message: string;
  confirmLabel: string;
  run: () => void;
}

interface AppApi {
  screen: Screen;
  mode: Mode;
  photo: Photo | null;
  scanPhoto: Photo | null;
  sample: Sample | null;
  slots: Slot[];
  opacity: number;
  message: { text: string; bad: boolean } | null;
  confirm: Confirm | null;
  start: (mode: Mode) => void;
  openSample: (mode: Mode) => Promise<void>;
  goTo: (screen: Screen) => void;
  setMode: (mode: Mode) => void;
  setPhoto: (photo: Photo) => void;
  setScanPhoto: (photo: Photo | null) => void;
  addSlot: (x: number, y: number) => string | null;
  renameSlot: (id: string, label: string) => void;
  removeSlot: (id: string) => void;
  setStatus: (id: string, status: Status) => void;
  applyResults: (results: { id: string; status: Status; confidence: number }[]) => void;
  setOpacity: (value: number) => void;
  notify: (text: string, bad?: boolean) => void;
  ask: (confirm: Confirm) => void;
  closeConfirm: () => void;
  restart: () => void;
}

const AppContext = createContext<AppApi | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('landing');
  const [mode, setMode] = useState<Mode>('kit');
  const [photo, setPhotoState] = useState<Photo | null>(null);
  const [sample, setSample] = useState<Sample | null>(null);
  const [scanPhoto, setScanPhotoState] = useState<Photo | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [opacity, setOpacityState] = useState(50);
  const [message, setMessage] = useState<{ text: string; bad: boolean } | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const owned = useRef<string | null>(null);

  const notify = (text: string, bad = false) => setMessage({ text, bad });
  const ask = (next: Confirm) => setConfirm(next);
  const closeConfirm = () => setConfirm(null);

  const goTo = (next: Screen) => {
    setMessage(null);
    setScreen(next);
  };

  const setPhoto = (next: Photo) => {
    if (owned.current) URL.revokeObjectURL(owned.current);
    owned.current = next.url;
    setPhotoState(next);
  };

  const setScanPhoto = (next: Photo | null) => setScanPhotoState(next);

  const reset = () => {
    if (owned.current) URL.revokeObjectURL(owned.current);
    owned.current = null;
    setPhotoState(null);
    setScanPhotoState(null);
    setSample(null);
    setSlots([]);
    setOpacityState(50);
    setMessage(null);
    setConfirm(null);
  };

  const start = (next: Mode) => {
    reset();
    setMode(next);
    goTo('seal');
  };

  const openSample = async (next: Mode) => {
    reset();
    setMode(next);
    const response = await fetch(`${import.meta.env.BASE_URL}demo/samples.json`);
    const data = await response.json();
    const chosen: Sample = data[next];
    setSample(chosen);
    setPhotoState({ url: chosen.reference, width: 1200, height: 800 });
    setSlots(
      chosen.slots.map((slot) => ({
        id: crypto.randomUUID(),
        label: '',
        x: slot.x,
        y: slot.y,
        status: 'unchecked' as Status,
        confidence: null,
      })),
    );
    goTo('seal');
    notify(
      next === 'kit'
        ? 'Sample camera bag loaded. Six slots are marked — name them, or seal it as is.'
        : 'Sample parcel loaded. Five slots are marked — name them, or seal it as is.',
    );
  };

  const addSlot = (x: number, y: number) => {
    if (slots.length >= MAX_SLOTS) {
      notify(`That is ${MAX_SLOTS} slots. Remove one before adding another.`, true);
      return null;
    }
    const id = crypto.randomUUID();
    setSlots((current) => [...current, { id, label: '', x, y, status: 'unchecked', confidence: null }]);
    return id;
  };

  const renameSlot = (id: string, label: string) => {
    setSlots((current) => current.map((slot) => (slot.id === id ? { ...slot, label } : slot)));
  };

  const removeSlot = (id: string) => {
    setSlots((current) => current.filter((slot) => slot.id !== id));
  };

  const setStatus = (id: string, status: Status) => {
    setMessage(null);
    setSlots((current) => current.map((slot) => (slot.id === id ? { ...slot, status } : slot)));
  };

  const applyResults = (results: { id: string; status: Status; confidence: number }[]) => {
    setSlots((current) =>
      current.map((slot) => {
        const hit = results.find((result) => result.id === slot.id);
        return hit ? { ...slot, status: hit.status, confidence: hit.confidence } : slot;
      }),
    );
  };

  const setOpacity = (value: number) => setOpacityState(value);

  const restart = () => {
    reset();
    goTo('landing');
  };

  return (
    <AppContext.Provider
      value={{
        screen,
        mode,
        photo,
        scanPhoto,
        sample,
        slots,
        opacity,
        message,
        confirm,
        start,
        openSample,
        goTo,
        setMode,
        setPhoto,
        setScanPhoto,
        addSlot,
        renameSlot,
        removeSlot,
        setStatus,
        applyResults,
        setOpacity,
        notify,
        ask,
        closeConfirm,
        restart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppApi {
  const api = useContext(AppContext);
  if (!api) throw new Error('useApp outside provider');
  return api;
}
