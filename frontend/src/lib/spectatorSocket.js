import { io } from "socket.io-client";
import { API_BASE_URL } from "@/config/api.config";

const spectatorSocket = io(`${API_BASE_URL}/spectator`, {
  withCredentials: true,
  autoConnect: false,
});

export default spectatorSocket;
