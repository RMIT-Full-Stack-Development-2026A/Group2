import { Check, Clipboard, X } from "lucide-react";
import styles from "./ShareMatchModal.module.css";

export default function ShareMatchModal({
  open,
  shareUrl,
  error,
  copied,
  onCopy,
  onClose,
}) {
  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Share this live match"
    >
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close share match popup"
          onClick={onClose}
        >
          <X className={styles.closeIcon} aria-hidden="true" />
        </button>

        <div className={styles.header}>
          <p className={styles.kicker}>Spectator mode</p>
          <h2 className={styles.title}>Share this live match</h2>
          <p className={styles.description}>
            Anyone with this link can watch the match live without signing in.
          </p>
        </div>

        {error ? <p className={styles.errorText}>{error}</p> : null}

        {shareUrl ? (
          <div className={styles.linkBox}>
            <input
              className={styles.linkInput}
              value={shareUrl}
              readOnly
              aria-label="Spectator share link"
              onFocus={(event) => event.target.select()}
            />
            <button type="button" className={styles.copyButton} onClick={onCopy}>
              {copied ? (
                <Check className={styles.buttonIcon} aria-hidden="true" />
              ) : (
                <Clipboard className={styles.buttonIcon} aria-hidden="true" />
              )}
              Copy Link
            </button>
          </div>
        ) : null}

        {copied ? <p className={styles.successText}>Link copied.</p> : null}
      </div>
    </div>
  );
}
