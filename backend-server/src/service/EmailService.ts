import nodemailer from "nodemailer";

import jwt from "jsonwebtoken";
import { EMAIL, EMAIL_PASS, JWT_SECRET } from "../config";

export const generateConfirmationToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

export const sendEmail = async (to, subject, html, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Chat application Demo" <${EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("E-mail sent!");
  } catch (error) {
    console.error("There was an error while sending an email:", error);
  }
};
