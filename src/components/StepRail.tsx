const STEPS = ['Name the slots', 'Scan it', 'Report'];

export function StepRail({ current, mode }: { current: number; mode: string }) {
  return (
    <nav className="rail" aria-label="Progress">
      <span className="rail-mode">{mode === 'kit' ? 'Kit' : 'Parcel'}</span>
      {STEPS.map((step, index) => (
        <span key={step} className={`rail-step${index <= current ? ' rail-on' : ''}`}>
          <i className="rail-num">{index + 1}</i>
          {step}
        </span>
      ))}
    </nav>
  );
}
