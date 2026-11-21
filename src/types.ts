export type Mode = 'kit' | 'parcel';

export type Status = 'unchecked' | 'present' | 'missing' | 'unsure';

export type Screen = 'landing' | 'seal' | 'scan' | 'verify' | 'summary';

export const MAX_SLOTS = 10;

export interface Slot {
  id: string;
  label: string;
  x: number;
  y: number;
  status: Status;
  confidence: number | null;
}

export interface Photo {
  url: string;
  width: number;
  height: number;
}

export interface Sample {
  reference: string;
  scans: string[];
  slots: { label: string; x: number; y: number }[];
}
