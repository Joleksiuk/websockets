import { WebSocketServer } from "ws";
import si from "systeminformation";
import https from "https";
import fs from "fs";

// Load SSL certificates
const server = https.createServer({
  cert: fs.readFileSync("cert.pem"), // Path to your cert.pem file
  key: fs.readFileSync("key.pem"), // Path to your key.pem file
});

// Initialize WebSocket server with HTTPS
const wss = new WebSocketServer({ server });

console.log("WebSocket server is running on wss://localhost:8080");

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });
  ws.send("something");

  setInterval(async () => {
    const cpuLoad = JSON.stringify(await si.currentLoad());
    ws.send(cpuLoad);
  }, 1000);
});

// Start the HTTPS server
server.listen(8080, () => {
  console.log("HTTPS server is running on port 8080");
});
