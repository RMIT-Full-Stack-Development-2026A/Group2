import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";

export default function useGameChat(roomCode, disabled = false) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    function handleNewMessage({ message }) {
      setMessages((prev) => [...prev, { from: "opponent", message }]);
    }

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    const message = input.trim();
    if (disabled || !message) return;

    socket.emit("sendMessage", { roomCode, message });
    setMessages((prev) => [...prev, { from: "you", message }]);
    setInput("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") sendMessage();
  }

  return {
    messages,
    input,
    setInput,
    bottomRef,
    sendMessage,
    handleKeyDown,
  };
}
