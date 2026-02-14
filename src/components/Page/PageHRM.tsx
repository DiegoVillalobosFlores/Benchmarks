import { useEffect } from "react";

const HMR_PORT = 3001;

const URL = `ws://localhost:${HMR_PORT}/websockets/__dev/hmr`;

export default function PageHRM() {
  useEffect(() => {
    const socket = new WebSocket(URL);
    console.log("PageHRM initialized");
    const listener = () => {
      console.log("PageHRM opened");
    };

    const messageListener = (event: MessageEvent) => {
      console.log(event.data);
    };

    const errorListener = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    const closeListener = () => {
      console.log("PageHRM closed");
      setTimeout(() => {
        window.location.reload();
      }, 200);
    };

    socket.addEventListener("open", listener);
    socket.addEventListener("message", messageListener);
    socket.addEventListener("error", errorListener);
    socket.addEventListener("close", closeListener);

    return () => {
      socket.removeEventListener("open", listener);
      socket.removeEventListener("message", messageListener);
      socket.removeEventListener("error", errorListener);
      socket.removeEventListener("close", closeListener);
    };
  }, []);

  return null;
}
