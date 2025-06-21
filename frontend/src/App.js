// ─────────────────── src/App.js ───────────────────
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    // For HTTPS in prod switch to wss://<your-domain>/ws/echo/
    const socket = new WebSocket("ws://localhost/ws/echo/");
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("🔌 WebSocket connected");
      socket.send("Frontend says hello!"); // handshake test
    };

    socket.onmessage = (event) => {
      // EchoConsumer sends back plain text OR JSON; handle either
      let data = event.data;
      try {
        data = JSON.parse(event.data);
        // If you kept my earlier EchoConsumer example:
        data = data.echo ?? JSON.stringify(data);
      } catch (_) {
        /* not JSON, leave as-is */
      }
      setMessages((prev) => [...prev, data]);
    };

    socket.onclose = () => console.log("WebSocket closed");
    socket.onerror = (err) => console.error("WebSocket error", err);

    return () => socket.close(); // clean up on unmount
  }, []);

  const sendPing = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send("Ping from React at " + new Date().toLocaleTimeString());
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Real-time WebSocket demo</h2>
        <button onClick={sendPing}>Send Ping</button>
        <ul style={{ textAlign: "left", maxWidth: 400 }}>
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
