import ws from "k6/ws";
import { check, sleep } from "k6";
import { generateRandomIpAddress } from "./AuthService.js";

export const options = {
  stages: [
    { duration: "1m", target: 1000 },
    { duration: "1m", target: 2000 },
    { duration: "1m", target: 3000 },
    { duration: "1m", target: 4000 },
    { duration: "1m", target: 5000 },
    { duration: "1m", target: 6000 },
    { duration: "1m", target: 7000 },
    { duration: "1m", target: 8000 },
    { duration: "1m", target: 9000 },
    { duration: "1m", target: 10000 },
  ],
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
  const pongMessage = {
    eventName: "PONG",
    payload: null,
  };
  wsArg.send(JSON.stringify(pongMessage));
}

function sendChatMessage(wsArg) {
  sleepForRandomTime();
  const pongMessage = {
    eventName: "SEND CHAT MESSAGE",
    payload: {
      userId: 123,
      roomdId: 2,
      message: "Hello, world! This is a chat message!",
    },
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
        clearInterval(sendChatMessageInterval);
      });

      socket.on("error", function (e) {
        console.error(`WebSocket error: ${e.message}`);
      });

      socket.setTimeout(() => {
        closedByTimeout = true;
        console.log("WebSocket connection closed by timeout");
        socket.close();
      }, 30000);

      const sendChatMessageInterval = setInterval(() => {
        if (socket.readyState === 1) {
          sendChatMessage(socket);
        }
      }, 1000);
    }
  );

  check(res, {
    "WebSocket connection closed by timeout": () => closedByTimeout,
  });
}
