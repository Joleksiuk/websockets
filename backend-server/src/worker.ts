import { handleMessage } from "./websocket/WebsocketMessageService";
import { ClientMessage } from "./websocket/WebsocketModels";
import Queue from "bull";

export const taskQueue = new Queue<ClientMessage>("taskQueue", {
  redis: {
    host: process.env.REDIS_HOST || "localhost", // Default to 'localhost' for local development
    port: parseInt(process.env.REDIS_PORT || "6379", 10), // Ensure port is a number
    password: process.env.REDIS_PASSWORD || "", // Optional if Redis is secured
  },
});

taskQueue.process(async (job) => {
  console.log(`Processing job ${job.id} with data:`, job.data);
  await handleMessage(job.data);
  console.log(`Job ${job.id} completed successfully.`);
});

taskQueue.on("completed", (job) => {
  console.log(`Job ${job.id} has been completed.`);
});

taskQueue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

console.log("Worker is listening for tasks...");
