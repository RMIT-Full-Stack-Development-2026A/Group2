import { io } from "socket.io-client";
import { API_BASE_URL, getAuthToken } from "@/config/api.config";

const socket = io(API_BASE_URL, {
  withCredentials: true,
  autoConnect: false,
  auth: (cb) => cb({token: getAuthToken() }),
});

export default socket;

