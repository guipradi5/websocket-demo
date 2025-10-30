import { useEffect, useState } from "react";

function App() {
  const [ws, setWs] = useState(null);
  const [username, setUsername] = useState("Anónimo-" + Math.random().toString(36).substring(2, 5));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const wsProtocol = location.protocol === "https:" ? "wss" : "ws";
    const wsHost =
      location.hostname === "localhost"
        ? "localhost:5000"
        : location.host;

    const socket = new WebSocket(`${wsProtocol}://${wsHost}`);
    setWs(socket);

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onopen = () => console.log("🔗 Conectado al servidor WebSocket");
    socket.onclose = () => console.log("❌ Desconectado del servidor");

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (ws && input.trim() !== "") {
      const fullMessage = `${username}: ${input}`;
      ws.send(fullMessage);
      setInput("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>💬 Chat WebSocket</h1>
      <div
        style={{
          border: "1px solid #ccc",
          height: 200,
          overflowY: "auto",
          marginBottom: 10,
          padding: 10,
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
      <div>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nombre de usuario" />
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe un mensaje..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}

export default App;
