import { useState, useEffect, useRef } from "react";
import socket from "@/lib/socket";

export default function GameChat({ roomCode, disabled = false }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", ({ message }) => {
      setMessages((prev) => [...prev, { from: "opponent", message }]);
    });

    return () => socket.off("newMessage");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (disabled) return;
    if (!input.trim()) return;
    socket.emit("sendMessage", { roomCode, message: input.trim() });
    setMessages((prev) => [...prev, { from: "you", message: input.trim() }]);
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <section className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex flex-column" style={{ height: "300px" }}>
        <h2 className="h6 mb-2">Game Chat</h2>

        <div
          className="flex-grow-1 overflow-y-auto mb-2"
          style={{ overflowY: "auto" }}
        >
          {messages.length === 0 ? (
            <p className="text-secondary small text-center mt-3">
              No messages yet. Say hi!
            </p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`d-flex mb-1 ${msg.from === "you" ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  className={`px-3 py-1 rounded-3 small ${
                    msg.from === "you"
                      ? "bg-primary text-white"
                      : "bg-light text-dark"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  <span className="fw-semibold d-block" style={{ fontSize: "10px" }}>
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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSend}
            disabled={disabled}
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
