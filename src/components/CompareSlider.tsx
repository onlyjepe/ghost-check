import { useApp } from '../context/AppContext';

export function CompareSlider() {
  const { photo, scanPhoto, opacity, setOpacity } = useApp();
  if (!photo || !scanPhoto) return null;
  return (
    <div className="compare">
      <div className="compare-frame">
        <img src={photo.url} alt="Sealed reference" className="compare-base" />
        <img src={scanPhoto.url} alt="Latest scan" className="compare-over" style={{ opacity: opacity / 100 }} />
      </div>
      <label className="compare-control">
        <span>Sealed</span>
        <input
          type="range"
          min={0}
          max={100}
          value={opacity}
          onChange={(event) => setOpacity(Number(event.target.value))}
          aria-label="Blend the sealed photo with the scan"
        />
        <span>Scan</span>
      </label>
    </div>
  );
}
