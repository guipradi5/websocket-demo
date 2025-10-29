import { useEffect, useState } from "react";

function App() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const socket = new WebSocket("wss://websocket-demo.on.shiper.app:5001");
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
      ws.send(input);
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
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe un mensaje..."
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}

export default App;
