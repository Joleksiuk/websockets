import ws from "k6/ws";
import { check } from "k6";
import { Counter } from "k6/metrics";
import { generateRandomIpAddress } from "./AuthService.js";

// Custom metrics for tracking connections and failed checks
const totalConnections = new Counter("total_connections");
const failedChecks = new Counter("failed_checks");

export const options = {
  stages: [
    { duration: "12m", target: 10000 }, // Ramp up to 10,000 VUs in 12 minutes
  ],
};

export default function () {
  let closedByTimeout = false;
  let prematureClosure = false;

  const wsUrl = `wss://localhost:8082?access_token=`;

  // Each VU establishes a single WebSocket connection
  const res = ws.connect(
    wsUrl,
    {
      headers: {
        origin: `https://localhost:3000`,
        "X-Forwarded-For": generateRandomIpAddress(),
      },
    },
    function (socket) {
      socket.on("message", function (message) {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.eventName === "PING") {
          const pongMessage = { eventName: "PONG", payload: null };
          socket.send(JSON.stringify(pongMessage));
        }
      });

      socket.on("close", function () {
        if (!closedByTimeout) {
          prematureClosure = true; // Track premature closure
        }
      });

      socket.on("error", function () {
        prematureClosure = true; // Track error
      });

      // Automatically close the WebSocket connection after 13 seconds
      socket.setTimeout(() => {
        closedByTimeout = true;
        socket.close();
      }, 10000 * 13);
    }
  );

  // Increment total connections (shared metric)
  totalConnections.add(1);

  // Check for premature closure
  const passed = check(res, {
    "WebSocket connection not prematurely closed": () => !prematureClosure,
  });

  if (!passed) {
    failedChecks.add(1); // Increment failed checks
  }

  // Log every 1000 connections globally
  if (totalConnections.value % 1000 === 0) {
    console.log(
      `Connections: ${totalConnections.value}, Failed checks so far: ${failedChecks.value}`
    );
  }
}
