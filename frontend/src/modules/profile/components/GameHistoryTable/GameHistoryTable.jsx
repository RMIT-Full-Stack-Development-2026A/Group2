import { Trophy } from "lucide-react";

export default function GameHistoryTable({ embedded = false }) {
  const inner = (
    <div className={embedded ? "text-center" : "text-center py-5 px-3"}>
      <div className="d-inline-flex rounded-circle bg-light p-3 mb-3">
        <Trophy size={40} strokeWidth={1.75} className="text-secondary" aria-hidden />
      </div>
      <h2 className="h5 fw-semibold mb-2 text-dark">Match history</h2>
      <p className="text-secondary mb-0 profile-history-blurb small">
        We&apos;re building this right now — coming soon.
      </p>
    </div>
  );

  if (embedded) {
    return inner;
  }

  return (
    <div className="card w-100 shadow-sm border border-secondary-subtle rounded-3">
      {inner}
    </div>
  );
}
