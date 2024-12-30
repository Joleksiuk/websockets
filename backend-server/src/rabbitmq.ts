import amqp from "amqplib";

let channel: amqp.Channel | null = null;

export async function connectRabbitMQ() {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const connection = await amqp.connect(
        `amqp://${process.env.RABBITMQ_HOST || "localhost"}:${
          process.env.RABBITMQ_PORT || 5672
        }`
      );
      channel = await connection.createChannel();
      console.log("Connected to RabbitMQ");

      await channel.assertQueue("websocket_queue", { durable: true });
      await channel.assertQueue("api_queue", { durable: true });

      return channel;
    } catch (error) {
      console.error(`RabbitMQ connection attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        throw new Error("Failed to connect to RabbitMQ after maximum retries");
      }
    }
  }
}

export async function publishMessage(queue: string, message: any) {
  if (!channel) {
    console.error("RabbitMQ channel is not initialized");
    return;
  }
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  console.log(`Message sent to queue ${queue}:`, message);
}

export async function consumeMessages(
  queue: string,
  onMessage: (msg: any) => void
) {
  if (!channel) {
    console.error("RabbitMQ channel is not initialized");
    return;
  }
  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      console.log(`Received message from queue ${queue}:`, content);
      onMessage(content);
      channel?.ack(msg);
    }
  });
}
