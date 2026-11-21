import { Slot } from '../types';

export function Pin({
  slot,
  index,
  onOpen,
  dim,
}: {
  slot: Slot;
  index: number;
  onOpen?: () => void;
  dim?: boolean;
}) {
  return (
    <button
      type="button"
      className={`pin pin-${slot.status}${dim ? ' pin-dim' : ''}`}
      style={{ left: `${slot.x * 100}%`, top: `${slot.y * 100}%`, ['--i' as string]: index }}
      onClick={(event) => {
        event.stopPropagation();
        onOpen?.();
      }}
      aria-label={`Slot ${index + 1}${slot.label ? `, ${slot.label}` : ', unnamed'}`}
    >
      <span className="pin-dot">{index + 1}</span>
      {slot.label ? <span className="pin-name">{slot.label}</span> : null}
    </button>
  );
}
