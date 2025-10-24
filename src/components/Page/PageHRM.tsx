import { useEffect } from "react";

const URL = "ws://localhost:3000/websockets/__dev/hmr";

export default function PageHRM() {
  const socket = new WebSocket(URL);

  useEffect(() => {
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
  }, [socket]);

  return <></>;
}
