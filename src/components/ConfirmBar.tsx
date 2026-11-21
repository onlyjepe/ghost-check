import { useApp } from '../context/AppContext';

export function ConfirmBar() {
  const { confirm, closeConfirm } = useApp();
  if (!confirm) return null;

  return (
    <div className="dialog-wrap">
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dialog-text">
        <p id="dialog-text">{confirm.message}</p>
        <div className="dialog-actions">
          <button type="button" className="btn btn-quiet" onClick={closeConfirm}>
            Keep as is
          </button>
          <button
            type="button"
            className="btn btn-hot"
            onClick={() => {
              confirm.run();
              closeConfirm();
            }}
          >
            {confirm.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
