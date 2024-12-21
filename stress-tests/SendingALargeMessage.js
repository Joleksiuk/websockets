import ws from "k6/ws";
import { check, sleep } from "k6";
import {
  registerUser,
  loginUser,
  generateRandomIpAddress,
} from "./AuthService.js";
import { baseUrl } from "./TestConstants.js";

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

function sendHugeMessage(wsArg) {
  const somethingMessage = {
    eventName: "SEND CHAT MESSAGE",
    payload: {
      message: generateLargeMessage(10),
    },
  };
  wsArg.send(JSON.stringify(somethingMessage));
}

function sendPong(wsArg) {
  console.log("Sending PONG message to server");
  const pongMessage = {
    eventName: "PONG",
    payload: null,
  };
  wsArg.send(JSON.stringify(pongMessage));
}

export default function () {
  const username = `user${__VU}${Math.random().toString(36).substring(2, 7)}`;
  const password = "testpassword";

  registerUser(baseUrl, username, password);
  const loginData = loginUser(baseUrl, username, password);
  console.log(
    `User ${loginData.username} logged in with JWT: ${loginData.jwt}`
  );

  const wsUrl = `wss://localhost:8082?access_token=${loginData.jwt}`;
  let closedByTimeout = false;

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

        // Loop to send "something" message continuously
        // while (true) {
        //   sendSomething(socket);
        // }
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
        socket.close();
      }, 50000);
    }
  );

  check(res, {
    "WebSocket connection closed by timeout": () => closedByTimeout,
    "WebSocket not closed prematurely by server": () => !closedByTimeout,
  });

  return loginData;
}
