import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchMatchReplayRequest } from "../api/profile.api";

export function useMatchReplay(sessionId) {
  const [replayData, setReplayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setReplayData(null);
      setCurrentMoveIndex(0);
      setError("");
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchMatchReplayRequest(sessionId);
        const body = await response.json().catch(() => ({}));

        if (cancelled) return;
        if (!response.ok) {
          setReplayData(null);
          setError(body.message || "Unable to load replay.");
          return;
        }

        setReplayData(body.replay || null);
        setCurrentMoveIndex(0);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load replay.");
          setReplayData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (!isPlaying || !replayData?.moves?.length) return;
    if (currentMoveIndex >= replayData.moves.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentMoveIndex((prev) =>
        Math.min(prev + 1, replayData.moves.length - 1),
      );
    }, 800);

    return () => clearTimeout(timer);
  }, [isPlaying, currentMoveIndex, replayData]);

  const board = useMemo(() => {
    if (!replayData) return null;
    const boardSize = replayData.session?.boardSize || 10;
    const grid = Array.from({ length: boardSize }, () =>
      Array(boardSize).fill(null),
    );
    const participants = (replayData.participants || []).reduce(
      (map, participant) => {
        map[participant.id] = participant;
        return map;
      },
      {},
    );

    (replayData.moves || []).slice(0, currentMoveIndex + 1).forEach((move) => {
      const participant = participants[move.participantID];
      if (!participant) return;
      grid[move.rowIndex][move.colIndex] =
        participant.turnOrder === 1 ? "P1" : "P2";
    });
    return grid;
  }, [replayData, currentMoveIndex]);

  const currentMove = useMemo(() => {
    if (!replayData?.moves?.length) return null;
    return replayData.moves[currentMoveIndex] || null;
  }, [replayData, currentMoveIndex]);

  const totalMoves = replayData?.moves?.length || 0;

  const handlePlayPause = useCallback(() => {
    if (!replayData) return;
    if (!isPlaying && currentMoveIndex >= totalMoves - 1) {
      setCurrentMoveIndex(0);
    }
    setIsPlaying((prev) => !prev);
  }, [replayData, currentMoveIndex, isPlaying, totalMoves]);

  const handlePrevious = useCallback(() => {
    setIsPlaying(false);
    setCurrentMoveIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setIsPlaying(false);
    setCurrentMoveIndex((prev) => Math.min(prev + 1, totalMoves - 1));
  }, [totalMoves]);

  const handleSliderChange = useCallback(
    (value) => {
      setIsPlaying(false);
      setCurrentMoveIndex(Math.max(0, Math.min(value, totalMoves - 1)));
    },
    [totalMoves],
  );

  return {
    replayData,
    loading,
    error,
    currentMoveIndex,
    isPlaying,
    board,
    currentMove,
    totalMoves,
    handlePlayPause,
    handlePrevious,
    handleNext,
    handleSliderChange,
  };
}
