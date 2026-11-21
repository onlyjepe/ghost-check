import { useApp } from '../context/AppContext';

export function LandingScreen() {
  const { start, openSample } = useApp();

  return (
    <main className="screen screen-landing">
      <div className="hero">
        <div className="hero-art" aria-hidden="true">
          <div className="hero-moon" />
          <div className="hero-case">
            <div className="hero-slot hero-slot-lost" />
            <div className="hero-slot" />
            <div className="hero-slot" />
            <div className="hero-slot" />
          </div>
          <div className="hero-scan" />
        </div>
        <p className="kicker">Handover check</p>
        <h1 className="title">
          Ghost<span className="title-mark">Check</span>
        </h1>
        <p className="lede">
          Photograph a packed case once. Scan it when it comes back. Whatever did not return shows up as a
          ghost you can point at.
        </p>
      </div>

      <div className="landing-actions">
        <button className="btn btn-main" onClick={() => start('kit')}>
          Start a kit
        </button>
        <button className="btn btn-quiet" onClick={() => start('parcel')}>
          Start a parcel
        </button>
      </div>

      <section className="how" aria-label="How it works">
        <p className="how-title">Three moves, no typing until the end</p>
        <ol className="steps">
          <li>
            <span className="steps-num">1</span>
            <span>
              <strong>Mark the slots.</strong> Tap each thing in the packed photo. Up to ten.
            </span>
          </li>
          <li>
            <span className="steps-num">2</span>
            <span>
              <strong>Scan it back.</strong> Point the camera at the same case. The scan flags what looks
              gone.
            </span>
          </li>
          <li>
            <span className="steps-num">3</span>
            <span>
              <strong>File the gap.</strong> Confirm each flag, then copy the list of what is missing.
            </span>
          </li>
        </ol>
      </section>

      <section className="samples" aria-label="Sample checks">
        <p className="samples-title">Try one without your own photos</p>
        <div className="samples-row">
          <button className="sample" onClick={() => openSample('kit')}>
            <span className="sample-art sample-art-kit" aria-hidden="true" />
            <span className="sample-name">Camera bag</span>
            <span className="sample-note">6 slots · one battery gone</span>
          </button>
          <button className="sample" onClick={() => openSample('parcel')}>
            <span className="sample-art sample-art-parcel" aria-hidden="true" />
            <span className="sample-name">Delivery parcel</span>
            <span className="sample-note">5 slots · one power bank gone</span>
          </button>
        </div>
      </section>

      <p className="landing-foot">
        Photos stay in this tab. No account, no upload, no cloud. The scan is a first pass — you confirm
        every flag before it counts.
      </p>
    </main>
  );
}
