// server.js
console.log("🟢 INICIO EFECTIVO server.js (antes de cualquier import)");

import express from "express";
import { WebSocketServer } from "ws";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

console.log("🚀 Servidor iniciando...");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

console.log("✅ Express y WebSocket Server inicializados.");

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

console.log(`📂 Sirviendo archivos estáticos desde: ${distDir}`);

app.use(express.static(distDir));
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

console.log("✅ Rutas de archivos estáticos configuradas.");

const PORT = process.env.PORT || 5000;
console.log(`👂 Intentando escuchar en el puerto ${PORT} en 0.0.0.0...`);

server.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor escuchando en puerto ${PORT}`);
});