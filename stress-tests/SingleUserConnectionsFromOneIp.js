import ws from "k6/ws";
import { check } from "k6";
import { registerUser, loginUser } from "./AuthService.js";
import { baseUrl } from "./TestConstants.js";

export const options = {
  vus: 10, // Single virtual user for registration and login
  iterations: 10, // Run once for this part
};

export default function () {
  const username = `user${__VU}${Math.random().toString(36).substring(2, 7)}`;
  const password = "testpassword";

  registerUser(baseUrl, username, password);
  const loginData = loginUser(baseUrl, username, password);
  console.log(
    `User ${loginData.username} logged in with JWT: ${loginData.jwt}`
  );

  const wsUrl = `wss://localhost:8082?access_token=${loginData.jwt}`;

  const res = ws.connect(
    wsUrl,
    {
      headers: {
        origin: `https://localhost:3000`,
      },
    },
    function (socket) {
      socket.on("open", function () {
        console.log("WebSocket connection established!");
      });

      socket.on("message", function (message) {
        console.log(`Received: ${message}`);
      });

      socket.on("close", function () {
        console.log("WebSocket connection closed");
      });

      socket.on("error", function (e) {
        console.error(`WebSocket error: ${e.message}`);
      });

      socket.setTimeout(() => {
        socket.close();
      }, 5000);
    }
  );

  check(res, {
    "WebSocket connection established": (r) => r && r.status === 101,
  });
}
