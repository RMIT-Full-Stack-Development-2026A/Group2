import useGameChat from "./GameChat.hook";
import styles from "./GameChat.module.css";

export default function GameChat({ roomCode, disabled = false }) {
  const {
    messages,
    input,
    setInput,
    bottomRef,
    sendMessage,
    handleKeyDown,
  } = useGameChat(roomCode, disabled);

  return (
    <section className={`card border-0 shadow-sm ${styles.chatCard}`}>
      <div className={`card-body d-flex flex-column ${styles.chatBody}`}>
        <h2 className="h6 mb-2">Game Chat</h2>

        <div className={`flex-grow-1 mb-2 ${styles.messageList}`}>
          {messages.length === 0 ? (
            <p className="text-secondary small text-center mt-3">
              No messages yet. Say hi!
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={`${msg.from}-${index}`}
                className={`d-flex mb-1 ${
                  msg.from === "you"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className={`px-3 py-1 rounded-3 small ${styles.messageBubble} ${
                    msg.from === "you"
                      ? "bg-primary text-white"
                      : "bg-light text-dark"
                  }`}
                >
                  <span
                    className={`fw-semibold d-block ${styles.messageAuthor}`}
                  >
                    {msg.from === "you" ? "You" : "Opponent"}
                  </span>
                  {msg.message}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder={disabled ? "Room closed" : "Type a message..."}
            value={input}
            disabled={disabled}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={sendMessage}
            disabled={disabled}
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
