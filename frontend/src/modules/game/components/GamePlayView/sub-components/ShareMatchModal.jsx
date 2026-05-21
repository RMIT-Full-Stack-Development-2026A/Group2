import { useState } from "react";
import styles from "./ShareMatchModal.module.css";

export default function ShareMatchModal({ open, url, onClose }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  if (!open) return null;

  async function handleCopy() {
    setCopyError("");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError("Could not copy the link. Select the URL and copy it manually.");
    }
  }

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Share live match"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <p className={styles.kicker}>Spectator mode</p>
          <h2 className={styles.title}>Share this live match</h2>
          <p className={styles.description}>
            Anyone with this link can watch the match live without signing in.
          </p>
        </div>

        <div className={styles.linkRow}>
          <input
            className={styles.input}
            value={url}
            readOnly
            onFocus={(event) => event.target.select()}
            aria-label="Spectator link"
          />
          <button type="button" className={styles.primaryButton} onClick={handleCopy}>
            Copy Link
          </button>
        </div>

        {copied ? <p className={styles.successText}>Link copied.</p> : null}
        {copyError ? <p className={styles.errorText}>{copyError}</p> : null}

        <div className={styles.footer}>
          <button type="button" className={styles.secondaryButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
