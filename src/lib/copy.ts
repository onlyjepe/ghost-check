import { Mode } from '../types';

export const words = (mode: Mode) =>
  mode === 'kit'
    ? { unit: 'kit', person: 'borrower', verb: 'rented out', scan: 'Scan the kit' }
    : { unit: 'parcel', person: 'recipient', verb: 'sent out', scan: 'Scan the parcel' };
