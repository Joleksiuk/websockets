import { Request, Response, NextFunction } from "express";
import { publishMessage } from "../rabbitmq";

export class RabbitMQController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;
      await publishMessage("task_queue", { message });
      res.status(200).json({ success: true, message: "Message sent to queue" });
    } catch (error) {
      next(error);
    }
  }
}
