// server.js
import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

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

const PORT = process.env.PORT || 5001;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor escuchando en puerto ${PORT}`);
});