import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Users,
  Bot,
  Globe,
  Grid3x3,
  Target,
  Trophy,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import AuthRequiredModal from "../../../components/Modals/AuthRequiredModal";
import styles from "./DashBoardPage.module.css";

const MODES = [
  {
    key: "local",
    path: "/game/local",
    Icon: Users,
    title: "Local 2-Player",
    badge: "vs Friend",
    desc: "Play face-to-face on the same device. Take turns and see who can get 5 in a row first.",
    color: "#558fe5",
    colorBg: "rgba(13,110,253,0.1)",
  },
  {
    key: "ai",
    path: "/game/ai",
    Icon: Bot,
    title: "vs AI",
    badge: "Solo",
    desc: "Challenge the computer at Easy, Medium, or Hard difficulty. A great way to sharpen your strategy.",
    color: "#c3a9f1",
    colorBg: "rgba(67, 47, 100, 0.1)",
  },
  {
    key: "online",
    path: "/online",
    Icon: Globe,
    title: "Online Arena",
    badge: "Multiplayer",
    desc: "Match up against real players in real-time. Create a room or join one and compete live.",
    color: "#66ddb7",
    colorBg: "rgba(10, 22, 116, 0.1)",
  },
];

const RULES = [
  {
    Icon: Grid3x3,
    title: "Board",
    text: "Games are played on a 10×10 or 15×15 grid of cells.",
  },
  {
    Icon: Target,
    title: "Objective",
    text: "Be the first to place 5 of your markers in a row — horizontally, vertically, or diagonally.",
  },
  {
    Icon: RotateCcw,
    title: "Turns",
    text: "Players alternate turns, placing one marker per turn on any empty cell.",
  },
  {
    Icon: Trophy,
    title: "Winning",
    text: "First to align 5 consecutive markers wins. A full board with no winner is a draw.",
  },
];

const STEPS = [
  "Pick a game mode — Local, AI, or Online.",
  "Configure the board size and choose your marker (X or O).",
  "Take turns placing your mark on any empty cell.",
  "First player to line up 5 consecutive marks wins.",
];

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const outletContext = useOutletContext() || {};
  const [localShowAuthModal, setLocalShowAuthModal] = useState(false);
  const showAuthModal = isAuthenticated
    ? localShowAuthModal
    : (outletContext.showAuthModal ?? false);
  const setShowAuthModal = isAuthenticated
    ? setLocalShowAuthModal
    : (outletContext.setShowAuthModal ?? setLocalShowAuthModal);

  const displayName = user?.displayName ?? user?.username ?? null;

  const handlePlay = (path) => {
    if (isAuthenticated) navigate(path);
    else setShowAuthModal(true);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          {isAuthenticated && displayName && (
            <p className={styles.heroWelcome}>Welcome back {displayName}!</p>
          )}
          <h1 className={styles.heroTitle}>
            TicTac<span className={styles.heroAccent}>Toang</span>
          </h1>
          <p className={styles.heroSub}>
            A modern take on the classic game. Play locally with a friend,
            challenge an AI opponent, or compete against real players worldwide.
          </p>
          <div className={styles.heroCtas}>
            <button
              type="button"
              className="btn btn-primary btn-lg px-4"
              onClick={() => handlePlay("/game/local")}
            >
              Play Now
              <ChevronRight size={18} className="ms-1" aria-hidden />
            </button>
            {!isAuthenticated && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg px-4"
                onClick={() => navigate("/register")}
              >
                Sign Up Free
              </button>
            )}
          </div>
        </div>

      </section>

      {/* ── GAME MODES ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Choose Your Mode</h2>
        <div className={styles.modeGrid}>
          {MODES.map(({ key, path, Icon, title, badge, desc, color, colorBg }) => (
            <button
              key={key}
              type="button"
              className={styles.modeCard}
              onClick={() => handlePlay(path)}
            >
              <div
                className={styles.modeIconWrap}
                style={{ background: colorBg, color }}
              >
                <Icon size={26} strokeWidth={1.75} aria-hidden />
              </div>
              <span className={styles.modeBadge} style={{ color }}>
                {badge}
              </span>
              <h3 className={styles.modeTitle}>{title}</h3>
              <p className={styles.modeDesc}>{desc}</p>
              <span className={styles.modeAction} style={{ color }}>
                Play <ChevronRight size={15} aria-hidden />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── HOW TO PLAY + RULES ── */}
      <section className={styles.section}>
        <div className={styles.infoGrid}>
          <div>
            <h2 className={styles.sectionTitle}>How to Play</h2>
            <ol className={styles.steps}>
              {STEPS.map((step, i) => (
                <li key={i} className={styles.stepItem}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <span className={styles.stepText}>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>Rules</h2>
            <div className={styles.rules}>
              {RULES.map(({ Icon, title, text }) => (
                <div key={title} className={styles.ruleRow}>
                  <div className={styles.ruleIcon}>
                    <Icon size={17} strokeWidth={2} aria-hidden />
                  </div>
                  <div>
                    <p className={styles.ruleTitle}>{title}</p>
                    <p className={styles.ruleText}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {isAuthenticated && (
        <AuthRequiredModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
