import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || "",
});

redisClient.on("connect", () => {
  console.log("Worker connected to Redis successfully.");
});

redisClient.on("error", (err) => {
  console.error("Worker Redis connection error:", err);
});

export async function addMessageToRedisQueue(message: any) {
  try {
    const messageString = JSON.stringify(message);

    console.log("Attempting to push message to Redis queue:", messageString);
    const result = await redisClient.rpush("testQueue", messageString);
    console.log(
      "Message pushed to Redis queue successfully. Queue length:",
      result
    );
  } catch (error) {
    console.error("Error adding message to Redis queue:", error);
  }
}

async function processMessages() {
  while (true) {
    try {
      const result = await redisClient.blpop("testQueue", 0);
      const message = JSON.parse(result[1]);
      console.log("Processing message from Redis queue:", message);

      await redisClient.publish("websocket:process", JSON.stringify(message));
      console.log("Message published to WebSocket server:", message);
    } catch (error) {
      console.error("Error processing message from Redis queue:", error);
    }
  }
}

processMessages();
