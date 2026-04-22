export default function GameChat({ currentUser, opponent }) {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body">
        <h2 className="h6 mb-2">Game Chat</h2>
        <p className="text-secondary small mb-2">
          Chat between {currentUser || "Player 1"} and {opponent || "Player 2"}.
        </p>
        <div className="alert alert-secondary py-2 mb-0 small">
          Realtime chat is not connected yet.
        </div>
      </div>
    </section>
  );
}
