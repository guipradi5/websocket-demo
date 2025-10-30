// server.js
import express from "express";
import { WebSocketServer } from "ws";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("🔌 Nueva conexión");

    ws.on("message", (msg) => {
        console.log("📩 Mensaje recibido:", msg.toString());

        // reenviamos el mensaje a todos los clientes conectados
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(msg.toString());
            }
        });
    });

    ws.send("👋 Conectado al servidor WebSocket!");
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");

app.use(express.static(distDir));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor escuchando en puerto ${PORT}`);
});