import MatchReplayBoard from "./sub-components/MatchReplayBoard";
import MatchReplayControls from "./sub-components/MatchReplayControls";
import { formatDateTime } from "../../utils/datetime.utils";
import {
  toAlgebraic,
  getReplayWinningCellsToHighlight,
} from "../../utils/replay.utils";
import styles from "./MatchReplay.module.css";

export default function MatchReplay({
  replayData,
  board,
  currentMoveIndex,
  isPlaying,
  currentMove,
  totalMoves,
  onPlayPause,
  onPrevious,
  onNext,
  onSliderChange,
}) {
  if (!replayData) {
    return (
      <div className="p-4 text-center text-muted">
        No replay data available.
      </div>
    );
  }

  const { session, participants } = replayData;
  const player1 = participants?.[0] || {};
  const player2 = participants?.[1] || {};
  const isAborted =
    session.status === "aborted" || session.result === "aborted";
  const winningCellsToHighlight = getReplayWinningCellsToHighlight({
    board,
    winningLine: session.winningLine,
    currentMoveIndex,
    totalMoves,
    isAborted,
  });

  return (
    <div className={styles.replay}>
      <header className={styles.header}>
        <h2 className={styles.title}>Match Replay</h2>

      </header>

      <section className={styles.boardWrap} aria-label="Game board">
        <MatchReplayBoard
          board={board}
          size={session.boardSize}
          boardStyle="classic"
          marker1={player1.marker || "X"}
          marker2={player2.marker || "O"}
          winningCellsToHighlight={winningCellsToHighlight}
          compact
        />
      </section>

      <section className={styles.panel} aria-label="Playback controls">
        <MatchReplayControls
          currentMove={currentMove}
          currentMoveIndex={currentMoveIndex}
          totalMoves={totalMoves}
          isPlaying={isPlaying}
          participants={participants}
          onPlayPause={onPlayPause}
          onPrevious={onPrevious}
          onNext={onNext}
          onSliderChange={onSliderChange}
        />
      </section>

      <div className={styles.bottomGrid}>
        <section className={styles.panel} aria-label="Move log">
          <div className={styles.sectionHeader}>
            <h3 className={styles.moveLogTitle}>Move Log</h3>
            <button
              type="button"
              className={styles.textButton}
              onClick={() => onSliderChange(0)}
              disabled={currentMoveIndex === 0}
            >
              Restart
            </button>
          </div>
          <div className={styles.moveGrid} role="list">
            {(replayData.moves || []).map((move, idx) => {
              const isActive = idx === currentMoveIndex;
              const coord = toAlgebraic(move.rowIndex, move.colIndex);

              return (
                <button
                  key={move.id || idx}
                  type="button"
                  role="listitem"
                  className={`${styles.moveChip} ${isActive ? styles.moveChipActive : ""}`}
                  onClick={() => onSliderChange(idx)}
                  aria-current={isActive ? "step" : undefined}
                >
                  {move.moveNumber}. {coord}
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.panel} aria-label="Game details">
          <h3 className={styles.sectionTitle}>Game details</h3>
          <dl className={styles.detailsList}>
            <div className={styles.detailRow}>
              <dt className={styles.detailLabel}>Board size</dt>
              <dd className={styles.detailValue}>
                {session.boardSize}×{session.boardSize}
              </dd>
            </div>
            <div className={styles.detailRow}>
              <dt className={styles.detailLabel}>Total moves</dt>
              <dd className={styles.detailValue}>{totalMoves}</dd>
            </div>
            {session.startTime && (
              <div className={styles.detailRow}>
                <dt className={styles.detailLabel}>Started</dt>
                <dd className={styles.detailValue}>
                  {formatDateTime(session.startTime)}
                </dd>
              </div>
            )}
            {session.endTime && (
              <div className={styles.detailRow}>
                <dt className={styles.detailLabel}>Ended</dt>
                <dd className={styles.detailValue}>
                  {formatDateTime(session.endTime)}
                </dd>
              </div>
            )}
          </dl>
        </section>
      </div>
    </div>
  );
}
