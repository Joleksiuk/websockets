import ws from "k6/ws";
import { check, sleep } from "k6";
import { generateRandomIpAddress } from "./AuthService.js";

export const options = {
  vus: 10,
  iterations: 10,
  duration: "2m",
};

function isPing(data) {
  console.log(`Received message from server: ${data}`);
  if (data.eventName === "PING") {
    return true;
  }
  return false;
}

function sendPong(wsArg) {
  sleepForRandomTime();
  console.log("Sending PONG message to server");
  const pongMessage = {
    eventName: "PONG",
    payload: null,
  };
  wsArg.send(JSON.stringify(pongMessage));
}

function sleepForRandomTime() {
  const randomDelay = Math.random();
  sleep(randomDelay);
}

export default function () {
  let closedByTimeout = false;
  sleepForRandomTime();

  const wsUrl = `wss://localhost:8082?access_token=`;
  const randomDelay = Math.random() * 0.1;
  sleep(randomDelay);

  const res = ws.connect(
    wsUrl,
    {
      headers: {
        origin: `https://localhost:3000`,
        "X-Forwarded-For": generateRandomIpAddress(),
      },
    },
    function (socket) {
      socket.on("open", function () {
        console.log("WebSocket connection established!");
      });

      socket.on("message", function (message) {
        console.log("Received message from server:", message);
        if (isPing(JSON.parse(message))) {
          sendPong(socket);
        }
      });

      socket.on("close", function () {
        if (!closedByTimeout) {
          console.warn("Connection was closed by the server prematurely");
        }
      });

      socket.on("error", function (e) {
        console.error(`WebSocket error: ${e.message}`);
      });

      socket.setTimeout(() => {
        closedByTimeout = true;
        console.log("WebSocket connection closed by timeout");
        socket.close();
      }, 50000);
    }
  );

  check(res, {
    "WebSocket connection closed by timeout": () => closedByTimeout,
  });
}
