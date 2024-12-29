import Redis from "ioredis";
import { ClientMessage } from "./websocket/WebsocketModels";
import Queue from "bull";

export const taskQueue = new Queue<ClientMessage>("taskQueue", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || "",
  },
});

const redisPublisher = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || "",
});

taskQueue.process(async (job) => {
  console.log(`Processing job ${job.id} with data:`, job.data);

  try {
    await redisPublisher.publish("websocket:process", JSON.stringify(job.data));
    console.log(`Job ${job.id} delegated to WebSocket server.`);
  } catch (error) {
    console.error(`Failed to delegate job ${job.id}:`, error);
  }
});
