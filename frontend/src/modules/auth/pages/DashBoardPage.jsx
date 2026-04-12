import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function GameModeCard({ variant, titleLines, heartSrc, hint, to, asLink }) {
  const className = `game-mode-card game-mode-card--${variant} h-100 ${
    asLink ? "text-decoration-none text-reset d-block" : ""
  }`;

  const inner = (
    <>
      <div className="game-mode-card__title" role="heading" aria-level={2}>
        {titleLines.map((line, i) => (
          <span key={`${i}-${line}`}>
            {i > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </div>
      <div className="game-mode-card__icon-wrap">
        <img
          className="game-mode-card__icon"
          src={heartSrc}
          alt=""
          width={120}
          height={120}
        />
      </div>
      <p className="game-mode-card__hint">{hint}</p>
    </>
  );

  if (asLink && to) {
    return (
      <Link to={to} className={className}>
        {inner}
      </Link>
    );
  }

  return <article className={className}>{inner}</article>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.username ?? "player";

  return (
    <>
      <div className="text-center mb-5 dashboard-welcome">
        <h1 className="dashboard-welcome__heading">
          Welcome, {displayName}
        </h1>
        <p className="dashboard-welcome__tagline mb-0">
          CHOOSE A GAME MODE TO START PLAYING NOW!
        </p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-md-4">
          <GameModeCard
            variant="blue"
            titleLines={["Local 2-player"]}
            heartSrc="/blue.png"
            hint="Share one device: take turns on the same screen with a friend beside you."
          />
        </div>

        <div className="col-md-4">
          <GameModeCard
            variant="red"
            titleLines={["Play vs AI"]}
            heartSrc="/heart.png"
            hint="Face the computer—pick Easy, Medium, or Hard when you start a match."
          />
        </div>

        <div className="col-md-4">
          <GameModeCard
            variant="green"
            titleLines={["Online Arena"]}
            heartSrc="/green1.png"
            hint="Join the lobby, find a room, and play against others in real time."
            to="/online"
            asLink
          />
        </div>

        <div className="col-12 text-center mt-2">
          <Link to="/profile" className="fw-semibold link-dark">
            View Profile
          </Link>
        </div>
      </div>
    </>
  );
}
