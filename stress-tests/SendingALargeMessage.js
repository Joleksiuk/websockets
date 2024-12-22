import ws from "k6/ws";
import { check, sleep } from "k6";
import { generateRandomIpAddress } from "./AuthService.js";

export const options = {
  vus: 1,
  iterations: 1,
};

function generateLargeMessage(sizeInMB = 10) {
  const sizeInBytes = sizeInMB * 1024 * 1024; // Convert MB to Bytes
  const baseString = "A".repeat(1024); // Create a 1 KB string
  const iterations = Math.ceil(sizeInBytes / baseString.length); // Calculate the number of repetitions
  const largeMessage = Array(iterations).fill(baseString).join(""); // Create the large message

  console.log(
    `Generated message size: ${(largeMessage.length / (1024 * 1024)).toFixed(
      2
    )} MB`
  );
  return largeMessage;
}

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
    payload: {
      userId: 123,
      roomdId: 2,
      message: generateLargeMessage(10),
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
      });

      socket.on("error", function (e) {
        console.error(`WebSocket error: ${e.message}`);
      });

      socket.setTimeout(() => {
        closedByTimeout = true;
        console.log("WebSocket connection closed by timeout");
        socket.close();
      }, 30000);
    }
  );

  check(res, {
    "WebSocket connection closed by timeout": () => closedByTimeout,
  });
}
