import { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ConfirmBar } from './components/ConfirmBar';
import { LandingScreen } from './screens/LandingScreen';
import { SealScreen } from './screens/SealScreen';
import { ScanScreen } from './screens/ScanScreen';
import { VerifyScreen } from './screens/VerifyScreen';
import { SummaryScreen } from './screens/SummaryScreen';

function Toast({ text, bad }: { text: string; bad: boolean }) {
  const [shown, setShown] = useState(true);

  useEffect(() => {
    setShown(true);
    const timer = window.setTimeout(() => setShown(false), 5200);
    return () => window.clearTimeout(timer);
  }, [text, bad]);

  if (!shown) return null;
  return (
    <div className={`toast${bad ? ' toast-bad' : ''}`} role="status" aria-live="polite">
      {text}
    </div>
  );
}

function Current() {
  const { screen, message } = useApp();

  return (
    <>
      {screen === 'seal' ? <SealScreen /> : null}
      {screen === 'scan' ? <ScanScreen /> : null}
      {screen === 'verify' ? <VerifyScreen /> : null}
      {screen === 'summary' ? <SummaryScreen /> : null}
      {screen === 'landing' ? <LandingScreen /> : null}
      {message ? <Toast text={message.text} bad={message.bad} /> : null}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="shell">
        <Current />
      </div>
      <ConfirmBar />
    </AppProvider>
  );
}
